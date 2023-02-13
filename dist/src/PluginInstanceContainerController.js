"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginInstanceContainerController = void 0;
var _a = require("@gluestack/helpers"), SpawnHelper = _a.SpawnHelper, DockerodeHelper = _a.DockerodeHelper;
var GluestackEngine_1 = __importDefault(require("./core/GluestackEngine"));
var PluginInstanceContainerController = (function () {
    function PluginInstanceContainerController(app, callerInstance) {
        this.status = "down";
        this.app = app;
        this.callerInstance = callerInstance;
        this.setStatus(this.callerInstance.gluePluginStore.get("status"));
        this.setPortNumber(this.callerInstance.gluePluginStore.get("port_number"));
        this.setContainerId(this.callerInstance.gluePluginStore.get("container_id"));
    }
    PluginInstanceContainerController.prototype.getCallerInstance = function () {
        return this.callerInstance;
    };
    PluginInstanceContainerController.prototype.installScript = function () {
        return ["npm", "install"];
    };
    PluginInstanceContainerController.prototype.buildScript = function () {
        return ["npm", "run", "build"];
    };
    PluginInstanceContainerController.prototype.runScript = function () {
    };
    PluginInstanceContainerController.prototype.getEnv = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = {};
                        return [4, this.getPortNumber()];
                    case 1: return [2, (_a.APP_PORT = _b.sent(),
                            _a)];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getDockerJson = function () {
        return {};
    };
    PluginInstanceContainerController.prototype.getStatus = function () {
        return this.status;
    };
    PluginInstanceContainerController.prototype.getPortNumber = function (returnDefault) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2, new Promise(function (resolve, reject) {
                        if (_this.portNumber) {
                            return resolve(_this.portNumber);
                        }
                        var ports = _this.callerInstance.callerPlugin.gluePluginStore.get("ports") || [];
                        DockerodeHelper.getPort(9090, ports)
                            .then(function (port) {
                            _this.setPortNumber(port);
                            ports.push(port);
                            _this.callerInstance.callerPlugin.gluePluginStore.set("ports", ports);
                            return resolve(_this.portNumber);
                        })
                            .catch(function (e) {
                            reject(e);
                        });
                    })];
            });
        });
    };
    PluginInstanceContainerController.prototype.getContainerId = function () {
        return this.containerId;
    };
    PluginInstanceContainerController.prototype.setStatus = function (status) {
        this.callerInstance.gluePluginStore.set("status", status || "down");
        this.status = status || "down";
        return this.status;
    };
    PluginInstanceContainerController.prototype.setPortNumber = function (portNumber) {
        this.callerInstance.gluePluginStore.set("port_number", portNumber || null);
        this.portNumber = portNumber || null;
        return this.portNumber;
    };
    PluginInstanceContainerController.prototype.setContainerId = function (containerId) {
    };
    PluginInstanceContainerController.prototype.getConfig = function () { };
    PluginInstanceContainerController.prototype.up = function () {
        return __awaiter(this, void 0, void 0, function () {
            var app, engine, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = this.app;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        engine = new GluestackEngine_1.default(app, 'backend');
                        return [4, engine.start()];
                    case 2:
                        _a.sent();
                        return [3, 4];
                    case 3:
                        err_1 = _a.sent();
                        console.log('>> err', err_1);
                        return [3, 4];
                    case 4: return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.down = function () {
        return __awaiter(this, void 0, void 0, function () {
            var app, engine;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        app = this.app;
                        engine = new GluestackEngine_1.default(app, 'backend');
                        return [4, engine.stop()];
                    case 1:
                        _a.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.watch = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, [
                        '../crons/crons.json',
                        '../events/database',
                        '../events/app'
                    ]];
            });
        });
    };
    PluginInstanceContainerController.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var app, engine, err_2, _a, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        app = this.app;
                        _j.label = 1;
                    case 1:
                        _j.trys.push([1, 3, , 4]);
                        engine = new GluestackEngine_1.default(app, 'backend');
                        return [4, engine.build()];
                    case 2:
                        _j.sent();
                        return [3, 4];
                    case 3:
                        err_2 = _j.sent();
                        console.log('>> err', err_2);
                        return [3, 4];
                    case 4:
                        _b = (_a = console).log;
                        _d = (_c = "".concat(this.callerInstance.getName(), ": Running ")).concat;
                        return [4, this.installScript()];
                    case 5:
                        _b.apply(_a, [_d.apply(_c, [(_j.sent()).join(' ')])]);
                        return [4, SpawnHelper.run(this.callerInstance.getInstallationPath(), this.installScript())];
                    case 6:
                        _j.sent();
                        _f = (_e = console).log;
                        _h = (_g = "".concat(this.callerInstance.getName(), ": Running ")).concat;
                        return [4, this.buildScript()];
                    case 7:
                        _f.apply(_e, [_h.apply(_g, [(_j.sent()).join(' ')])]);
                        return [4, SpawnHelper.run(this.callerInstance.getInstallationPath(), this.buildScript())];
                    case 8:
                        _j.sent();
                        return [2];
                }
            });
        });
    };
    PluginInstanceContainerController.prototype.getRoutes = function () {
        return __awaiter(this, void 0, void 0, function () {
            var routes;
            return __generator(this, function (_a) {
                routes = [
                    { method: "GET", path: "/health-check" },
                    { method: "POST", path: "/actions/{action_name}" },
                    { method: "POST", path: "/events" },
                    { method: "POST", path: "/app/events" },
                    { method: "POST", path: "/client/invoke" },
                    { method: "POST", path: "/server/invoke" },
                    { method: "GET", path: "/glue/config" },
                    { method: "POST", path: "/queue/push" }
                ];
                return [2, Promise.resolve(routes)];
            });
        });
    };
    return PluginInstanceContainerController;
}());
exports.PluginInstanceContainerController = PluginInstanceContainerController;
//# sourceMappingURL=PluginInstanceContainerController.js.map