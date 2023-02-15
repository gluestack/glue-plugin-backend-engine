import { join } from "path";
import { GlueStackPlugin } from "src";

const prompts = require("prompts");
const { getDirectories } = require("@gluestack/helpers");
const { getFiles } = require("@gluestack/helpers");
const { writeFile } = require("@gluestack/helpers");

export function eventRemove(program: any, glueStackPlugin: GlueStackPlugin) {
	program
		.command("event:remove")
		.option("--t, --type <type>", "type of the event. Options: 'database' or 'app'", "app")
		.description("Remove events")
		.action((args: any) => deleteEvents(glueStackPlugin, args));
}

export async function deleteEvents(
	_glueStackPlugin: GlueStackPlugin,
	args: any
) {
	const { type } = args;
	if (!["database", "app"].includes(type)) {
		console.log("> Event type must be either 'database' or 'app'");
		process.exit(-1);
	}

	const directoryPath: string = join(
		process.cwd(),
		`./backend/events/`,
		type
	);

	const events: any = await scanAllEvents(type, directoryPath);
	if (!events || !Object.keys(events[type]).length) {
		console.log(`> No "${type}" events found`);
		process.exit(-1);
	}

	const { removables, confirm } = await removeEvents(events[type]);
	if (!confirm) {
		console.log("> Aborted");
		process.exit(-1);
	}

	const eventsMap = new Map();
	for await (const event of events[type]) {
		if (!eventsMap.has(event.path)) {
			eventsMap.set(event.path, require(event.path)());
		}
	}

	for await (const removeEvent of removables) {
		const eventsArray = eventsMap.get(removeEvent.path);
		const eventIndex = eventsArray.findIndex(
			(event: any) => JSON.stringify(event) === JSON.stringify(removeEvent.content)
		);
		if (eventIndex === -1) {
			console.log(`> Event not found in file: ${removeEvent.file}`);
			continue;
		}

		eventsArray.splice(eventIndex, 1);
		await writeFile(
			removeEvent.path,
			`module.exports = () => ${JSON.stringify([...eventsArray], null, 2)};`
		);
	}
};

const scanAllEvents = async (type: string, directoryPath: string) => {
	let events: any = {};
	events[type] = [];

	if (type === "app") {
		const files = await getFiles(directoryPath);
		for await (const file of files) {
			const path = join(directoryPath, file);
			const contents = require(path)();
			for await (const content of contents) {
				events[type].push({ type, file, path, content });
			}
		}
		return events;
	}

	const dirs = await getDirectories(directoryPath);
	for await (const dir of dirs) {
		;

		const tablepath = join(directoryPath, dir);
		const files = await getFiles(tablepath);
		for await (const file of files) {

			const path = join(tablepath, file);
			const contents = require(path)();
			for await (const content of contents) {
				events[type].push({ type, dir, file, path, content });
			}
		}
	}

	return events;
};

const removeEvents = async (events: any) => {
	const choices = events.map((_event: any) => ({
		title: `${_event.type}${_event.dir ? ' > ' + _event.dir : ''} > ${_event.file} > ${JSON.stringify(_event.content)}`,
		value: { ..._event }
	}));

	const { removables, confirm } = await prompts([{
		type: "multiselect",
		name: "removables",
		message: "Select event(s) to remove",
		choices,
		min: 1
	}, {
		type: "confirm",
		name: "confirm",
		message: "Are you sure you want to remove these event(s)?"
	}]);

	return { removables, confirm };
};
