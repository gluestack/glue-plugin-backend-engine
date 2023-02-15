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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventList = void 0;
var path_1 = __importDefault(require("path"));
var promises_1 = require("fs/promises");
var file_time_stamp_1 = require("../helpers/file-time-stamp");
var ConsoleTable = require("@gluestack/helpers").ConsoleTable;
function eventList(program, glueStackPlugin) {
    program
        .command("event:list")
        .option("--all", "list all the events")
        .option("--app", "list all app events")
        .option("--database", "list all database events")
        .description("List the events")
        .action(function (args) { return list(glueStackPlugin, args); });
}
exports.eventList = eventList;
var list = function (_glueStackPlugin, args) { return __awaiter(void 0, void 0, void 0, function () {
    var dbEventPath, appEventPath, head, rows, _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                dbEventPath = "./backend/events/database";
                appEventPath = "./backend/events/app";
                head = [
                    "Filepath",
                    "Functions",
                    "Webhooks",
                    "Modified on",
                ];
                rows = [];
                _a = true;
                switch (_a) {
                    case args.hasOwnProperty("all") || Object.entries(args).length === 0: return [3, 1];
                    case args.hasOwnProperty("app"): return [3, 5];
                    case args.hasOwnProperty("database"): return [3, 8];
                }
                return [3, 11];
            case 1: return [4, getEvents(appEventPath, rows, false)];
            case 2:
                _b.sent();
                return [4, getEvents(dbEventPath, rows, false)];
            case 3:
                _b.sent();
                return [4, sortingArray(rows)];
            case 4:
                _b.sent();
                ConsoleTable.print(head, rows);
                return [3, 11];
            case 5: return [4, getEvents(appEventPath, rows, false)];
            case 6:
                _b.sent();
                return [4, sortingArray(rows)];
            case 7:
                _b.sent();
                ConsoleTable.print(head, rows);
                return [3, 11];
            case 8: return [4, getEvents(dbEventPath, rows, false)];
            case 9:
                _b.sent();
                return [4, sortingArray(rows)];
            case 10:
                _b.sent();
                ConsoleTable.print(head, rows);
                return [3, 11];
            case 11: return [2];
        }
    });
}); };
var getEvents = function (eventPath, table, dbEvent) { return __awaiter(void 0, void 0, void 0, function () {
    var files, listData, _a, files_1, files_1_1, file, eventFilePath, isDir, _b, eventFilePath_1, data, arrayOfObjects, lastModifiedDays, allFunction, allWebhooks, lastModified, e_1_1, error_1;
    var _c;
    var _d, e_1, _e, _f;
    return __generator(this, function (_g) {
        switch (_g.label) {
            case 0: return [4, getFiles(eventPath)];
            case 1:
                files = _g.sent();
                _g.label = 2;
            case 2:
                _g.trys.push([2, 25, , 26]);
                _g.label = 3;
            case 3:
                _g.trys.push([3, 18, 19, 24]);
                _a = true, files_1 = __asyncValues(files);
                _g.label = 4;
            case 4: return [4, files_1.next()];
            case 5:
                if (!(files_1_1 = _g.sent(), _d = files_1_1.done, !_d)) return [3, 17];
                _f = files_1_1.value;
                _a = false;
                _g.label = 6;
            case 6:
                _g.trys.push([6, , 15, 16]);
                file = _f;
                eventFilePath = void 0;
                if (!dbEvent) {
                    eventFilePath = path_1.default.join(process.cwd(), eventPath.slice(2), file);
                }
                else {
                    eventFilePath = eventPath;
                }
                if (!dbEvent) return [3, 7];
                _b = false;
                return [3, 9];
            case 7: return [4, isDirectory(eventFilePath)];
            case 8:
                _b = _g.sent();
                _g.label = 9;
            case 9:
                isDir = _b;
                if (!!isDir) return [3, 12];
                eventFilePath_1 = dbEvent
                    ? path_1.default.join(eventPath, file)
                    : path_1.default.join(process.cwd(), eventPath.slice(2), file);
                data = require(eventFilePath_1);
                arrayOfObjects = data();
                listData = {
                    fileName: dbEvent
                        ? eventFilePath_1.split("/").slice(-3).join("/")
                        : eventFilePath_1.split("/").slice(-2).join("/"),
                    event: {
                        fun: [],
                        webhook: [],
                    },
                    lastModified: "",
                };
                return [4, (0, file_time_stamp_1.timeStamp)(eventFilePath_1)];
            case 10:
                lastModifiedDays = _g.sent();
                listData.lastModified = lastModifiedDays;
                return [4, arrayOfObjects.map(function (events) {
                        if (events.type === "function") {
                            listData.event.fun.push(events.value);
                        }
                        if (events.type === "webhook") {
                            listData.event.webhook.push(events.value);
                        }
                    })];
            case 11:
                _g.sent();
                allFunction = listData.event.fun.join("\n");
                allWebhooks = listData.event.webhook.join("\n");
                lastModified = listData.lastModified;
                table.push((_c = {},
                    _c[listData.fileName] = [allFunction, allWebhooks, lastModified],
                    _c));
                return [3, 14];
            case 12: return [4, getEvents(eventFilePath, table, true)];
            case 13:
                _g.sent();
                _g.label = 14;
            case 14: return [3, 16];
            case 15:
                _a = true;
                return [7];
            case 16: return [3, 4];
            case 17: return [3, 24];
            case 18:
                e_1_1 = _g.sent();
                e_1 = { error: e_1_1 };
                return [3, 24];
            case 19:
                _g.trys.push([19, , 22, 23]);
                if (!(!_a && !_d && (_e = files_1.return))) return [3, 21];
                return [4, _e.call(files_1)];
            case 20:
                _g.sent();
                _g.label = 21;
            case 21: return [3, 23];
            case 22:
                if (e_1) throw e_1.error;
                return [7];
            case 23: return [7];
            case 24: return [3, 26];
            case 25:
                error_1 = _g.sent();
                console.log(error_1);
                return [3, 26];
            case 26: return [2];
        }
    });
}); };
var getFiles = function (filePath) { return __awaiter(void 0, void 0, void 0, function () {
    var files;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, (0, promises_1.readdir)(filePath)];
            case 1:
                files = _a.sent();
                return [2, (!files || files.length === 0) ? [] : files];
        }
    });
}); };
var sortingArray = function (table) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        table.sort(function (a, b) { return __awaiter(void 0, void 0, void 0, function () {
            var timingA, timingB, timingAInSeconds, timingBInSeconds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timingA = Object.values(a)[0][2];
                        timingB = Object.values(b)[0][2];
                        if (timingB.startsWith("a ") || timingB.startsWith("an ")) {
                            timingB = "1 " + timingB.substring(2);
                        }
                        if (timingA.startsWith("a ") || timingA.startsWith("an ")) {
                            timingA = "1 " + timingA.substring(2);
                        }
                        return [4, getSecondsFromTiming(timingA)];
                    case 1:
                        timingAInSeconds = _a.sent();
                        return [4, getSecondsFromTiming(timingB)];
                    case 2:
                        timingBInSeconds = _a.sent();
                        return [2, timingAInSeconds - timingBInSeconds];
                }
            });
        }); });
        return [2];
    });
}); };
var getSecondsFromTiming = function (timing) { return __awaiter(void 0, void 0, void 0, function () {
    var time, unit;
    return __generator(this, function (_a) {
        time = timing.match(/\d+/);
        unit = timing.match(/[a-zA-Z]+/);
        time = time ? time[0] : 1;
        if (unit[0] === "day" || unit[0] === "days") {
            return [2, time * 60 * 60 * 24];
        }
        else if (unit[0] === "hour" || unit[0] === "hours") {
            return [2, time * 60 * 60];
        }
        else if (unit[0] === "minute" || unit[0] === "minutes") {
            return [2, time * 60];
        }
        else if (unit[0] === "year" || unit[0] === "years") {
            return [2, time * 365 * 24 * 60 * 60];
        }
        return [2];
    });
}); };
var isDirectory = function (path) { return __awaiter(void 0, void 0, void 0, function () {
    var data, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4, (0, promises_1.lstat)(path)];
            case 1:
                data = _a.sent();
                if (data.isDirectory()) {
                    return [2, true];
                }
                else {
                    return [2, false];
                }
                return [3, 3];
            case 2:
                error_2 = _a.sent();
                console.log(error_2);
                process.exit(0);
                return [3, 3];
            case 3: return [2];
        }
    });
}); };
//# sourceMappingURL=event-list.js.map