import { join } from 'path';
import { writeFileSync } from 'fs';

const { fileExists } = require("@gluestack/helpers");
const { createFolder } = require("@gluestack/helpers");

import {
  endsWith, startsWith, setServer, setLocation
} from '../helpers/nginx-literals';

import { getConfig } from './GluestackConfig';

/**
 * Nginx Conf
 *
 * This class is responsible for generating the nginx.conf file
 * in your backend instance's engine/router folder.
 */
export default class NginxConf {
  public data: any[];

  constructor() {
    this.data = [];
  }

  // Generates the nginx.conf file
  public async generate(): Promise<void> {
    try {
      const conf: string = await this.toConf();

      writeFileSync(
        join(
          process.cwd(),
          getConfig('backendInstancePath'),
          'engine/router',
          'nginx.conf'
        ),
        conf
      );

    } catch (err) {
      console.log(err);
    }
  }

  // Generates the nginx.conf file for production
  public async build(): Promise<void> {
    try {
      const conf: string = await this.toBuildConf();
      const path: string = join(
        process.cwd(),
        'meta/router/prod'
      );

      if (!await fileExists(path)) {
        await createFolder(path);
      }

      writeFileSync(
        join(path, 'backend.conf'),
        conf
      );
    } catch (err) {
      console.log(err);
    }
  }

  // Adds router.js data to the nginx conf data
  // if and only if the given path exists
  public async addRouter(string: string): Promise<boolean> {
    const data: any[] = this.data;

    const exist = await fileExists(string);
    if (!exist) return Promise.resolve(false);

    data.push(...require(string)());

    return Promise.resolve(true);
  }

  // Converts the nginx conf data to a string
  private async toConf(): Promise<string> {
    let locations: string[] = [];
    const data: any[] = this.data;

    data.forEach((routes: any) => {
      if (routes.hasOwnProperty('path')) {
        locations.push(setLocation(
          routes.path, routes.proxy.instance, routes.proxy.path, routes.host, routes.size_in_mb, routes.host_scheme, routes.read_timeout
        ));
      }
    });

    return Promise.resolve(
      startsWith + setServer(locations) + endsWith
    );
  }

  // Convertrs the nginx conf data to a string for production
  private async toBuildConf(): Promise<string> {
    let locations: string[] = [];
    const data: any[] = this.data;

    data.forEach((routes: any) => {
      if (routes.hasOwnProperty('path')) {
        locations.push(setLocation(
          routes.path, routes.proxy.instance, routes.proxy.path, routes.host, routes.size_in_mb, routes.host_scheme, routes.read_timeout
        ));
      }
    });

    return Promise.resolve(locations.join("\n"));
  }
}
