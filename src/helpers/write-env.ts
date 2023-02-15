const { writeFile } = require("@gluestack/helpers");

import { PluginInstance } from "../PluginInstance";

export async function constructEnvFromJson(functionInstance: PluginInstance) {
  const keys: any = {
    APP_PORT: await functionInstance.getContainerController().getPortNumber(),
  };

  return keys;
}

export async function writeEnv(functionInstance: PluginInstance) {
  const path = `${functionInstance.getInstallationPath()}/.env`;
  let env = "";
  const keys: any = await constructEnvFromJson(functionInstance);
  Object.keys(keys).forEach((key) => {
    env += `${key}="${keys[key]}"
`;
  });

  await writeFile(path, env);
}
