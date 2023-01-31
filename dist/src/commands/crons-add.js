"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createContent = exports.create = exports.cronsAdd = void 0;
var write_file_1 = require("../helpers/write-file");
var file_exists_1 = require("../helpers/file-exists");
var cron = __importStar(require("node-cron"));
var path_1 = __importDefault(require("path"));
var colors = require("colors");
var cronsAdd = function (program, glueStackPlugin) {
    program
        .command("cron:add")
        .option("--s, --schedule <special>", "schedule value (for every minute '* * * * *')")
        .option("--m, --method <method-name>", "name of the method (required --f)")
        .option("--f, --function <function-name>", "name of function (required --m)")
        .option("--w, --webhook <webhook-url>", "webhook url")
        .description("Create the cron")
        .action(function (args) { return create(glueStackPlugin, args); });
};
exports.cronsAdd = cronsAdd;
function create(_glueStackPlugin, args) {
    return __awaiter(this, void 0, void 0, function () {
        var fileContent, content, cronsPath, _a, isScheduleValid, cronsFilePath, data, objExist;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    cronsPath = "./backend/crons";
                    if (!args.schedule) {
                        console.log("error: option '--s' required you can add '--s <schedule-value>' add --help for more information\n\nexample: node glue cron:add --s '* * * * *'");
                        process.exit();
                    }
                    _a = true;
                    switch (_a) {
                        case "function" in args && "webhook" in args || !args.hasOwnProperty("function") && !args.hasOwnProperty("webhook"): return [3, 1];
                        case args.hasOwnProperty('function') && !args.hasOwnProperty('method'): return [3, 2];
                        case "function" in args: return [3, 3];
                        case "webhook" in args: return [3, 5];
                    }
                    return [3, 7];
                case 1:
                    console.log("error: required one option you can add '--f <function-name>' or '--w <webhook-url>' add --help for more information");
                    process.exit(0);
                    _b.label = 2;
                case 2:
                    console.log("error: required method name with function you can add '--m <method-name>' add --help for more information");
                    process.exit(0);
                    _b.label = 3;
                case 3: return [4, createContent("function", args, args.schedule)];
                case 4:
                    content = _b.sent();
                    return [3, 7];
                case 5: return [4, createContent("webhook", args, args.schedule)];
                case 6:
                    content = _b.sent();
                    return [3, 7];
                case 7:
                    isScheduleValid = args.hasOwnProperty("schedule") &&
                        (args.hasOwnProperty("function") || args.hasOwnProperty("webhook")) &&
                        cron.validate(args.schedule);
                    if (!isScheduleValid) {
                        console.log("error: invalid format! valid format is --s '* * * * *'.\n\nexample: node glue cron:add --s '* * * * *'");
                        process.exit(0);
                    }
                    cronsFilePath = "".concat(cronsPath, "/crons.json");
                    return [4, (0, file_exists_1.fileExists)(cronsFilePath)];
                case 8:
                    if (_b.sent()) {
                        data = require(path_1.default.join(process.cwd(), cronsPath.slice(2), "crons"));
                        if (data.length !== 0) {
                            objExist = data.find(function (obj) {
                                return (obj.schedule === content.schedule &&
                                    obj.type === content.type &&
                                    obj.value === content.value);
                            });
                            if (objExist) {
                                console.log("schedule \"".concat(content.schedule, "\" of ").concat(content.type, " \"").concat(content.value, "\" already exist!"));
                                process.exit();
                            }
                        }
                        data.push(content);
                        fileContent = JSON.stringify(data, null, 2);
                    }
                    else {
                        fileContent = "[".concat(JSON.stringify(content, null, 2), "]");
                    }
                    return [4, (0, write_file_1.writeFile)(cronsFilePath, fileContent)];
                case 9:
                    _b.sent();
                    console.log("Successfully created!");
                    return [2];
            }
        });
    });
}
exports.create = create;
function createContent(type, value, schedule) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, {
                    schedule: schedule,
                    type: type,
                    value: type === 'function' ? "".concat(value.function, "::").concat(value.method) : value.webhook,
                }];
        });
    });
}
exports.createContent = createContent;
//# sourceMappingURL=crons-add.js.map