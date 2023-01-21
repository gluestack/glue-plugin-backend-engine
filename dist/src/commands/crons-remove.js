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
exports.deleteEvents = exports.cronsRemove = void 0;
var path_1 = __importDefault(require("path"));
var write_file_1 = require("../helpers/write-file");
var file_exists_1 = require("../helpers/file-exists");
var colors = require("colors");
var _a = require('enquirer'), MultiSelect = _a.MultiSelect, confirm = _a.confirm;
function cronsRemove(program, glueStackPlugin) {
    program
        .command("crons:remove")
        .description("List the crons jobs with select option to delete")
        .action(function () { return deleteEvents(glueStackPlugin); });
}
exports.cronsRemove = cronsRemove;
function deleteEvents(_glueStackPlugin) {
    return __awaiter(this, void 0, void 0, function () {
        var cronsFilePath, dataFilePath, fileData, choices, prompt, responses, userConfirm;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cronsFilePath = './backend/crons/crons.json';
                    return [4, (0, file_exists_1.fileExists)(cronsFilePath)];
                case 1:
                    if (!(_a.sent())) {
                        console.log(colors.brightRed('> Crons file missing!'));
                        process.exit(0);
                    }
                    dataFilePath = path_1.default.join(process.cwd(), cronsFilePath.slice(2));
                    fileData = require(dataFilePath);
                    if (fileData.length <= 0) {
                        console.log(colors.brightRed('> Crons file empty! Please add one and try again.'));
                        process.exit(0);
                    }
                    choices = fileData.map(function (obj, index) { return ({
                        name: "{\"schedule\": \"".concat(obj.schedule, "\", \"type\": \"").concat(obj.type, "\", \"value\": \"").concat(obj.value, "\"}"),
                        value: index
                    }); });
                    prompt = new MultiSelect({
                        name: 'files',
                        message: 'Select the objects you want to delete by pressing <space>:',
                        choices: choices
                    });
                    return [4, prompt.run()];
                case 2:
                    responses = _a.sent();
                    if (!(responses.length !== 0)) return [3, 5];
                    return [4, confirm({
                            name: 'question',
                            message: 'Are you sure you want to delete the selected data?',
                        })];
                case 3:
                    userConfirm = _a.sent();
                    if (!userConfirm) return [3, 5];
                    choices = choices
                        .filter(function (choice) { return !responses.includes(choice.name); })
                        .map(function (choice) { return JSON.parse(choice.name); });
                    return [4, (0, write_file_1.writeFile)(cronsFilePath, JSON.stringify(choices, null, 2))];
                case 4:
                    _a.sent();
                    console.log(colors.brightGreen("> Successfully removed!"));
                    _a.label = 5;
                case 5: return [2];
            }
        });
    });
}
exports.deleteEvents = deleteEvents;
//# sourceMappingURL=crons-remove.js.map