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
exports.createContent = exports.create = exports.eventsAdd = void 0;
var path_1 = __importDefault(require("path"));
var write_file_1 = require("../helpers/write-file");
var create_folder_1 = require("../helpers/create-folder");
var file_exists_1 = require("../helpers/file-exists");
var colors = require("colors");
function eventsAdd(program, glueStackPlugin) {
    program
        .command("events:add")
        .option("--t, --table <table-name>", "Name of the table in database (table-name:event1,event2)")
        .option("--f, --function <function-name>", "Name of the function")
        .option("--w, --webhook <webhook-url>", "Webhook URL")
        .option("--a, --app <app-name>", "Name of the event")
        .description("Create the events")
        .action(function (args) {
        create(glueStackPlugin, args);
    });
}
exports.eventsAdd = eventsAdd;
function create(_glueStackPlugin, args) {
    var _a, e_1, _b, _c;
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, content, dbEventPath, appEventPath, _d, _e, folderName, events, _f, _g, _h, element, dbEventFilePath, data, arrayOfObjects, objExist, error_1, e_1_1, appEventFilePath, data, arrayOfObjects, objExist, error_2;
        return __generator(this, function (_j) {
            switch (_j.label) {
                case 0:
                    dbEventPath = "./backend/events/database";
                    appEventPath = "./backend/events/app";
                    if (!args.table && !args.function && !args.webhook && !args.app) {
                        console.log(colors.brightRed("Please provide at least one of the following options: --table, --function, --webhook, --app"));
                        process.exit(0);
                    }
                    _d = true;
                    switch (_d) {
                        case "function" in args && "webhook" in args || !args.hasOwnProperty("function") && !args.hasOwnProperty("webhook"): return [3, 1];
                        case "table" in args && "app" in args: return [3, 2];
                        case args.hasOwnProperty("function"): return [3, 3];
                        case args.hasOwnProperty("webhook"): return [3, 5];
                    }
                    return [3, 7];
                case 1:
                    console.log(colors.brightRed("> enter either --f function or --w webhook-url"));
                    process.exit(0);
                    _j.label = 2;
                case 2:
                    console.log(colors.brightRed("> provide either --table or --app"));
                    process.exit(0);
                    _j.label = 3;
                case 3: return [4, createContent("function", args.function)];
                case 4:
                    content = _j.sent();
                    return [3, 7];
                case 5: return [4, createContent("webhook", args.webhook)];
                case 6:
                    content = _j.sent();
                    return [3, 7];
                case 7:
                    if (!args.hasOwnProperty("table")) return [3, 27];
                    try {
                        _e = args.table.split(":"), folderName = _e[0], events = _e.slice(1);
                        args.table = { folderName: folderName, events: events[0].split(",") };
                    }
                    catch (error) {
                        console.log(colors.brightRed("> Table input is not valid please run --help"));
                        process.exit(0);
                    }
                    return [4, (0, create_folder_1.createFolder)("".concat(dbEventPath, "/").concat(args.table.folderName))];
                case 8:
                    _j.sent();
                    _j.label = 9;
                case 9:
                    _j.trys.push([9, 21, 22, 27]);
                    _f = true, _g = __asyncValues(args.table.events);
                    _j.label = 10;
                case 10: return [4, _g.next()];
                case 11:
                    if (!(_h = _j.sent(), _a = _h.done, !_a)) return [3, 20];
                    _c = _h.value;
                    _f = false;
                    _j.label = 12;
                case 12:
                    _j.trys.push([12, , 18, 19]);
                    element = _c;
                    _j.label = 13;
                case 13:
                    _j.trys.push([13, 16, , 17]);
                    return [4, (0, file_exists_1.fileExists)("".concat(dbEventPath, "/").concat(args.table.folderName, "/").concat(element, ".js"))];
                case 14:
                    if (_j.sent()) {
                        dbEventFilePath = path_1.default.join(process.cwd(), dbEventPath.slice(2), "".concat(args.table.folderName, "/").concat(element, ".js"));
                        data = require(dbEventFilePath);
                        arrayOfObjects = data();
                        if (arrayOfObjects.length !== 0) {
                            objExist = arrayOfObjects.find(function (obj) {
                                return (obj.kind === content.kind &&
                                    obj.type === content.type &&
                                    obj.value === content.value);
                            });
                            if (objExist) {
                                console.log(colors.brightRed("> ".concat(content.type, " already exist!")));
                                process.exit(0);
                            }
                        }
                        arrayOfObjects.push(content);
                        fileContent = "module.exports = () => ".concat(JSON.stringify(arrayOfObjects, null, 2), ";");
                    }
                    else {
                        fileContent = "module.exports = () => [".concat(JSON.stringify(content, null, 2), "];");
                    }
                    return [4, (0, write_file_1.writeFile)("".concat(dbEventPath, "/").concat(args.table.folderName, "/").concat(element, ".js"), fileContent)];
                case 15:
                    _j.sent();
                    console.log(colors.brightGreen("> Successfully created!"));
                    return [3, 17];
                case 16:
                    error_1 = _j.sent();
                    console.log(error_1);
                    return [3, 17];
                case 17: return [3, 19];
                case 18:
                    _f = true;
                    return [7];
                case 19: return [3, 10];
                case 20: return [3, 27];
                case 21:
                    e_1_1 = _j.sent();
                    e_1 = { error: e_1_1 };
                    return [3, 27];
                case 22:
                    _j.trys.push([22, , 25, 26]);
                    if (!(!_f && !_a && (_b = _g.return))) return [3, 24];
                    return [4, _b.call(_g)];
                case 23:
                    _j.sent();
                    _j.label = 24;
                case 24: return [3, 26];
                case 25:
                    if (e_1) throw e_1.error;
                    return [7];
                case 26: return [7];
                case 27:
                    if (!args.hasOwnProperty("app")) return [3, 32];
                    _j.label = 28;
                case 28:
                    _j.trys.push([28, 31, , 32]);
                    return [4, (0, file_exists_1.fileExists)("".concat(appEventPath, "/").concat(args.app, ".js"))];
                case 29:
                    if (_j.sent()) {
                        appEventFilePath = path_1.default.join(process.cwd(), appEventPath.slice(2), args.app);
                        data = require(appEventFilePath);
                        arrayOfObjects = data();
                        if (arrayOfObjects.length !== 0) {
                            objExist = arrayOfObjects.find(function (obj) {
                                return (obj.kind === content.kind &&
                                    obj.type === content.type &&
                                    obj.value === content.value);
                            });
                            if (objExist) {
                                console.log(colors.brightRed("> ".concat(content.type, " already exist!")));
                                process.exit(0);
                            }
                        }
                        arrayOfObjects.push(content);
                        fileContent = "module.exports = ()=> ".concat(JSON.stringify(arrayOfObjects, null, 2), ";");
                    }
                    else {
                        fileContent = "module.exports = () => [".concat(JSON.stringify(content, null, 2), "];");
                    }
                    return [4, (0, write_file_1.writeFile)("".concat(appEventPath, "/").concat(args.app, ".js"), fileContent)];
                case 30:
                    _j.sent();
                    console.log(colors.brightGreen("> Successfully created!"));
                    return [3, 32];
                case 31:
                    error_2 = _j.sent();
                    console.log(error_2);
                    return [3, 32];
                case 32: return [2];
            }
        });
    });
}
exports.create = create;
function createContent(type, value) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, {
                    kind: "sync",
                    type: type,
                    value: value,
                }];
        });
    });
}
exports.createContent = createContent;
//# sourceMappingURL=events-add.js.map