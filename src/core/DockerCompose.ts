const { removeSpecialChars } = require("@gluestack/helpers");

import { join } from 'path';
import * as yaml from 'yaml';
import { writeFileSync } from 'fs';

import { execute } from '../helpers/spawn';
import { getConfig } from './GluestackConfig';

import { IStatelessPlugin } from './types/IStatelessPlugin';
import { IDockerCompose, IService } from './types/IDockerCompose';
/**
 * Docker Compose
 *
 * This class is responsible for generating the docker-compose.yml file
 * in your backend instance's engine/router folder.
 */
export default class DockerCompose implements IDockerCompose {
  public version: string = '3.9';
  public services: { [key: string]: IService };

  constructor() {
    this.services = {};
  }

  // Converts the docker-compose json data to YAML
  public toYAML() {
    return yaml.stringify({
      version: this.version,
      services: this.services
    });
  }

  // Adds a service to the docker-compose file
  public addService(name: string, service: IService) {
    this.services[removeSpecialChars(name)] = service;
  }

  // Generates the docker-compose file
  public async generate() {
    writeFileSync(
      join(
        process.cwd(),
        getConfig('backendInstancePath'),
        'engine/router',
        'docker-compose.yml'
      ),
      this.toYAML()
    );
  }

  // Adds the nginx service to the docker-compose file
  public async addNginx(plugin: IStatelessPlugin, hasura: string) {
    const instance: any = plugin.instance_object;
    const port_number = await instance.gluePluginStore.get('port_number');

    const nginx: IService = {
      container_name: 'nginx',
      restart: 'always',
      build: join(plugin.path, 'router'),
      ports: [
        `${port_number}:80`
      ],
      volumes: [
        `${join(plugin.path, 'router', 'nginx.conf')}:/etc/nginx/nginx.conf`
      ]
    };

    if (hasura && hasura !== '') {
      nginx.depends_on = {};
      nginx.depends_on[`${hasura}`] = {
        condition: 'service_healthy'
      }
    }

    this.addService('nginx', nginx);
  }

  // Adds the hasura service to the docker-compose file
  public async addHasura(plugin: IStatelessPlugin, postgres: string) {
    const instance: any = plugin.instance_object;
    const port_number = await instance.gluePluginStore.get('port_number');
    const isPostgresExternal = getConfig('isPostgresExternal');

    const hasura: IService = {
      container_name: plugin.instance,
      restart: 'always',
      image: 'hasura/graphql-engine:v2.16.1',
      ports: [
        `${port_number}:8080`
      ],
      volumes: [
        `${plugin.path}:/hasura`,
      ],
      env_file: [
        `${plugin.path}/.env`
      ],
      healthcheck: {
        test: [
          "CMD-SHELL",
          // `timeout 1s bash -c ':> /dev/tcp/127.0.0.1/${port_number}' || exit 1`
          `timeout 1s bash -c ':> /dev/tcp/127.0.0.1/8080' || exit 1`
        ],
        interval: '5s',
        timeout: '2s',
        retries: 20
      }
    };

    if (postgres && postgres !== '' && isPostgresExternal === 0) {
      hasura.depends_on = {};
      hasura.depends_on[`${postgres}`] = {
        condition: 'service_healthy'
      }
    }

    this.addService(plugin.instance, hasura);
  }

  // Adds the hasura service to the docker-compose file
  public async addPostgres(plugin: IStatelessPlugin) {
    const instance: any = plugin.instance_object;
    const port_number = await instance.gluePluginStore.get('port_number');
    const db_config = instance.gluePluginStore.get('db_config');

    const postgres: IService = {
      container_name: plugin.instance,
      restart: 'always',
      image: 'postgres:12',
      ports: [
        `${port_number}:5432`
      ],
      volumes: [
        `${plugin.path}/db:/var/lib/postgresql/data/`
      ],
      environment: {
        POSTGRES_USER: `${db_config.username}`,
        POSTGRES_PASSWORD: `${db_config.password}`,
        POSTGRES_DB: `${db_config.db_name}`
      },
      healthcheck: {
        test: [
          "CMD-SHELL",
          `psql -U ${db_config.username} -d ${db_config.db_name}`
        ],
        interval: '10s',
        timeout: '10s',
        retries: 50,
        start_period: '30s'
      }
    };

    this.addService(plugin.instance, postgres);
  }

  // Adds the other services to the docker-compose file
  public async addOthers(plugin: IStatelessPlugin) {
    const name: string = plugin.instance;

    const service: IService = {
      container_name: removeSpecialChars(plugin.instance),
      restart: 'always',
      build: plugin.path,
      volumes: [
        `${plugin.path}:/server`,
        `/server/node_modules`
      ],
      env_file: [
        `${plugin.path}/.env`
      ]
    };

    this.addService(name, service);
  }

  // Executes the docker-compose cli
  public async start(projectName: string, filepath: string) {
    await execute('docker', [
      'compose',
      '-p',
      projectName,
      'up',
      '--remove-orphans',
      '-d'
    ], {
      cwd: filepath,
      stdio: 'inherit',
      shell: true
    });
  }

  public async stop(projectName: string, filepath: string) {
    await execute('docker', [
      'compose',
      '-p',
      projectName,
      'down',
      '--volumes'
    ], {
      cwd: filepath,
      stdio: 'inherit',
      shell: true
    });
  }
}
