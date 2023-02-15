const { fileExists } = require("@gluestack/helpers");

import path from "path";

import { GlueStackPlugin } from "src";
import { timeStamp } from "../helpers/file-time-stamp";
const { ConsoleTable } = require("@gluestack/helpers");


export function cronList(program: any, glueStackPlugin: GlueStackPlugin) {
	program
		.command("cron:list")
		.description("List all Crons")
		.action(() => list(glueStackPlugin));
}

export async function list(_glueStackPlugin: GlueStackPlugin) {
	const cronsFilePath = "./backend/crons/crons.json";

	const head: string[] = [
		"Schedule",
		"Run",
	];

	const rows: any = [];

	if (!(await fileExists(cronsFilePath))) {
		console.log("> Error: cron file missing!");
		process.exit(0);
	}

	const dataFilePath = path.join(process.cwd(), cronsFilePath.slice(2));
	const fileData = require(dataFilePath);

	if (fileData.length <= 0) {
		console.log(`> Error: Cron.json file's empty! Please add one and try again.\n> You can add cron using "node glue cron:add" command.`);
		process.exit(0);
	}

	for await (const data of fileData) {
		const run = data.type === 'function' ? `function() [${data.value}]` : `webhook-url [${data.value}]`
		rows.push({ [data.schedule]: [run] });
	}

	ConsoleTable.print(head, rows);

	const lastModified = await timeStamp(cronsFilePath);
	console.log(`Crons last updated: ${lastModified}`);
}
