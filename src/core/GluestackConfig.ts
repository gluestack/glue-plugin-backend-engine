import { join } from 'path';
import { readFile } from 'fs/promises';

import { fileExists } from '../helpers/file-exists';
import { writeFile } from '../helpers/write-file';

export const config: any = {
  postgresInstancePath: '',

  postgresConnectionString: '',

  isPostgresExternal: 0,

  authInstancePath: '',

  backendInstancePath: '',

  engineInstancePath: '',

  hasuraInstancePath: '',

  hasuraInstanceStatus: 'down',

  hasuraEnvs: {},

  daprServices: []
};

// Gets the configuration
export const getConfig = (key: string): any => config[key];

// Sets the configuration
export const setConfig = (key: string, value: any): string => config[key] = value;

// Prepare the configuration file for the engine
export const prepareConfigJSON = async (newContent: any): Promise<void> => {
  let content: any = {};

  const engineInstance: string = getConfig('engineInstancePath');
  const backendInstance: string = getConfig('backendInstancePath');

  const filepath: string = join(process.cwd(), backendInstance, engineInstance, 'config.json');

  if (await fileExists(filepath)) {
    content = await readFile(filepath);
    content = JSON.parse(content.toString());
  }

  content = { ...content, ...newContent };

  await writeFile(filepath, JSON.stringify(content, null, 2));
};
