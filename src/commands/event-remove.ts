import { GlueStackPlugin } from "src";
import path from "path";
import { fileExists } from "../helpers/file-exists";
import { writeFile } from '../helpers/write-file';
const { MultiSelect, confirm } = require('enquirer');
const colors = require("colors");

export function eventRemove(program: any, glueStackPlugin: GlueStackPlugin) {
	program
		.command("events:remove")
		.option("--a, --app <app-name>", "Name of the event")
		.option(
			"--t, --table <table-name>",
			"Name of the table in database (table-name:event-name)"
		)
		.description("List the events with select option to delete selected events")
		.action((args: any) => deleteEvents(glueStackPlugin, args));
}

export async function deleteEvents(
	_glueStackPlugin: GlueStackPlugin,
	args: any
) {

	let filePath: string;

	switch (true) {
		case "table" in args && "app" in args:
			console.log(colors.brightRed("> provide either --table or --app"));
			process.exit(0);

		case Object.entries(args).length === 0:
			console.log(colors.brightRed("> missing --table or --app"))
			process.exit(0)

		case args.hasOwnProperty('app'):
			filePath = `./backend/events/app/${args.app}.js`;
			break;

		case args.hasOwnProperty('table'):
			const dir = args.table.split(':')[0];
			const file = args.table.split(':')[1];
			filePath = `./backend/events/database/${dir}/${file}.js`;
			break;
	}

	if (!await fileExists(filePath)) {
		console.log(colors.brightRed('> Event file missing!'));
		process.exit(0);
	}

	const dataFilePath = path.join(process.cwd(), filePath.slice(2));
	const fileData = require(dataFilePath);
	const arrayOfObjects = fileData();


	if (arrayOfObjects.length <= 0) {
		console.log(colors.brightRed('> Event file empty! Please add one and try again.'));
		process.exit(0);
	}

	let choices = arrayOfObjects.map((obj: any, index: any) => ({
		name: `{"kind": "${obj.kind}", "type": "${obj.type}", "value": "${obj.value}"}`,
		value: index
	}));

	const prompt = new MultiSelect({
		name: 'files',
		message: 'Select the objects you want to delete by pressing <space>:',
		choices
	});

	const responses = await prompt.run();
	if (responses.length !== 0) {
		const userConfirm = await confirm({
			name: 'question',
			message: 'Are you sure you want to delete the selected data?',
		});

		if (userConfirm) {
			choices = choices
				.filter((choice: any) => !responses.includes(choice.name))
				.map((choice: any) => JSON.parse(choice.name));

			await writeFile(filePath, `module.exports = () => ${JSON.stringify(choices, null, 2)};`);
			console.log(colors.brightGreen("> Successfully removed!"));
		}
	}

}
