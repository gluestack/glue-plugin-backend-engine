const { get } = require('lodash');

import { join } from 'path';
import { readdir } from 'node:fs/promises';

import { fileExists } from '../helpers/file-exists';
import { IGluestackEvent } from './types/IGluestackEvent';
import { getConfig, prepareConfigJSON } from './GluestackConfig';

export default class GluestackEvent implements IGluestackEvent {
  public events: any = {};
  public eventsPath: string;
  public hasuraPluginName: string;

  constructor(hasuraPluginName: string) {
    this.events = {};
    this.hasuraPluginName = hasuraPluginName;
    this.eventsPath = join(getConfig('backendInstancePath'), 'events');
  }

  // Scans the events directory and prepares the events object
  public async scanEvents(): Promise<void> {
    this.events['database'] = await this.readEventsDir('database', true);
    this.events['app'] = await this.readEventsDir('app', false);

    await this.prepareConfigJSON();
  }

  // Applies all the events to the hasura engine
  public async getEventsByType(type: string): Promise<any> {
    return this.events[type];
  }

  // Reads the events directory and returns the events
  private async readEventsDir(
    dirName: string, readDirectory: boolean
  ): Promise<string[]> {
    const paths: any = readDirectory ? {} : [];
    const dirPath = join(this.eventsPath, dirName);

    const exist = await fileExists(dirPath);
    if (!exist) {
      console.log(`> "${dirName}" directory does not exist in "events" directory. Skipping...`);
      return paths;
    }

    const dirents = await readdir(dirPath, {
      withFileTypes: true
    });

    for await (const dirent of dirents) {
      // Skip if the dirent is a directory and readDirectory is false
      // Skip if the dirent is a file and readDirectory is false
      if (
        (readDirectory && !dirent.isDirectory())
        || (!readDirectory && dirent.isDirectory())
      ) {
        continue;
      }

      // Skip if the dirent is a file and readDirectory is true
      if (readDirectory) {
        paths[dirent.name] = await this.readEventsDir(
          join(dirName, dirent.name), false
        );
      }

      // Skip if the dirent is a directory and readDirectory is true
      if (!readDirectory) {
        paths.push(dirent.name.replace('.js', ''));
      }
    }

    return paths;
  }

  // Writes the events object to the engine instance's config.json file
  private async prepareConfigJSON(): Promise<void> {
    const events: any = this.events;
    const app = get(events, 'app', {});
    const database = get(events, 'database', {});

    const content: any = {
      database: {},
      app: {}
    };

    const backendInstance: string = getConfig('backendInstancePath');

    for await (const table of Object.keys(database)) {
      content.database[table] = {};
      for await (const event of database[table]) {

        const filepath: string = join(process.cwd(), backendInstance, 'events', 'database', table, event + '.js');
        try {
          content.database[table][event] = require(filepath)();
        } catch (e) {
          continue;
        }
      }
    }

    for await (const event of app) {
      const filepath: string = join(process.cwd(), backendInstance, 'events', 'app', event + '.js');
      try {
        content.app[event] = require(filepath)();
      } catch (e) {
        continue;
      }
    }

    await prepareConfigJSON(content);
  }
}
