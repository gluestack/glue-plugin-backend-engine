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
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var fileExists = require("@gluestack/helpers").fileExists;
var createFolder = require("@gluestack/helpers").createFolder;
var nginx_literals_1 = require("../helpers/nginx-literals");
var GluestackConfig_1 = require("./GluestackConfig");
var NginxConf = (function () {
    function NginxConf() {
        this.data = [];
    }
    NginxConf.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conf, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, this.toConf()];
                    case 1:
                        conf = _a.sent();
                        (0, fs_1.writeFileSync)((0, path_1.join)(process.cwd(), (0, GluestackConfig_1.getConfig)('backendInstancePath'), 'engine/router', 'nginx.conf'), conf);
                        return [3, 3];
                    case 2:
                        err_1 = _a.sent();
                        console.log(err_1);
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    };
    NginxConf.prototype.build = function () {
        return __awaiter(this, void 0, void 0, function () {
            var conf, path, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4, this.toBuildConf()];
                    case 1:
                        conf = _a.sent();
                        path = (0, path_1.join)(process.cwd(), 'meta/router/prod');
                        return [4, fileExists(path)];
                    case 2:
                        if (!!(_a.sent())) return [3, 4];
                        return [4, createFolder(path)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4:
                        (0, fs_1.writeFileSync)((0, path_1.join)(path, 'backend.conf'), conf);
                        return [3, 6];
                    case 5:
                        err_2 = _a.sent();
                        console.log(err_2);
                        return [3, 6];
                    case 6: return [2];
                }
            });
        });
    };
    NginxConf.prototype.addRouter = function (string) {
        return __awaiter(this, void 0, void 0, function () {
            var data, exist;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        data = this.data;
                        return [4, fileExists(string)];
                    case 1:
                        exist = _a.sent();
                        if (!exist)
                            return [2, Promise.resolve(false)];
                        data.push.apply(data, require(string)());
                        return [2, Promise.resolve(true)];
                }
            });
        });
    };
    NginxConf.prototype.toConf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var locations, data;
            return __generator(this, function (_a) {
                locations = [];
                data = this.data;
                data.forEach(function (routes) {
                    if (routes.hasOwnProperty('path')) {
                        locations.push((0, nginx_literals_1.setLocation)(routes.path, routes.proxy.instance, routes.proxy.path, routes.host, routes.size_in_mb, routes.host_scheme, routes.read_timeout));
                    }
                });
                return [2, Promise.resolve(nginx_literals_1.startsWith + (0, nginx_literals_1.setServer)(locations) + nginx_literals_1.endsWith)];
            });
        });
    };
    NginxConf.prototype.toBuildConf = function () {
        return __awaiter(this, void 0, void 0, function () {
            var locations, data;
            return __generator(this, function (_a) {
                locations = [];
                data = this.data;
                data.forEach(function (routes) {
                    if (routes.hasOwnProperty('path')) {
                        locations.push((0, nginx_literals_1.setLocation)(routes.path, routes.proxy.instance, routes.proxy.path, routes.host, routes.size_in_mb, routes.host_scheme, routes.read_timeout));
                    }
                });
                return [2, Promise.resolve(locations.join("\n"))];
            });
        });
    };
    return NginxConf;
}());
exports.default = NginxConf;
//# sourceMappingURL=NginxConf.js.map