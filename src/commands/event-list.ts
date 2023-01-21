import { GlueStackPlugin } from "src";

import fs from "fs";
import path from "path";
import Table from "cli-table3";
import promises from "fs/promises";
import { timeStamp } from "../helpers/file-time-stamp";

const colors = require("colors");

interface listObject {
	fileName: string;
	event: {
		fun: Array<String>;
		webhook: Array<String>;
	};
	lastModified: string;
}

export function eventsList(program: any, glueStackPlugin: GlueStackPlugin) {
	program
		.command("events:list")
		.option("--all", "list all the events")
		.option("--app", "list all app events")
		.option("--database", "list all database events")
		.description("List the events")
		.action((args: any) => list(glueStackPlugin, args));
}

export async function list(_glueStackPlugin: GlueStackPlugin, args: any) {
	const dbEventPath = "./backend/events/database";
	const appEventPath = "./backend/events/app";

	let table = new Table({
		head: [
			colors.brightGreen("Filepath"),
			colors.brightGreen("Functions"),
			colors.brightGreen("Webhooks"),
			colors.brightGreen("Modified on"),
		],
	});
	switch (true) {
		case args.hasOwnProperty("all") || Object.entries(args).length === 0:
			await getEvents(appEventPath, table, false);
			await getEvents(dbEventPath, table, false);
			console.log(table.toString());
			break;

		case args.hasOwnProperty("app"):
			await getEvents(appEventPath, table, false);
			console.log(table.toString());
			break;

		case args.hasOwnProperty("database"):
			await getEvents(dbEventPath, table, false);
			console.log(table.toString());
			break;
	}
}

async function getEvents(eventPath: any, table: any, dbEvent: boolean) {
	const files: any = await getFiles(eventPath);
	let listData: listObject;
	try {
		for await (const file of files) {
			let eventFilePath;
			if (!dbEvent) {
				eventFilePath = path.join(process.cwd(), eventPath.slice(2), file);
			} else {
				eventFilePath = eventPath;
			}

			const isDir: any = dbEvent ? false : await isDirectory(eventFilePath);

			if (!isDir) {
				const eventFilePath = dbEvent
					? path.join(eventPath, file)
					: path.join(process.cwd(), eventPath.slice(2), file);

				const data = require(eventFilePath);
				const arrayOfObjects = data();
				listData = {
					fileName: dbEvent
						? eventFilePath.split("/").slice(-3).join("/")
						: eventFilePath.split("/").slice(-2).join("/"),
					event: {
						fun: [],
						webhook: [],
					},
					lastModified: "",
				};
				const lastModifiedDays: any = await timeStamp(eventFilePath);
				listData.lastModified = lastModifiedDays;

				await arrayOfObjects.map((events: any) => {
					if (events.type === "function") {
						listData.event.fun.push(events.value);
					}

					if (events.type === "webhook") {
						listData.event.webhook.push(events.value);
					}
				});

				const allFunction = listData.event.fun.join("\n");
				const allWebhooks = listData.event.webhook.join("\n");
				const lastModified = listData.lastModified;

				table.push({
					[listData.fileName]: [allFunction, allWebhooks, lastModified],
				});
			} else {
				await getEvents(eventFilePath, table, true);
			}
		}
	} catch (error) {
		console.log(error);
	}
}

async function getFiles(filePath: string) {
	return new Promise((resolve, reject) => {
		fs.readdir(filePath, (err: Error, files: string[]) => {
			if (err) {
				console.log(colors.brightRed("> No files found!"));
				process.exit(0);
			}
			return resolve(files);
		});
	});
}

async function isDirectory(path: any) {
	try {
		const data = await promises.lstat(path);
		if (data.isDirectory()) {
			return true;
		} else {
			return false;
		}
	} catch (error) {
		console.log(error);
		process.exit(0);
	}
}
