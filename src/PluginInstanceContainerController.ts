import { PluginInstance } from "./PluginInstance";
import IApp from "@gluestack/framework/types/app/interface/IApp";
import IContainerController, { IRoutes } from "@gluestack/framework/types/plugin/interface/IContainerController";
const { SpawnHelper, DockerodeHelper } = require("@gluestack/helpers");
import GluestackEngine from "./core/GluestackEngine";
import { IGlueEngine } from "./core/types/IGlueEngine";

export class PluginInstanceContainerController implements IContainerController {
  app: IApp;
  status: "up" | "down" = "down";
  portNumber: number;
  containerId: string;
  callerInstance: PluginInstance;

  constructor(app: IApp, callerInstance: PluginInstance) {
    this.app = app;
    this.callerInstance = callerInstance;
    this.setStatus(this.callerInstance.gluePluginStore.get("status"));
    this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
    this.setContainerId(
      this.callerInstance.gluePluginStore.get("container_id"),
    );
  }

  getCallerInstance(): PluginInstance {
    return this.callerInstance;
  }

  installScript() {
    return ["npm", "install"];
  }

  buildScript() {
    return ["npm", "run", "build"];
  }

  runScript() {
    // do nothing
  }

  async getEnv() {
    return {
      APP_PORT: await this.getPortNumber(),
    };
  }

  getDockerJson() {
    return {};
  }

  getStatus(): "up" | "down" {
    return this.status;
  }

  // @ts-ignore
  async getPortNumber(returnDefault?: boolean) {
    return new Promise((resolve, reject) => {
      if (this.portNumber) {
        return resolve(this.portNumber);
      }
      let ports =
        this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
      DockerodeHelper.getPort(9090, ports)
        .then((port: number) => {
          this.setPortNumber(port);
          ports.push(port);
          this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
          return resolve(this.portNumber);
        })
        .catch((e: any) => {
          reject(e);
        });
    });
  }

  getContainerId(): string {
    return this.containerId;
  }

  setStatus(status: "up" | "down") {
    this.callerInstance.gluePluginStore.set("status", status || "down");
    this.status = status || "down";

    return this.status;
  }

  setPortNumber(portNumber: number) {
    this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
    this.portNumber = portNumber || null

    return this.portNumber;
  }

  setContainerId(containerId: string) {
    // do nothing
  }

  getConfig(): any { }

  async up() {
    const app: IApp = this.app;

    try {
      const engine: IGlueEngine = new GluestackEngine(app, 'backend');
      await engine.start();
    } catch (err) {
      console.log('>> err', err);
    }
  }

  async down() {
    const app: IApp = this.app;

    const engine: IGlueEngine = new GluestackEngine(app, 'backend');
    await engine.stop();
  }

  async watch(): Promise<string[]> {
    return [
      '../crons/crons.json',
      '../events/database',
      '../events/app'
    ];
  }

  async build() {
    const app: IApp = this.app;

    try {
      const engine: IGlueEngine = new GluestackEngine(app, 'backend');
      await engine.build();
    } catch (err) {
      console.log('>> err', err);
    }

    console.log(
      `${this.callerInstance.getName()}: Running ${(await this.installScript()).join(
        ' '
      )}`
    );
    await SpawnHelper.run(this.callerInstance.getInstallationPath(), this.installScript());
    console.log(
      `${this.callerInstance.getName()}: Running ${(await this.buildScript()).join(
        ' '
      )}`
    );
    await SpawnHelper.run(this.callerInstance.getInstallationPath(), this.buildScript());
  }

  async getRoutes(): Promise<IRoutes[]> {
    const routes: IRoutes[] = [
      { method: "GET", path: "/health-check" },
      { method: "POST", path: "/actions/{action_name}" },
      { method: "POST", path: "/events" },
      { method: "POST", path: "/app/events" },
      { method: "POST", path: "/client/invoke" },
      { method: "POST", path: "/server/invoke" },
      { method: "GET", path: "/glue/config" },
      { method: "POST", path: "/queue/push" }
    ];

    return Promise.resolve(routes);
  }
}
