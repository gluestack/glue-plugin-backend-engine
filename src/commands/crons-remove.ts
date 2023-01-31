import path from 'path';
import { GlueStackPlugin } from "src";
import { writeFile } from '../helpers/write-file';
import { fileExists } from "../helpers/file-exists";

const { MultiSelect, confirm } = require('enquirer');

export function cronsRemove(program: any, glueStackPlugin: GlueStackPlugin) {
	program
		.command("cron:remove")
		.description(
			"List the cron jobs with select option",
		)
		.action(() => deleteEvents(glueStackPlugin));
}

export async function deleteEvents(
	_glueStackPlugin: GlueStackPlugin,
) {

	const cronsFilePath = './backend/crons/crons.json';
	if (!await fileExists(cronsFilePath)) {
		console.log('error: cron file missing!');
		process.exit(0);
	}

	const dataFilePath = path.join(process.cwd(), cronsFilePath.slice(2));
	const fileData = require(dataFilePath);

	if (fileData.length <= 0) {
		console.log(`error: cron file empty! please add one and try again.\nyou can add cron "node glue cron:add --s <schedule-value> --w <webhook-url> or --f <function-name>"`);
		process.exit(0);
	}

	let choices = fileData.map((obj: any, index: any) => ({
		name: `{"schedule": "${obj.schedule}", "type": "${obj.type}", "value": "${obj.value}"}`,
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

			await writeFile(cronsFilePath, JSON.stringify(choices, null, 2));
			console.log("Successfully removed!");
		}
	}

}
