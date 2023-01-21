import path from "path";
import { GlueStackPlugin } from "src";
import { writeFile } from "../helpers/write-file";
import { createFolder } from "../helpers/create-folder";
import { fileExists } from "../helpers/file-exists";

const colors = require("colors");

interface contentType {
	kind: string;
	type: string;
	value: string;
}

export function eventsAdd(program: any, glueStackPlugin: GlueStackPlugin) {
	program
		.command("events:add")
		.option(
			"--t, --table <table-name>",
			"Name of the table in database (table-name:event1,event2)"
		)
		.option("--f, --function <function-name>", "Name of the function")
		.option("--w, --webhook <webhook-url>", "Webhook URL")
		.option("--a, --app <app-name>", "Name of the event")
		.description("Create the events")
		.action((args: any) => {
			create(glueStackPlugin, args);
		});
}

export async function create(_glueStackPlugin: GlueStackPlugin, args: any) {
	let fileContent: string;
	let content: contentType;
	const dbEventPath = "./backend/events/database";
	const appEventPath = "./backend/events/app";

	if (!args.table && !args.function && !args.webhook && !args.app) {
		console.log(colors.brightRed(
			"Please provide at least one of the following options: --table, --function, --webhook, --app"
		));
		process.exit(0);
	}

	switch (true) {
		case "function" in args && "webhook" in args || !args.hasOwnProperty("function") && !args.hasOwnProperty("webhook"):
			console.log(colors.brightRed("> enter either --f function or --w webhook-url"));
			process.exit(0);

		case "table" in args && "app" in args:
			console.log(colors.brightRed("> provide either --table or --app"));
			process.exit(0);

		case args.hasOwnProperty("function"):
			content = await createContent("function", args.function);
			break;

		case args.hasOwnProperty("webhook"):
			content = await createContent("webhook", args.webhook);
			break;
	}

	if (args.hasOwnProperty("table")) {

		try {
			const [folderName, ...events] = args.table.split(":");
			args.table = { folderName, events: events[0].split(",") };
		} catch (error) {
			console.log(colors.brightRed("> Table input is not valid please run --help"));
			process.exit(0);
		}

		await createFolder(`${dbEventPath}/${args.table.folderName}`);
		for await (const element of args.table.events) {
			try {
				if (
					await fileExists(
						`${dbEventPath}/${args.table.folderName}/${element}.js`
					)
				) {
					const dbEventFilePath = path.join(
						process.cwd(),
						dbEventPath.slice(2),
						`${args.table.folderName}/${element}.js`
					);
					const data = require(dbEventFilePath);
					const arrayOfObjects = data();

					if (arrayOfObjects.length !== 0) {
						const objExist = arrayOfObjects.find((obj: any) => {
							return (
								obj.kind === content.kind &&
								obj.type === content.type &&
								obj.value === content.value
							);
						});

						if (objExist) {
							console.log(colors.brightRed(`> ${content.type} already exist!`));
							process.exit(0);
						}
					}

					arrayOfObjects.push(content);
					fileContent = `module.exports = () => ${JSON.stringify(arrayOfObjects, null, 2)};`;
				} else {
					fileContent = `module.exports = () => [${JSON.stringify(
						content,
						null,
						2
					)}];`;
				}

				await writeFile(
					`${dbEventPath}/${args.table.folderName}/${element}.js`,
					fileContent
				);
				console.log(colors.brightGreen("> Successfully created!"));
			} catch (error) {
				console.log(error);
			}
		}
	}

	if (args.hasOwnProperty("app")) {
		try {
			if (await fileExists(`${appEventPath}/${args.app}.js`)) {
				const appEventFilePath = path.join(
					process.cwd(),
					appEventPath.slice(2),
					args.app
				);
				const data = require(appEventFilePath);
				const arrayOfObjects = data();

				if (arrayOfObjects.length !== 0) {
					const objExist = arrayOfObjects.find((obj: any) => {
						return (
							obj.kind === content.kind &&
							obj.type === content.type &&
							obj.value === content.value
						);
					});

					if (objExist) {
						console.log(colors.brightRed(`> ${content.type} already exist!`));
						process.exit(0);
					}
				}
				arrayOfObjects.push(content);
				fileContent = `module.exports = ()=> ${JSON.stringify(arrayOfObjects, null, 2)};`;
			} else {
				fileContent = `module.exports = () => [${JSON.stringify(content, null, 2)}];`;
			}
			await writeFile(`${appEventPath}/${args.app}.js`, fileContent);
			console.log(colors.brightGreen("> Successfully created!"));
		} catch (error) {
			console.log(error);
		}
	}
}

export async function createContent(type: string, value: string) {
	return {
		kind: "sync",
		type: type,
		value: value,
	};
}
