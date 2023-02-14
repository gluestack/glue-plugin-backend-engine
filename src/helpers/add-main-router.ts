import { join } from "path";
import { writeFile } from "./write-file";
import { fileExists } from "./file-exists";
import { PluginInstance } from "../PluginInstance";

const construct = async (backendInstance: string, path: string): Promise<void> => {
  const content: string = `module.exports = () => [
  {
    "path": "/${backendInstance}",
    "proxy": {
      "path": "/"
    }
  }
];
`;

  await writeFile(path, content);
};

export async function addMainRouter(engineInstance: PluginInstance): Promise<string> {
  const installationPath = engineInstance.getInstallationPath();

  const folders = installationPath.split("/");
  const projectName = folders[folders.length - 1];

  const path = join(installationPath, '..', 'router.js');

  const exist = await fileExists(path);
  if (!exist) {
    await construct('backend', path);
  }

  return Promise.resolve('done');
};
