const prompts = require("prompts");
const services = require("@gluestack/framework/constants/services");

import { GlueStackPlugin } from "src";
import { execute } from "../helpers/spawn";

export function serviceAdd(program: any, glueStackPlugin: GlueStackPlugin) {
  program
    .command("service:add")
    .description("Create the events")
    .action((args: any) => runner(glueStackPlugin, args));
}

const selectPluginName = async (services: string[]) => {
  const choices = services.map((service: string) => {
    return {
      title: service,
      description: `Select a language for your service`,
      value: service,
    };
  });

  const { value } = await prompts({
    type: "select",
    name: "value",
    message: "Select a service plugin",
    choices: choices,
  });

  return value;
}

const runner = async (glueStackPlugin: GlueStackPlugin, args: any) => {
  const pluginName = await selectPluginName(services);
  if (!pluginName) {
    console.log("No plugin selected");
    return;
  }

  const { instanceName } = await prompts({
    type: "text",
    name: "instanceName",
    message: "Enter the instance name",
    validate: (value: string) => value.length > 1 ? true : "Instance name must be longer than 1 character"
  });

  await execute('node', [
    'glue',
    'add',
    pluginName,
    instanceName
  ], {
    cwd: process.cwd(),
    stdio: 'inherit',
    shell: true
  });
};
