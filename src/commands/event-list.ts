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
    .command("event:list")
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
      await sortingArray(table);
      console.log(table.toString());
      break;

    case args.hasOwnProperty("app"):
      await getEvents(appEventPath, table, false);
      await sortingArray(table);
      console.log(table.toString());
      break;

    case args.hasOwnProperty("database"):
      await getEvents(dbEventPath, table, false);
      await sortingArray(table);
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
        console.log("error: no files found!");
        process.exit(0);
      }
      return resolve(files);
    });
  });
}

async function sortingArray(table: any) {
  table.sort(async (a: Table, b: Table) => {
    // get the timing value of each object
    let timingA = Object.values(a)[0][2];
    let timingB = Object.values(b)[0][2];

    // check if string not containing a number
    if (timingB.startsWith("a ") || timingB.startsWith("an ")) {
      timingB = "1 " + timingB.substring(2);
    }

    if (timingA.startsWith("a ") || timingA.startsWith("an ")) {
      timingA = "1 " + timingA.substring(2);
    }
    // convert timing to seconds
    const timingAInSeconds = await getSecondsFromTiming(timingA);
    const timingBInSeconds = await getSecondsFromTiming(timingB);
    return timingAInSeconds - timingBInSeconds;
  });
}

async function getSecondsFromTiming(timing: any) {
  let time = timing.match(/\d+/);
  let unit = timing.match(/[a-zA-Z]+/);
  time = time ? time[0] : 1;
  if (unit[0] === "day" || unit[0] === "days") {
    return time * 60 * 60 * 24;
  } else if (unit[0] === "hour" || unit[0] === "hours") {
    return time * 60 * 60;
  } else if (unit[0] === "minute" || unit[0] === "minutes") {
    return time * 60;
  } else if (unit[0] === "year" || unit[0] === "years") {
    return time * 365 * 24 * 60 * 60;
  }
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