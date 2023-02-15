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
exports.create = exports.cronAdd = void 0;
var colors = require('colors');
var prompts = require("prompts");
var services = require("@gluestack/framework/constants/services");
var writeFile = require("@gluestack/helpers").writeFile;
var fileExists = require("@gluestack/helpers").fileExists;
var getDirectories = require("@gluestack/helpers").getDirectories;
var cron = __importStar(require("node-cron"));
var path_1 = require("path");
var unique_1 = require("../helpers/unique");
var cronAdd = function (program, gluestackPlugin) {
    program
        .command("cron:add")
        .description("Create the cron")
        .action(function (args) { return create(gluestackPlugin); });
};
exports.cronAdd = cronAdd;
function create(gluestackPlugin) {
    return __awaiter(this, void 0, void 0, function () {
        var method, webhook, functionName, content, fileContent, backendInstance, cronsFilePath, schedule, type, instance, functionsPath, directories;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    method = '';
                    webhook = '';
                    functionName = '';
                    content = {};
                    fileContent = [];
                    backendInstance = 'backend';
                    cronsFilePath = (0, path_1.join)(process.cwd(), backendInstance, 'crons/crons.json');
                    return [4, fileExists(cronsFilePath)];
                case 1:
                    if (!!(_a.sent())) return [3, 3];
                    return [4, writeFile(cronsFilePath, '[]')];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [4, INPUT_SCHEDULE()];
                case 4:
                    schedule = _a.sent();
                    return [4, SELECT_CALLBACK_TYPE()];
                case 5:
                    type = _a.sent();
                    if (!(type === 'function')) return [3, 10];
                    return [4, SELECT_INSTANCES(gluestackPlugin.app.getContainerTypePluginInstances(false))];
                case 6:
                    instance = _a.sent();
                    if (!instance) {
                        console.log(colors.brightRed('> No services found. Please add one and try again!'));
                        process.exit(-1);
                    }
                    functionName = instance.getName();
                    functionsPath = (0, path_1.join)(process.cwd(), instance.getInstallationPath(), 'functions');
                    return [4, fileExists(functionsPath)];
                case 7:
                    if (!(_a.sent())) {
                        console.log(colors.brightRed("> No functions found in ".concat((0, path_1.relative)('.', functionsPath), ". Please add one and try again!")));
                        return [2];
                    }
                    return [4, getDirectories(functionsPath)];
                case 8:
                    directories = _a.sent();
                    if (!directories.length) {
                        console.log(colors.brightRed("> No functions found in ".concat((0, path_1.relative)('.', functionsPath), ". Please add one and try again!")));
                        return [2];
                    }
                    return [4, SELECT_FUNCTIONS(directories)];
                case 9:
                    method = _a.sent();
                    return [3, 12];
                case 10: return [4, INPUT_WEBHOOK()];
                case 11:
                    webhook = _a.sent();
                    _a.label = 12;
                case 12:
                    content = CREATE_CONTENT(schedule, type, type === 'function' ?
                        { function: functionName, method: method } : { webhook: webhook });
                    fileContent = require(cronsFilePath);
                    return [4, (0, unique_1.unique)(__spreadArray([content], fileContent, true))];
                case 13:
                    fileContent = _a.sent();
                    fileContent = "".concat(JSON.stringify(fileContent, null, 2));
                    return [4, writeFile(cronsFilePath, fileContent)];
                case 14:
                    _a.sent();
                    return [2];
            }
        });
    });
}
exports.create = create;
var INPUT_SCHEDULE = function () { return __awaiter(void 0, void 0, void 0, function () {
    var error, value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                error = 'This is not a valid cron value. You can refer https://crontab.guru for a valid schedule.';
                return [4, prompts({
                        type: "text",
                        name: "value",
                        message: "Please provide a valid cron schedule",
                        validate: function (value) { return cron.validate(value) ? true : error; }
                    })];
            case 1:
                value = (_a.sent()).value;
                return [2, value];
        }
    });
}); };
var SELECT_INSTANCES = function (_instances) { var _a, _instances_1, _instances_1_1; return __awaiter(void 0, void 0, void 0, function () {
    var choices, instance, type, name_1, e_1_1, value;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                choices = [];
                _e.label = 1;
            case 1:
                _e.trys.push([1, 6, 7, 12]);
                _a = true, _instances_1 = __asyncValues(_instances);
                _e.label = 2;
            case 2: return [4, _instances_1.next()];
            case 3:
                if (!(_instances_1_1 = _e.sent(), _b = _instances_1_1.done, !_b)) return [3, 5];
                _d = _instances_1_1.value;
                _a = false;
                try {
                    instance = _d;
                    type = instance === null || instance === void 0 ? void 0 : instance.callerPlugin.getType();
                    name_1 = instance === null || instance === void 0 ? void 0 : instance.callerPlugin.getName();
                    if (instance && type && name_1 &&
                        (instance === null || instance === void 0 ? void 0 : instance.containerController) &&
                        type === 'stateless' && services.includes(name_1)) {
                        choices.push({
                            title: instance.getName(),
                            description: "Select instance ".concat(instance.getName()),
                            value: instance
                        });
                    }
                }
                finally {
                    _a = true;
                }
                _e.label = 4;
            case 4: return [3, 2];
            case 5: return [3, 12];
            case 6:
                e_1_1 = _e.sent();
                e_1 = { error: e_1_1 };
                return [3, 12];
            case 7:
                _e.trys.push([7, , 10, 11]);
                if (!(!_a && !_b && (_c = _instances_1.return))) return [3, 9];
                return [4, _c.call(_instances_1)];
            case 8:
                _e.sent();
                _e.label = 9;
            case 9: return [3, 11];
            case 10:
                if (e_1) throw e_1.error;
                return [7];
            case 11: return [7];
            case 12: return [4, prompts({
                    type: "select",
                    name: "value",
                    message: "Select a service plugin",
                    choices: choices
                })];
            case 13:
                value = (_e.sent()).value;
                return [2, value];
        }
    });
}); };
var SELECT_CALLBACK_TYPE = function () { return __awaiter(void 0, void 0, void 0, function () {
    var choices, value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                choices = [{
                        title: 'function',
                        description: "Callback to a Gluestack Service",
                        value: 'function',
                    }, {
                        title: 'webhook',
                        description: "Callback to a Webhook",
                        value: 'webhook',
                    }];
                return [4, prompts({
                        type: "select",
                        name: "value",
                        message: "Select Cron's Callback Type",
                        choices: choices,
                        min: 1
                    })];
            case 1:
                value = (_a.sent()).value;
                return [2, value];
        }
    });
}); };
var SELECT_FUNCTIONS = function (functions) { return __awaiter(void 0, void 0, void 0, function () {
    var choices, value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                choices = functions.map(function (_function) {
                    return {
                        title: _function,
                        value: _function
                    };
                });
                return [4, prompts({
                        type: "select",
                        name: "value",
                        message: "Select a function",
                        choices: choices,
                    })];
            case 1:
                value = (_a.sent()).value;
                return [2, value];
        }
    });
}); };
var INPUT_WEBHOOK = function () { return __awaiter(void 0, void 0, void 0, function () {
    var value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, prompts({
                    type: "text",
                    name: "value",
                    message: "Please provide Webhook URL",
                    validate: function (value) { return (value.length > 0) ? true : false; }
                })];
            case 1:
                value = (_a.sent()).value;
                return [2, value];
        }
    });
}); };
var CREATE_CONTENT = function (schedule, type, value) {
    if (type === 'function' && (!value.function || !value.method)) {
        process.exit(-1);
    }
    if (type === 'webhook' && !value.webhook) {
        process.exit(-1);
    }
    return {
        schedule: schedule,
        type: type,
        value: type === 'function' ? "".concat(value.function, "::").concat(value.method) : value.webhook
    };
};
//# sourceMappingURL=cron-add.js.map