const { get } = require('lodash');

import { join } from 'path';
import { readdir } from 'node:fs/promises';

const { fileExists } = require("@gluestack/helpers");
import { IGluestackEvent } from './types/IGluestackEvent';
const { getDirectories } = require("@gluestack/helpers");
import { getConfig, prepareConfigJSON } from './GluestackConfig';

export default class GluestackEvent implements IGluestackEvent {
  public events: any = {};
  public eventsPath: string;
  public hasuraPluginName: string;
  public daprServices: any = {};

  constructor(hasuraPluginName: string) {
    this.events = {};
    this.hasuraPluginName = hasuraPluginName;
    this.eventsPath = join(getConfig('backendInstancePath'), 'events');
    this.daprServices = getConfig('daprServices');
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
          const filecontent = await this.validateEvents(
            require(filepath)(), `Event ${table}::${event}`
          );
          content.database[table][event] = filecontent;
        } catch (e) {
          continue;
        }
      }
    }

    for await (const event of app) {
      const filepath: string = join(process.cwd(), backendInstance, 'events', 'app', event + '.js');
      try {
        const filecontent = await this.validateEvents(
          require(filepath)(), `Event ${event}`
        );
        content.app[event] = filecontent;
      } catch (e) {
        continue;
      }
    }

    await prepareConfigJSON(content);
  }

  private async validateEvents(_events: any, source: string): Promise<any> {
    const events: any = [];
    for await (const _event of _events) {
      const { kind, type, value } = _event;
      if (!kind || !type || !value) {
        console.log(`> ${source} - kind, type or value missing!`);
        continue;
      }

      if (!['sync', 'async'].includes(kind)) {
        console.log(`> ${source} - kind must be either "sync" or "async"!`);
        continue;
      }

      if (!['function', 'webhook'].includes(type)) {
        console.log(`> ${source} - type must be either "function" or "webhook"!`);
        continue;
      }

      if (value === '') {
        console.log(`> ${source} - value cannot be empty!`);
        continue;
      }

      // if webhook, skip the rest of the checks
      if (type === 'webhook') {
        events.push(_event);
        continue;
      }

      // if function, check if the service name exists in the services list
      const serviceName = value.split('::')[0];
      const methodName = value.split('::')[1];

      if (!serviceName || !methodName) {
        console.log(`> ${source} - service name or method name missing from value`);
        continue;
      }

      if (!this.daprServices[serviceName]) {
        console.log(`> ${source} - service name "${serviceName}" does not exist in services list`);
        continue;
      }

      // if function, check if the method name exists in the service's functions directory
      const service = this.daprServices[serviceName];
      const functionsPath = join(service.path, 'functions');

      const folders = await getDirectories(functionsPath);
      if (!folders || !folders.includes(methodName)) {
        console.log(`> ${source} - method name "${methodName}" does not exist in "${serviceName}" service`);
        continue;
      }

      events.push(_event);
    }

    return Promise.resolve(events);
  }
}
