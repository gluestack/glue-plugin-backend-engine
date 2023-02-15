const prompts = require("prompts");

const { writeFile } = require("@gluestack/helpers");
const { fileExists } = require("@gluestack/helpers");

import { join } from "path";
import { GlueStackPlugin } from "src";



export function cronRemove(program: any, glueStackPlugin: GlueStackPlugin) {
	program
		.command("cron:remove")
		.description(
			"List the cron jobs with select option",
		)
		.action(() => deleteEvents(glueStackPlugin));
}

export const deleteEvents = async (
	_glueStackPlugin: GlueStackPlugin,
) => {
	const cronsFilePath = './backend/crons/crons.json';
	if (!await fileExists(cronsFilePath)) {
		console.log('error: cron file missing!');
		process.exit(0);
	}

	const dataFilePath = join(process.cwd(), cronsFilePath.slice(2));
	const crons = require(dataFilePath);

	if (crons.length <= 0) {
		console.log(`> Error: crons.json file is empty! Please add one and try again.\n> You can add cron "node glue cron:add"`);
		process.exit(0);
	}

	const { removables, confirm } = await removeCrons(crons);
	if (!confirm) {
		console.log("> Aborted");
		process.exit(-1);
	}

	const newCrons = crons.filter((_: any, index: any) => !removables.includes(index));
	await writeFile(dataFilePath, JSON.stringify(newCrons, null, 2));
};

const removeCrons = async (crons: any) => {
	const choices: any = crons.map((obj: any, index: any) => ({
		title: `{"schedule": "${obj.schedule}", "type": "${obj.type}", "value": "${obj.value}"}`,
		value: index
	}));

	const { removables, confirm } = await prompts([{
		type: "multiselect",
		name: "removables",
		message: "Select cron(s) to remove",
		choices,
		min: 1
	}, {
		type: "confirm",
		name: "confirm",
		message: "Are you sure you want to remove these cron(s)?"
	}]);

	return { removables, confirm };
};