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
exports.deleteEvents = exports.cronRemove = void 0;
var prompts = require("prompts");
var writeFile = require("@gluestack/helpers").writeFile;
var fileExists = require("@gluestack/helpers").fileExists;
var path_1 = require("path");
function cronRemove(program, glueStackPlugin) {
    program
        .command("cron:remove")
        .description("List the cron jobs with select option")
        .action(function () { return (0, exports.deleteEvents)(glueStackPlugin); });
}
exports.cronRemove = cronRemove;
var deleteEvents = function (_glueStackPlugin) { return __awaiter(void 0, void 0, void 0, function () {
    var cronsFilePath, dataFilePath, crons, _a, removables, confirm, newCrons;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                cronsFilePath = './backend/crons/crons.json';
                return [4, fileExists(cronsFilePath)];
            case 1:
                if (!(_b.sent())) {
                    console.log('error: cron file missing!');
                    process.exit(0);
                }
                dataFilePath = (0, path_1.join)(process.cwd(), cronsFilePath.slice(2));
                crons = require(dataFilePath);
                if (crons.length <= 0) {
                    console.log("> Error: crons.json file is empty! Please add one and try again.\n> You can add cron \"node glue cron:add\"");
                    process.exit(0);
                }
                return [4, removeCrons(crons)];
            case 2:
                _a = _b.sent(), removables = _a.removables, confirm = _a.confirm;
                if (!confirm) {
                    console.log("> Aborted");
                    process.exit(-1);
                }
                newCrons = crons.filter(function (_, index) { return !removables.includes(index); });
                return [4, writeFile(dataFilePath, JSON.stringify(newCrons, null, 2))];
            case 3:
                _b.sent();
                return [2];
        }
    });
}); };
exports.deleteEvents = deleteEvents;
var removeCrons = function (crons) { return __awaiter(void 0, void 0, void 0, function () {
    var choices, _a, removables, confirm;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                choices = crons.map(function (obj, index) { return ({
                    title: "{\"schedule\": \"".concat(obj.schedule, "\", \"type\": \"").concat(obj.type, "\", \"value\": \"").concat(obj.value, "\"}"),
                    value: index
                }); });
                return [4, prompts([{
                            type: "multiselect",
                            name: "removables",
                            message: "Select cron(s) to remove",
                            choices: choices,
                            min: 1
                        }, {
                            type: "confirm",
                            name: "confirm",
                            message: "Are you sure you want to remove these cron(s)?"
                        }])];
            case 1:
                _a = _b.sent(), removables = _a.removables, confirm = _a.confirm;
                return [2, { removables: removables, confirm: confirm }];
        }
    });
}); };
//# sourceMappingURL=cron-remove.js.map