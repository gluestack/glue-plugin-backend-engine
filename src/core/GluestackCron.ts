const { get } = require('lodash');

import { join } from 'path';
import * as cron from 'node-cron';

import { ICronObject, IGluestackCron } from './types/IGluestackCron';

const { fileExists } = require("@gluestack/helpers");
const { getDirectories } = require("@gluestack/helpers");
import { getConfig, prepareConfigJSON } from './GluestackConfig';

export default class GluestackCron implements IGluestackCron {
  public collection: ICronObject[];
  public daprServices: any = {};

  private filePath: string = 'crons/crons.json';

  constructor() {
    this.collection = [];
    this.daprServices = getConfig('daprServices');
  }

  // collects and validates all the cron object
  public async collect(): Promise<void> {
    const backendInstance: string = getConfig('backendInstancePath');

    const filePath: string = join(process.cwd(), backendInstance, this.filePath);
    if (! await fileExists(filePath)) {
      return;
    }

    try {
      const collection: ICronObject[] = require(filePath);
      await this.validate(collection);
    } catch (error) {
      console.log('> Something went wrong during crons.json file reading. Please check your "crons/crons.json" config file again!');
    }
  }

  // validates the crons
  public async validate(collection: ICronObject[]): Promise<void> {
    for await (const object of collection) {
      const schedule = get(object, 'schedule', '');
      const type = get(object, 'type', '');
      const value = get(object, 'value', '');

      if (
        !schedule || !type || !value
        || !cron.validate(schedule)
      ) {
        console.log(`> Found an invalid schedule. Skipping...`);
        continue;
      }

      // if function, check if the service name exists in the services list
      const serviceName = value.split('::')[0];
      const methodName = value.split('::')[1];

      if (!serviceName || !methodName) {
        console.log(`> Cron - service name or method name missing from value`);
        continue;
      }

      if (!this.daprServices[serviceName]) {
        console.log(`> Cron - service name "${serviceName}" does not exist in services list`);
        continue;
      }

      // if function, check if the method name exists in the service's functions directory
      const service = this.daprServices[serviceName];
      const functionsPath = join(service.path, 'functions');

      const folders = await getDirectories(functionsPath);
      if (!folders || !folders.includes(methodName)) {
        console.log(`> Cron - method name "${methodName}" does not exist in "${serviceName}" service`);
        continue;
      }

      this.collection.push(object);
    }
  }

  // prepares the cron jobs into engine's config.json file
  public async start(): Promise<void> {
    // collect and validate the schedules from crons/crons.json file
    await this.collect();

    // prepares the cron jobs
    await prepareConfigJSON({ crons: this.collection });
  }
}
