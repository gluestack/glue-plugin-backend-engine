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
		.command("event:add")
		.option(
			"--t, --table <table-name:event>",
			"name of the table and event in database (table-name:event1,event2)"
		)
		.option("--f, --function <function-name>", "name of the function (required --m)")
		.option("--m, --method <method-name>", "name of the method in function (required --f)")
		.option("--w, --webhook <webhook-url>", "webhook URL")
		.option("--a, --app <app-name>", "name of the event")
		.description("Create the event")
		.action((args: any) => {
			create(glueStackPlugin, args);
		});
}

export async function create(_glueStackPlugin: GlueStackPlugin, args: any) {
	let fileContent: string;
	let content: contentType;
	const dbEventPath = "./backend/events/database";
	const appEventPath = "./backend/events/app";

	if (!args.table && !args.app) {
		console.log(
			"error: option required you can add '--t, <table-name:event>' or '--a, <app-name>' add --help for more information"
		);
		process.exit(0);
	}

	// if (!args.table && !args.function && !args.webhook && !args.app) {
	// 	console.log(
	// 		"error: option required you can  --table, --function, --webhook, --app"
	// 	);
	// 	process.exit(0);
	// }

	switch (true) {
		case "function" in args && "webhook" in args || !args.hasOwnProperty("function") && !args.hasOwnProperty("webhook"):
			console.log("error: required one option you can add '--f <function-name>' or '--w <webhook-url>' add --help for more information");
			process.exit(0);

		case "table" in args && "app" in args:
			console.log("error: required one option you can add '--t, <table-name:event>' or '--a, <app-name>' add --help for more information");
			process.exit(0);

		case args.hasOwnProperty('function') && !args.hasOwnProperty('method'):
			console.log("error: required method name with function you can add '--m <method-name>' add --help for more information");
			process.exit(0);

		case args.hasOwnProperty("function") && args.hasOwnProperty("method"):
			content = await createContent("function", args);
			break;

		case args.hasOwnProperty("webhook"):
			content = await createContent("webhook", args);
			break;
	}

	if (args.hasOwnProperty("table")) {
		try {
			const validEvents = ['delete', 'update', 'insert'];
			const [folderName, ...events] = args.table.split(":");
			args.table = { folderName, events: events[0].split(",") };

			for (const event of args.table.events) {
				if (!validEvents.includes(event)) {
					console.log(`error: "${event}" is invalid! valid events are 'insert', 'update' and 'delete'.`)
				}
			}

			args.table.events = args.table.events.filter((event: string) => validEvents.includes(event));

		} catch (error) {
			console.log("error: --table argument is invalid! valid format is '--t table-name:event-name' add --help for more information");
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
							console.log(`${content.type} already exist in event "${element}"!`);
							continue;
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
				console.log(`Successfully created event "${element}"`);
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
						console.log(`${content.type} already exist in "${args.app}"`);
						process.exit(0);
					}
				}
				arrayOfObjects.push(content);
				fileContent = `module.exports = ()=> ${JSON.stringify(arrayOfObjects, null, 2)};`;
			} else {
				fileContent = `module.exports = () => [${JSON.stringify(content, null, 2)}];`;
			}
			await writeFile(`${appEventPath}/${args.app}.js`, fileContent);
			console.log(`Successfully created event "${args.app}"`);
		} catch (error) {
			console.log(error);
		}
	}
}

export async function createContent(type: string, value: any) {
	return {
		kind: "sync",
		type: type,
		value: type === 'function' ? `${value.function}::${value.method}` : value.webhook
	};
}
