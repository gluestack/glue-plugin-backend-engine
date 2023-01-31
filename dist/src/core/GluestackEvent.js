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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var get = require('lodash').get;
var path_1 = require("path");
var promises_1 = require("node:fs/promises");
var file_exists_1 = require("../helpers/file-exists");
var GluestackConfig_1 = require("./GluestackConfig");
var GluestackEvent = (function () {
    function GluestackEvent(hasuraPluginName) {
        this.events = {};
        this.events = {};
        this.hasuraPluginName = hasuraPluginName;
        this.eventsPath = (0, path_1.join)((0, GluestackConfig_1.getConfig)('backendInstancePath'), 'events');
    }
    GluestackEvent.prototype.scanEvents = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        _a = this.events;
                        _b = 'database';
                        return [4, this.readEventsDir('database', true)];
                    case 1:
                        _a[_b] = _e.sent();
                        _c = this.events;
                        _d = 'app';
                        return [4, this.readEventsDir('app', false)];
                    case 2:
                        _c[_d] = _e.sent();
                        return [4, this.prepareConfigJSON()];
                    case 3:
                        _e.sent();
                        return [2];
                }
            });
        });
    };
    GluestackEvent.prototype.getEventsByType = function (type) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.events[type]];
            });
        });
    };
    GluestackEvent.prototype.readEventsDir = function (dirName, readDirectory) {
        var _a, e_1, _b, _c;
        return __awaiter(this, void 0, void 0, function () {
            var paths, dirPath, exist, dirents, _d, dirents_1, dirents_1_1, dirent, _e, _f, e_1_1;
            return __generator(this, function (_g) {
                switch (_g.label) {
                    case 0:
                        paths = readDirectory ? {} : [];
                        dirPath = (0, path_1.join)(this.eventsPath, dirName);
                        return [4, (0, file_exists_1.fileExists)(dirPath)];
                    case 1:
                        exist = _g.sent();
                        if (!exist) {
                            console.log("> \"".concat(dirName, "\" directory does not exist in \"events\" directory. Skipping..."));
                            return [2, paths];
                        }
                        return [4, (0, promises_1.readdir)(dirPath, {
                                withFileTypes: true
                            })];
                    case 2:
                        dirents = _g.sent();
                        _g.label = 3;
                    case 3:
                        _g.trys.push([3, 12, 13, 18]);
                        _d = true, dirents_1 = __asyncValues(dirents);
                        _g.label = 4;
                    case 4: return [4, dirents_1.next()];
                    case 5:
                        if (!(dirents_1_1 = _g.sent(), _a = dirents_1_1.done, !_a)) return [3, 11];
                        _c = dirents_1_1.value;
                        _d = false;
                        _g.label = 6;
                    case 6:
                        _g.trys.push([6, , 9, 10]);
                        dirent = _c;
                        if ((readDirectory && !dirent.isDirectory())
                            || (!readDirectory && dirent.isDirectory())) {
                            return [3, 10];
                        }
                        if (!readDirectory) return [3, 8];
                        _e = paths;
                        _f = dirent.name;
                        return [4, this.readEventsDir((0, path_1.join)(dirName, dirent.name), false)];
                    case 7:
                        _e[_f] = _g.sent();
                        _g.label = 8;
                    case 8:
                        if (!readDirectory) {
                            paths.push(dirent.name.replace('.js', ''));
                        }
                        return [3, 10];
                    case 9:
                        _d = true;
                        return [7];
                    case 10: return [3, 4];
                    case 11: return [3, 18];
                    case 12:
                        e_1_1 = _g.sent();
                        e_1 = { error: e_1_1 };
                        return [3, 18];
                    case 13:
                        _g.trys.push([13, , 16, 17]);
                        if (!(!_d && !_a && (_b = dirents_1.return))) return [3, 15];
                        return [4, _b.call(dirents_1)];
                    case 14:
                        _g.sent();
                        _g.label = 15;
                    case 15: return [3, 17];
                    case 16:
                        if (e_1) throw e_1.error;
                        return [7];
                    case 17: return [7];
                    case 18: return [2, paths];
                }
            });
        });
    };
    GluestackEvent.prototype.prepareConfigJSON = function () {
        var _a, e_2, _b, _c, _d, e_3, _e, _f, _g, e_4, _h, _j;
        return __awaiter(this, void 0, void 0, function () {
            var events, app, database, content, backendInstance, _k, _l, _m, table, _o, _p, _q, event_1, filepath, e_3_1, e_2_1, _r, app_1, app_1_1, event_2, filepath, e_4_1;
            return __generator(this, function (_s) {
                switch (_s.label) {
                    case 0:
                        events = this.events;
                        app = get(events, 'app', {});
                        database = get(events, 'database', {});
                        content = {
                            database: {},
                            app: {}
                        };
                        backendInstance = (0, GluestackConfig_1.getConfig)('backendInstancePath');
                        _s.label = 1;
                    case 1:
                        _s.trys.push([1, 20, 21, 26]);
                        _k = true, _l = __asyncValues(Object.keys(database));
                        _s.label = 2;
                    case 2: return [4, _l.next()];
                    case 3:
                        if (!(_m = _s.sent(), _a = _m.done, !_a)) return [3, 19];
                        _c = _m.value;
                        _k = false;
                        _s.label = 4;
                    case 4:
                        _s.trys.push([4, , 17, 18]);
                        table = _c;
                        content.database[table] = {};
                        _s.label = 5;
                    case 5:
                        _s.trys.push([5, 10, 11, 16]);
                        _o = true, _p = (e_3 = void 0, __asyncValues(database[table]));
                        _s.label = 6;
                    case 6: return [4, _p.next()];
                    case 7:
                        if (!(_q = _s.sent(), _d = _q.done, !_d)) return [3, 9];
                        _f = _q.value;
                        _o = false;
                        try {
                            event_1 = _f;
                            filepath = (0, path_1.join)(process.cwd(), backendInstance, 'events', 'database', table, event_1 + '.js');
                            try {
                                content.database[table][event_1] = require(filepath)();
                            }
                            catch (e) {
                                return [3, 8];
                            }
                        }
                        finally {
                            _o = true;
                        }
                        _s.label = 8;
                    case 8: return [3, 6];
                    case 9: return [3, 16];
                    case 10:
                        e_3_1 = _s.sent();
                        e_3 = { error: e_3_1 };
                        return [3, 16];
                    case 11:
                        _s.trys.push([11, , 14, 15]);
                        if (!(!_o && !_d && (_e = _p.return))) return [3, 13];
                        return [4, _e.call(_p)];
                    case 12:
                        _s.sent();
                        _s.label = 13;
                    case 13: return [3, 15];
                    case 14:
                        if (e_3) throw e_3.error;
                        return [7];
                    case 15: return [7];
                    case 16: return [3, 18];
                    case 17:
                        _k = true;
                        return [7];
                    case 18: return [3, 2];
                    case 19: return [3, 26];
                    case 20:
                        e_2_1 = _s.sent();
                        e_2 = { error: e_2_1 };
                        return [3, 26];
                    case 21:
                        _s.trys.push([21, , 24, 25]);
                        if (!(!_k && !_a && (_b = _l.return))) return [3, 23];
                        return [4, _b.call(_l)];
                    case 22:
                        _s.sent();
                        _s.label = 23;
                    case 23: return [3, 25];
                    case 24:
                        if (e_2) throw e_2.error;
                        return [7];
                    case 25: return [7];
                    case 26:
                        _s.trys.push([26, 31, 32, 37]);
                        _r = true, app_1 = __asyncValues(app);
                        _s.label = 27;
                    case 27: return [4, app_1.next()];
                    case 28:
                        if (!(app_1_1 = _s.sent(), _g = app_1_1.done, !_g)) return [3, 30];
                        _j = app_1_1.value;
                        _r = false;
                        try {
                            event_2 = _j;
                            filepath = (0, path_1.join)(process.cwd(), backendInstance, 'events', 'app', event_2 + '.js');
                            try {
                                content.app[event_2] = require(filepath)();
                            }
                            catch (e) {
                                return [3, 29];
                            }
                        }
                        finally {
                            _r = true;
                        }
                        _s.label = 29;
                    case 29: return [3, 27];
                    case 30: return [3, 37];
                    case 31:
                        e_4_1 = _s.sent();
                        e_4 = { error: e_4_1 };
                        return [3, 37];
                    case 32:
                        _s.trys.push([32, , 35, 36]);
                        if (!(!_r && !_g && (_h = app_1.return))) return [3, 34];
                        return [4, _h.call(app_1)];
                    case 33:
                        _s.sent();
                        _s.label = 34;
                    case 34: return [3, 36];
                    case 35:
                        if (e_4) throw e_4.error;
                        return [7];
                    case 36: return [7];
                    case 37: return [4, (0, GluestackConfig_1.prepareConfigJSON)(content)];
                    case 38:
                        _s.sent();
                        return [2];
                }
            });
        });
    };
    return GluestackEvent;
}());
exports.default = GluestackEvent;
//# sourceMappingURL=GluestackEvent.js.map