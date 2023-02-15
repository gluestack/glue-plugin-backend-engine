import { GlueStackPlugin } from "src";

import path from "path";
import { lstat, readdir } from "fs/promises";
import { timeStamp } from "../helpers/file-time-stamp";

const { ConsoleTable } = require("@gluestack/helpers")

interface listObject {
  fileName: string;
  event: {
    fun: Array<String>;
    webhook: Array<String>;
  };
  lastModified: string;
}

export function eventList(program: any, glueStackPlugin: GlueStackPlugin) {
  program
    .command("event:list")
    .option("--all", "list all the events")
    .option("--app", "list all app events")
    .option("--database", "list all database events")
    .description("List the events")
    .action((args: any) => list(glueStackPlugin, args));
}

const list = async (_glueStackPlugin: GlueStackPlugin, args: any) => {
  const dbEventPath = "./backend/events/database";
  const appEventPath = "./backend/events/app";

  const head: string[] = [
    "Filepath",
    "Functions",
    "Webhooks",
    "Modified on",
  ]

  const rows: any = [];

  switch (true) {
    case args.hasOwnProperty("all") || Object.entries(args).length === 0:
      await getEvents(appEventPath, rows, false);
      await getEvents(dbEventPath, rows, false);
      await sortingArray(rows);
      ConsoleTable.print(head, rows);
      break;

    case args.hasOwnProperty("app"):
      await getEvents(appEventPath, rows, false);
      await sortingArray(rows);
      ConsoleTable.print(head, rows);
      break;

    case args.hasOwnProperty("database"):
      await getEvents(dbEventPath, rows, false);
      await sortingArray(rows);
      ConsoleTable.print(head, rows);
      break;
  }
};

const getEvents = async (eventPath: any, table: any, dbEvent: boolean) => {
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

const getFiles = async (filePath: string) => {
  const files: string[] = await readdir(filePath);
  return (!files || files.length === 0) ? [] : files;
};

const sortingArray = async (table: any) => {
  table.sort(async (a: any, b: any) => {
    // get the timing value of each object
    //@ts-ignore
    let timingA = Object.values(a)[0][2];
    //@ts-ignore
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
};

const getSecondsFromTiming = async (timing: any) => {
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
};

const isDirectory = async (path: any) => {
  try {
    const data = await lstat(path);
    if (data.isDirectory()) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
};
