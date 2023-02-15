import { join } from "path";
import { PluginInstance } from "../PluginInstance";

const { writeFile } = require("@gluestack/helpers");
const { fileExists } = require("@gluestack/helpers");
const { createFolder } = require("@gluestack/helpers");

const construct = async (path: string): Promise<void> => {
  await createFolder(path);
};

const checkCreate = async (installationPath: string, fileName: string, fileContent: string): Promise<void> => {
  const path: string = join(installationPath, '..', 'crons');

  const appExist: boolean = await fileExists(path);
  if (!appExist) {
    await construct(path);
  }

  await writeFile(join(path, 'crons.json'), fileContent);
}

export async function addMainCron(engineInstance: PluginInstance): Promise<void> {
  const installationPath = engineInstance.getInstallationPath();

  const fileName: string = 'crons.json';
  const fileContent: object = [];

  await checkCreate(installationPath, fileName, JSON.stringify(fileContent, null, 2));
};
