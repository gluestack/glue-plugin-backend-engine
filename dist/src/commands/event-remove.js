"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvents = exports.eventRemove = void 0;
var path_1 = require("path");
var prompts = require("prompts");
var getDirectories = require("@gluestack/helpers").getDirectories;
var getFiles = require("@gluestack/helpers").getFiles;
var writeFile = require("@gluestack/helpers").writeFile;
function eventRemove(program, glueStackPlugin) {
    program
        .command("event:remove")
        .option("--t, --type <type>", "type of the event. Options: 'database' or 'app'", "app")
        .description("Remove events")
        .action(function (args) { return deleteEvents(glueStackPlugin, args); });
}
exports.eventRemove = eventRemove;
function deleteEvents(_glueStackPlugin, args) {
    var _a, e_1, _b, _c, _d, e_2, _e, _f;
    return __awaiter(this, void 0, void 0, function () {
        var type, directoryPath, events, _g, removables, confirm, eventsMap, _h, _j, _k, event_1, e_1_1, _loop_1, _l, removables_1, removables_1_1, e_2_1;
        return __generator(this, function (_m) {
            switch (_m.label) {
                case 0:
                    type = args.type;
                    if (!["database", "app"].includes(type)) {
                        console.log("> Event type must be either 'database' or 'app'");
                        process.exit(-1);
                    }
                    directoryPath = (0, path_1.join)(process.cwd(), "./backend/events/", type);
                    return [4, scanAllEvents(type, directoryPath)];
                case 1:
                    events = _m.sent();
                    if (!events || !Object.keys(events[type]).length) {
                        console.log("> No \"".concat(type, "\" events found"));
                        process.exit(-1);
                    }
                    return [4, removeEvents(events[type])];
                case 2:
                    _g = _m.sent(), removables = _g.removables, confirm = _g.confirm;
                    if (!confirm) {
                        console.log("> Aborted");
                        process.exit(-1);
                    }
                    eventsMap = new Map();
                    _m.label = 3;
                case 3:
                    _m.trys.push([3, 8, 9, 14]);
                    _h = true, _j = __asyncValues(events[type]);
                    _m.label = 4;
                case 4: return [4, _j.next()];
                case 5:
                    if (!(_k = _m.sent(), _a = _k.done, !_a)) return [3, 7];
                    _c = _k.value;
                    _h = false;
                    try {
                        event_1 = _c;
                        if (!eventsMap.has(event_1.path)) {
                            eventsMap.set(event_1.path, require(event_1.path)());
                        }
                    }
                    finally {
                        _h = true;
                    }
                    _m.label = 6;
                case 6: return [3, 4];
                case 7: return [3, 14];
                case 8:
                    e_1_1 = _m.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 14];
                case 9:
                    _m.trys.push([9, , 12, 13]);
                    if (!(!_h && !_a && (_b = _j.return))) return [3, 11];
                    return [4, _b.call(_j)];
                case 10:
                    _m.sent();
                    _m.label = 11;
                case 11: return [3, 13];
                case 12:
                    if (e_1) throw e_1.error;
                    return [7];
                case 13: return [7];
                case 14:
                    _m.trys.push([14, 20, 21, 26]);
                    _loop_1 = function () {
                        var removeEvent, eventsArray, eventIndex;
                        return __generator(this, function (_o) {
                            switch (_o.label) {
                                case 0:
                                    _f = removables_1_1.value;
                                    _l = false;
                                    _o.label = 1;
                                case 1:
                                    _o.trys.push([1, , 3, 4]);
                                    removeEvent = _f;
                                    eventsArray = eventsMap.get(removeEvent.path);
                                    eventIndex = eventsArray.findIndex(function (event) { return JSON.stringify(event) === JSON.stringify(removeEvent.content); });
                                    if (eventIndex === -1) {
                                        console.log("> Event not found in file: ".concat(removeEvent.file));
                                        return [2, "continue"];
                                    }
                                    eventsArray.splice(eventIndex, 1);
                                    return [4, writeFile(removeEvent.path, "module.exports = () => ".concat(JSON.stringify(__spreadArray([], eventsArray, true), null, 2), ";"))];
                                case 2:
                                    _o.sent();
                                    return [3, 4];
                                case 3:
                                    _l = true;
                                    return [7];
                                case 4: return [2];
                            }
                        });
                    };
                    _l = true, removables_1 = __asyncValues(removables);
                    _m.label = 15;
                case 15: return [4, removables_1.next()];
                case 16:
                    if (!(removables_1_1 = _m.sent(), _d = removables_1_1.done, !_d)) return [3, 19];
                    return [5, _loop_1()];
                case 17:
                    _m.sent();
                    _m.label = 18;
                case 18: return [3, 15];
                case 19: return [3, 26];
                case 20:
                    e_2_1 = _m.sent();
                    e_2 = { error: e_2_1 };
                    return [3, 26];
                case 21:
                    _m.trys.push([21, , 24, 25]);
                    if (!(!_l && !_d && (_e = removables_1.return))) return [3, 23];
                    return [4, _e.call(removables_1)];
                case 22:
                    _m.sent();
                    _m.label = 23;
                case 23: return [3, 25];
                case 24:
                    if (e_2) throw e_2.error;
                    return [7];
                case 25: return [7];
                case 26: return [2];
            }
        });
    });
}
exports.deleteEvents = deleteEvents;
;
var scanAllEvents = function (type, directoryPath) { return __awaiter(void 0, void 0, void 0, function () {
    var events, files, _a, files_1, files_1_1, file, path, contents, _b, contents_1, contents_1_1, content, e_3_1, e_4_1, dirs, _c, dirs_1, dirs_1_1, dir, tablepath, files, _d, files_2, files_2_1, file, path, contents, _e, contents_2, contents_2_1, content, e_5_1, e_6_1, e_7_1;
    var _f, e_4, _g, _h, _j, e_3, _k, _l, _m, e_7, _o, _p, _q, e_6, _r, _s, _t, e_5, _u, _v;
    return __generator(this, function (_w) {
        switch (_w.label) {
            case 0:
                events = {};
                events[type] = [];
                if (!(type === "app")) return [3, 28];
                return [4, getFiles(directoryPath)];
            case 1:
                files = _w.sent();
                _w.label = 2;
            case 2:
                _w.trys.push([2, 21, 22, 27]);
                _a = true, files_1 = __asyncValues(files);
                _w.label = 3;
            case 3: return [4, files_1.next()];
            case 4:
                if (!(files_1_1 = _w.sent(), _f = files_1_1.done, !_f)) return [3, 20];
                _h = files_1_1.value;
                _a = false;
                _w.label = 5;
            case 5:
                _w.trys.push([5, , 18, 19]);
                file = _h;
                path = (0, path_1.join)(directoryPath, file);
                contents = require(path)();
                _w.label = 6;
            case 6:
                _w.trys.push([6, 11, 12, 17]);
                _b = true, contents_1 = (e_3 = void 0, __asyncValues(contents));
                _w.label = 7;
            case 7: return [4, contents_1.next()];
            case 8:
                if (!(contents_1_1 = _w.sent(), _j = contents_1_1.done, !_j)) return [3, 10];
                _l = contents_1_1.value;
                _b = false;
                try {
                    content = _l;
                    events[type].push({ type: type, file: file, path: path, content: content });
                }
                finally {
                    _b = true;
                }
                _w.label = 9;
            case 9: return [3, 7];
            case 10: return [3, 17];
            case 11:
                e_3_1 = _w.sent();
                e_3 = { error: e_3_1 };
                return [3, 17];
            case 12:
                _w.trys.push([12, , 15, 16]);
                if (!(!_b && !_j && (_k = contents_1.return))) return [3, 14];
                return [4, _k.call(contents_1)];
            case 13:
                _w.sent();
                _w.label = 14;
            case 14: return [3, 16];
            case 15:
                if (e_3) throw e_3.error;
                return [7];
            case 16: return [7];
            case 17: return [3, 19];
            case 18:
                _a = true;
                return [7];
            case 19: return [3, 3];
            case 20: return [3, 27];
            case 21:
                e_4_1 = _w.sent();
                e_4 = { error: e_4_1 };
                return [3, 27];
            case 22:
                _w.trys.push([22, , 25, 26]);
                if (!(!_a && !_f && (_g = files_1.return))) return [3, 24];
                return [4, _g.call(files_1)];
            case 23:
                _w.sent();
                _w.label = 24;
            case 24: return [3, 26];
            case 25:
                if (e_4) throw e_4.error;
                return [7];
            case 26: return [7];
            case 27: return [2, events];
            case 28: return [4, getDirectories(directoryPath)];
            case 29:
                dirs = _w.sent();
                _w.label = 30;
            case 30:
                _w.trys.push([30, 64, 65, 70]);
                _c = true, dirs_1 = __asyncValues(dirs);
                _w.label = 31;
            case 31: return [4, dirs_1.next()];
            case 32:
                if (!(dirs_1_1 = _w.sent(), _m = dirs_1_1.done, !_m)) return [3, 63];
                _p = dirs_1_1.value;
                _c = false;
                _w.label = 33;
            case 33:
                _w.trys.push([33, , 61, 62]);
                dir = _p;
                ;
                tablepath = (0, path_1.join)(directoryPath, dir);
                return [4, getFiles(tablepath)];
            case 34:
                files = _w.sent();
                _w.label = 35;
            case 35:
                _w.trys.push([35, 54, 55, 60]);
                _d = true, files_2 = (e_6 = void 0, __asyncValues(files));
                _w.label = 36;
            case 36: return [4, files_2.next()];
            case 37:
                if (!(files_2_1 = _w.sent(), _q = files_2_1.done, !_q)) return [3, 53];
                _s = files_2_1.value;
                _d = false;
                _w.label = 38;
            case 38:
                _w.trys.push([38, , 51, 52]);
                file = _s;
                path = (0, path_1.join)(tablepath, file);
                contents = require(path)();
                _w.label = 39;
            case 39:
                _w.trys.push([39, 44, 45, 50]);
                _e = true, contents_2 = (e_5 = void 0, __asyncValues(contents));
                _w.label = 40;
            case 40: return [4, contents_2.next()];
            case 41:
                if (!(contents_2_1 = _w.sent(), _t = contents_2_1.done, !_t)) return [3, 43];
                _v = contents_2_1.value;
                _e = false;
                try {
                    content = _v;
                    events[type].push({ type: type, dir: dir, file: file, path: path, content: content });
                }
                finally {
                    _e = true;
                }
                _w.label = 42;
            case 42: return [3, 40];
            case 43: return [3, 50];
            case 44:
                e_5_1 = _w.sent();
                e_5 = { error: e_5_1 };
                return [3, 50];
            case 45:
                _w.trys.push([45, , 48, 49]);
                if (!(!_e && !_t && (_u = contents_2.return))) return [3, 47];
                return [4, _u.call(contents_2)];
            case 46:
                _w.sent();
                _w.label = 47;
            case 47: return [3, 49];
            case 48:
                if (e_5) throw e_5.error;
                return [7];
            case 49: return [7];
            case 50: return [3, 52];
            case 51:
                _d = true;
                return [7];
            case 52: return [3, 36];
            case 53: return [3, 60];
            case 54:
                e_6_1 = _w.sent();
                e_6 = { error: e_6_1 };
                return [3, 60];
            case 55:
                _w.trys.push([55, , 58, 59]);
                if (!(!_d && !_q && (_r = files_2.return))) return [3, 57];
                return [4, _r.call(files_2)];
            case 56:
                _w.sent();
                _w.label = 57;
            case 57: return [3, 59];
            case 58:
                if (e_6) throw e_6.error;
                return [7];
            case 59: return [7];
            case 60: return [3, 62];
            case 61:
                _c = true;
                return [7];
            case 62: return [3, 31];
            case 63: return [3, 70];
            case 64:
                e_7_1 = _w.sent();
                e_7 = { error: e_7_1 };
                return [3, 70];
            case 65:
                _w.trys.push([65, , 68, 69]);
                if (!(!_c && !_m && (_o = dirs_1.return))) return [3, 67];
                return [4, _o.call(dirs_1)];
            case 66:
                _w.sent();
                _w.label = 67;
            case 67: return [3, 69];
            case 68:
                if (e_7) throw e_7.error;
                return [7];
            case 69: return [7];
            case 70: return [2, events];
        }
    });
}); };
var removeEvents = function (events) { return __awaiter(void 0, void 0, void 0, function () {
    var choices, _a, removables, confirm;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                choices = events.map(function (_event) { return ({
                    title: "".concat(_event.type).concat(_event.dir ? ' > ' + _event.dir : '', " > ").concat(_event.file, " > ").concat(JSON.stringify(_event.content)),
                    value: __assign({}, _event)
                }); });
                return [4, prompts([{
                            type: "multiselect",
                            name: "removables",
                            message: "Select event(s) to remove",
                            choices: choices,
                            min: 1
                        }, {
                            type: "confirm",
                            name: "confirm",
                            message: "Are you sure you want to remove these event(s)?"
                        }])];
            case 1:
                _a = _b.sent(), removables = _a.removables, confirm = _a.confirm;
                return [2, { removables: removables, confirm: confirm }];
        }
    });
}); };
//# sourceMappingURL=event-remove.js.map