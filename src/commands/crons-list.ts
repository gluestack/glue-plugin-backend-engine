import { GlueStackPlugin } from "src";
import { fileExists } from "../helpers/file-exists";
import path from "path";
import Table from "cli-table3";
import { timeStamp } from "../helpers/file-time-stamp";
const colors = require("colors");

export function cronsList(program: any, glueStackPlugin: GlueStackPlugin) {
	program
		.command("crons:list")
		.description("List all crons")
		.action(() => list(glueStackPlugin));
}

export async function list(_glueStackPlugin: GlueStackPlugin) {
	const cronsFilePath = "./backend/crons/crons.json";
	let table = new Table({
		head: [
			colors.brightGreen("Schedule"),
			colors.brightGreen("Run"),
		],
	});

	if (!(await fileExists(cronsFilePath))) {
		console.log(colors.brightRed("> Crons file missing!"));
		process.exit(0);
	}

	const dataFilePath = path.join(process.cwd(), cronsFilePath.slice(2));
	const fileData = require(dataFilePath);

	if (fileData.length <= 0) {
		console.log(colors.brightRed("> Crons file empty! Please add one and try again."));
		process.exit(0);
	}

	for await (const data of fileData) {
		const run = data.type === 'function' ? `function() [${data.value}]` : `webhook-url [${data.value}]`
		table.push({ [data.schedule]: [run] });
	}

	console.log(table.toString());

	const lastModified = await timeStamp(cronsFilePath)
	console.log(colors.yellow(`Crons last updated: ${lastModified}`))
}
