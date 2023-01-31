import { GlueStackPlugin } from "src";
import { writeFile } from "../helpers/write-file";
import { fileExists } from "../helpers/file-exists";
import * as cron from "node-cron";
import path from "path";
const colors = require("colors");

export const cronsAdd = (program: any, glueStackPlugin: GlueStackPlugin) => {
  program
    .command("cron:add")
    .option("--s, --schedule <special>", "schedule value (for every minute '* * * * *')")
    .option("--m, --method <method-name>", "name of the method (required --f)")
    .option("--f, --function <function-name>", "name of function (required --m)")
    .option("--w, --webhook <webhook-url>", "webhook url")
    .description("Create the cron")
    .action((args: any) => create(glueStackPlugin, args));
}

export async function create(_glueStackPlugin: GlueStackPlugin, args: any) {
  let fileContent: string;
  let content: any;
  const cronsPath = "./backend/crons";

  if (!args.schedule) {
    console.log("error: option '--s' required you can add '--s <schedule-value>' add --help for more information\n\nexample: node glue cron:add --s '* * * * *'");
    process.exit();
  }

  switch (true) {
    case "function" in args && "webhook" in args || !args.hasOwnProperty("function") && !args.hasOwnProperty("webhook"):
      console.log("error: required one option you can add '--f <function-name>' or '--w <webhook-url>' add --help for more information");
      process.exit(0);

    case args.hasOwnProperty('function') && !args.hasOwnProperty('method'):
      console.log("error: required method name with function you can add '--m <method-name>' add --help for more information");
      process.exit(0);

    case "function" in args:
      content = await createContent("function", args, args.schedule);
      break;
    case "webhook" in args:
      content = await createContent("webhook", args, args.schedule);
      break;
  }

  const isScheduleValid =
    args.hasOwnProperty("schedule") &&
    (args.hasOwnProperty("function") || args.hasOwnProperty("webhook")) &&
    cron.validate(args.schedule);

  if (!isScheduleValid) {
    console.log(
      `error: invalid format! valid format is --s '* * * * *'.\n\nexample: node glue cron:add --s '* * * * *'`);
    process.exit(0);
  }

  const cronsFilePath = `${cronsPath}/crons.json`;

  if (await fileExists(cronsFilePath)) {
    const data = require(path.join(process.cwd(), cronsPath.slice(2), "crons"));
    if (data.length !== 0) {
      const objExist = data.find((obj: any) => {
        return (
          obj.schedule === content.schedule &&
          obj.type === content.type &&
          obj.value === content.value
        );
      });

      if (objExist) {
        console.log(`schedule "${content.schedule}" of ${content.type} "${content.value}" already exist!`);
        process.exit();
      }
    }
    data.push(content);
    fileContent = JSON.stringify(data, null, 2);
  } else {
    fileContent = `[${JSON.stringify(content, null, 2)}]`;
  }

  await writeFile(cronsFilePath, fileContent);
  console.log("Successfully created!");
}

export async function createContent(
  type: string,
  value: any,
  schedule: string
) {
  return {
    schedule: schedule,
    type: type,
    value: type === 'function' ? `${value.function}::${value.method}` : value.webhook,
  };
}