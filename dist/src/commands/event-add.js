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
exports.eventAdd = void 0;
var colors = require('colors');
var prompts = require("prompts");
var services = require("@gluestack/framework/constants/services");
var fileExists = require("@gluestack/helpers").fileExists;
var getDirectories = require("@gluestack/helpers").getDirectories;
var path_1 = require("path");
var unique_1 = require("../helpers/unique");
var removeSpecialChars = require("@gluestack/helpers").removeSpecialChars;
var write_content_to_filepath_1 = require("../helpers/write-content-to-filepath");
function eventAdd(program, glueStackPlugin) {
    program
        .command("event:add")
        .description("Creates the event")
        .action(function () { return create(glueStackPlugin); });
}
exports.eventAdd = eventAdd;
var create = function (gluestackPlugin) { return __awaiter(void 0, void 0, void 0, function () {
    var backendInstance, method, webhook, content, tableName, eventName, functionName, triggers, eventType, eventKind, callbackType, instance, functionsPath, directories;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                backendInstance = 'backend';
                method = '';
                webhook = '';
                tableName = '';
                eventName = '';
                functionName = '';
                triggers = [];
                return [4, SELECT_TYPE()];
            case 1:
                eventType = _a.sent();
                if (!(eventType === 'database')) return [3, 4];
                return [4, TABLE_NAME()];
            case 2:
                tableName = _a.sent();
                return [4, MULTISELECT_DB_EVENTS()];
            case 3:
                triggers = _a.sent();
                return [3, 6];
            case 4: return [4, INPUT_EVENT_NAME()];
            case 5:
                eventName = _a.sent();
                _a.label = 6;
            case 6: return [4, SELECT_KIND()];
            case 7:
                eventKind = _a.sent();
                return [4, SELECT_CALLBACK_TYPE()];
            case 8:
                callbackType = _a.sent();
                if (!(callbackType === 'function')) return [3, 13];
                return [4, SELECT_INSTANCES(gluestackPlugin.app.getContainerTypePluginInstances(false))];
            case 9:
                instance = _a.sent();
                if (!instance) {
                    console.log(colors.brightRed('> No services found. Please add one and try again!'));
                    process.exit(-1);
                }
                functionName = instance.getName();
                functionsPath = (0, path_1.join)(process.cwd(), instance.getInstallationPath(), 'functions');
                return [4, fileExists(functionsPath)];
            case 10:
                if (!(_a.sent())) {
                    console.log(colors.brightRed("> No functions found in ".concat((0, path_1.relative)('.', functionsPath), ". Please add one and try again!")));
                    return [2];
                }
                return [4, getDirectories(functionsPath)];
            case 11:
                directories = _a.sent();
                if (!directories.length) {
                    console.log(colors.brightRed("> No functions found in ".concat((0, path_1.relative)('.', functionsPath), ". Please add one and try again!")));
                    return [2];
                }
                return [4, SELECT_FUNCTIONS(directories)];
            case 12:
                method = _a.sent();
                return [3, 15];
            case 13: return [4, INPUT_WEBHOOK()];
            case 14:
                webhook = _a.sent();
                _a.label = 15;
            case 15:
                content = CREATE_CONTENT(eventKind, callbackType, callbackType === 'function' ? { function: functionName, method: method } : { webhook: webhook });
                return [4, createFileByType(backendInstance, eventType, eventType === 'database' ? { tableName: tableName, triggers: triggers } : { eventName: eventName }, content)];
            case 16:
                _a.sent();
                return [2];
        }
    });
}); };
var createFileByType = function (backendInstance, type, dirent, content) { return __awaiter(void 0, void 0, void 0, function () {
    var appEventPath, dbEventPath, filepath, _a, _b, _c, trigger, filepath, e_1_1;
    var _d, e_1, _e, _f;
    var _g;
    return __generator(this, function (_h) {
        switch (_h.label) {
            case 0:
                appEventPath = "./".concat(backendInstance, "/events/app");
                dbEventPath = "./".concat(backendInstance, "/events/database");
                if (!(type === 'app')) return [3, 2];
                filepath = (0, path_1.join)(process.cwd(), appEventPath, "".concat(dirent.eventName, ".js"));
                return [4, appendFile(filepath, content)];
            case 1:
                _h.sent();
                _h.label = 2;
            case 2:
                if (!(type === 'database' && ((_g = dirent.triggers) === null || _g === void 0 ? void 0 : _g.length))) return [3, 17];
                _h.label = 3;
            case 3:
                _h.trys.push([3, 11, 12, 17]);
                _a = true, _b = __asyncValues(dirent.triggers);
                _h.label = 4;
            case 4: return [4, _b.next()];
            case 5:
                if (!(_c = _h.sent(), _d = _c.done, !_d)) return [3, 10];
                _f = _c.value;
                _a = false;
                _h.label = 6;
            case 6:
                _h.trys.push([6, , 8, 9]);
                trigger = _f;
                filepath = (0, path_1.join)(process.cwd(), dbEventPath, dirent.tableName, "".concat(trigger, ".js"));
                return [4, appendFile(filepath, content)];
            case 7:
                _h.sent();
                return [3, 9];
            case 8:
                _a = true;
                return [7];
            case 9: return [3, 4];
            case 10: return [3, 17];
            case 11:
                e_1_1 = _h.sent();
                e_1 = { error: e_1_1 };
                return [3, 17];
            case 12:
                _h.trys.push([12, , 15, 16]);
                if (!(!_a && !_d && (_e = _b.return))) return [3, 14];
                return [4, _e.call(_b)];
            case 13:
                _h.sent();
                _h.label = 14;
            case 14: return [3, 16];
            case 15:
                if (e_1) throw e_1.error;
                return [7];
            case 16: return [7];
            case 17: return [2];
        }
    });
}); };
var appendFile = function (filepath, content) { return __awaiter(void 0, void 0, void 0, function () {
    var fileContent, uniqueContent, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, fileExists(filepath)];
            case 1:
                if (!!(_a.sent())) return [3, 3];
                return [4, (0, write_content_to_filepath_1.writeContentToFilePath)(filepath, "module.exports = () => ".concat(JSON.stringify([content], null, 2), ";"))];
            case 2: return [2, _a.sent()];
            case 3:
                _a.trys.push([3, 6, , 7]);
                fileContent = require(filepath)();
                return [4, (0, unique_1.unique)(__spreadArray([content], fileContent, true))];
            case 4:
                uniqueContent = _a.sent();
                return [4, (0, write_content_to_filepath_1.writeContentToFilePath)(filepath, "module.exports = () => ".concat(JSON.stringify(uniqueContent, null, 2), ";"))];
            case 5:
                _a.sent();
                return [3, 7];
            case 6:
                err_1 = _a.sent();
                console.log(colors.brightRed("> Error while writing event to the file ".concat(filepath, ". Please check if file content is a valid json & try again!")));
                return [3, 7];
            case 7: return [2];
        }
    });
}); };
var TABLE_NAME = function () { return __awaiter(void 0, void 0, void 0, function () {
    var value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, prompts({
                    type: "text",
                    name: "value",
                    message: "Please provide table name against which you want to create event",
                    validate: function (value) { return (value.length > 0) ? true : false; }
                })];
            case 1:
                value = (_a.sent()).value;
                return [2, value];
        }
    });
}); };
var SELECT_TYPE = function () { return __awaiter(void 0, void 0, void 0, function () {
    var choices, value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                choices = [{
                        title: 'database',
                        description: "Create Database Event",
                        value: 'database',
                    }, {
                        title: 'app',
                        description: "Create App Event",
                        value: 'app',
                    }];
                return [4, prompts({
                        type: "select",
                        name: "value",
                        message: "Select Event's Type",
                        choices: choices,
                        min: 1
                    })];
            case 1:
                value = (_a.sent()).value;
                return [2, value];
        }
    });
}); };
var SELECT_KIND = function () { return __awaiter(void 0, void 0, void 0, function () {
    var choices, value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                choices = [{
                        title: 'sync',
                        description: "Synchronous Event Kind",
                        value: 'sync',
                    }, {
                        title: 'async',
                        description: "Asynchronous Event Kind",
                        value: 'async',
                    }];
                return [4, prompts({
                        type: "select",
                        name: "value",
                        message: "Select Event's Kind",
                        choices: choices,
                        min: 1
                    })];
            case 1:
                value = (_a.sent()).value;
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
                        message: "Select Event's Callback Type",
                        choices: choices,
                        min: 1
                    })];
            case 1:
                value = (_a.sent()).value;
                return [2, value];
        }
    });
}); };
var MULTISELECT_DB_EVENTS = function () { return __awaiter(void 0, void 0, void 0, function () {
    var choices, value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                choices = [{
                        title: 'insert',
                        description: "Create Insert Database Event",
                        value: 'insert',
                    }, {
                        title: 'update',
                        description: "Create Update Database Event",
                        value: 'update',
                    }, {
                        title: 'delete',
                        description: "Create Delete Database Event",
                        value: 'delete',
                    }];
                return [4, prompts({
                        type: "multiselect",
                        name: "value",
                        message: "Multi-select database events",
                        choices: choices,
                        min: 1
                    })];
            case 1:
                value = (_a.sent()).value;
                return [2, value];
        }
    });
}); };
var SELECT_INSTANCES = function (_instances) { var _a, _instances_1, _instances_1_1; return __awaiter(void 0, void 0, void 0, function () {
    var choices, instance, type, name_1, e_2_1, value;
    var _b, e_2, _c, _d;
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
                e_2_1 = _e.sent();
                e_2 = { error: e_2_1 };
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
                if (e_2) throw e_2.error;
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
var INPUT_EVENT_NAME = function () { return __awaiter(void 0, void 0, void 0, function () {
    var value;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, prompts({
                    type: "text",
                    name: "value",
                    message: "Please provide event name",
                    validate: function (value) { return (value.length > 0) ? true : false; },
                    format: function (value) { return removeSpecialChars(value); }
                })];
            case 1:
                value = (_a.sent()).value;
                return [2, value];
        }
    });
}); };
var CREATE_CONTENT = function (kind, type, value) {
    if (type === 'function' && (!value.function || !value.method)) {
        process.exit(-1);
    }
    if (type === 'webhook' && !value.webhook) {
        process.exit(-1);
    }
    return {
        kind: kind,
        type: type,
        value: type === 'function' ? "".concat(value.function, "::").concat(value.method) : value.webhook
    };
};
//# sourceMappingURL=event-add.js.map