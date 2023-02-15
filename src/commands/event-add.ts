const colors = require('colors');
const prompts = require("prompts");
const services = require("@gluestack/framework/constants/services");

const { fileExists } = require("@gluestack/helpers");
const { getDirectories } = require("@gluestack/helpers");

import { join, relative } from "path";
import { GlueStackPlugin } from "src";
import { unique } from "../helpers/unique";

const { removeSpecialChars } = require("@gluestack/helpers");
import { writeContentToFilePath } from "../helpers/write-content-to-filepath";

import IInstance from "@gluestack/framework/types/plugin/interface/IInstance";
import IHasContainerController from "@gluestack/framework/types/plugin/interface/IHasContainerController";


interface IChoice {
	title: string;
	description: string;
	value: string;
}

interface IContentType {
	kind: 'sync' | 'async';
	type: 'function' | 'webhook';
	value: string;
}

export function eventAdd(program: any, glueStackPlugin: GlueStackPlugin) {
	program
		.command("event:add")
		.description("Creates the event")
		.action(() => create(glueStackPlugin));
}

const create = async (gluestackPlugin: GlueStackPlugin) => {
	const backendInstance: string = 'backend';

	let method: string = '';
	let webhook: string = '';
	let content: IContentType;
	let tableName: string = '';
	let eventName: string = '';
	let functionName: string = '';
	let triggers: ('insert' | 'update' | 'delete')[] = [];

	const eventType = await SELECT_TYPE();
	if (eventType === 'database') {
		tableName = await TABLE_NAME();
		triggers = await MULTISELECT_DB_EVENTS();
	} else {
		eventName = await INPUT_EVENT_NAME();
	}

	const eventKind = await SELECT_KIND();

	const callbackType = await SELECT_CALLBACK_TYPE();
	if (callbackType === 'function') {
		const instance = await SELECT_INSTANCES(
			// @ts-ignore
			gluestackPlugin.app.getContainerTypePluginInstances(false)
		);

		if (!instance) {
			console.log(colors.brightRed('> No services found. Please add one and try again!'));
			process.exit(-1);
		}

		functionName = instance.getName();

		const functionsPath: string = join(
			process.cwd(),
			instance.getInstallationPath(),
			'functions'
		);

		if (!await fileExists(functionsPath)) {
			console.log(colors.brightRed(`> No functions found in ${relative('.', functionsPath)}. Please add one and try again!`));
			return;
		}

		const directories: string[] = await getDirectories(functionsPath);
		if (!directories.length) {
			console.log(colors.brightRed(`> No functions found in ${relative('.', functionsPath)}. Please add one and try again!`));
			return;
		}

		method = await SELECT_FUNCTIONS(directories);
	} else {
		webhook = await INPUT_WEBHOOK();
	}

	content = CREATE_CONTENT(
		eventKind,
		callbackType,
		callbackType === 'function' ? { function: functionName, method } : { webhook }
	);

	await createFileByType(
		backendInstance,
		eventType,
		eventType === 'database' ? { tableName, triggers } : { eventName },
		content
	);
};

const createFileByType = async (
	backendInstance: string, type: string, dirent: any, content: IContentType
) => {
	const appEventPath = `./${backendInstance}/events/app`;
	const dbEventPath = `./${backendInstance}/events/database`;

	if (type === 'app') {
		const filepath: string = join(process.cwd(), appEventPath, `${dirent.eventName}.js`);
		await appendFile(filepath, content);
	}

	if (type === 'database' && dirent.triggers?.length) {
		for await (const trigger of dirent.triggers) {
			const filepath: string = join(process.cwd(), dbEventPath, dirent.tableName, `${trigger}.js`);
			await appendFile(filepath, content);
		}
	}
};

const appendFile = async (filepath: string, content: IContentType) => {
	if (!await fileExists(filepath)) {
		return await writeContentToFilePath(
			filepath, `module.exports = () => ${JSON.stringify([content], null, 2)};`
		);
	}

	try {
		const fileContent = require(filepath)();

		const uniqueContent: IContentType[] = await unique([content, ...fileContent]);

		await writeContentToFilePath(
			filepath, `module.exports = () => ${JSON.stringify(uniqueContent, null, 2)};`
		);
	} catch (err) {
		console.log(colors.brightRed(`> Error while writing event to the file ${filepath}. Please check if file content is a valid json & try again!`));
	}
};

const TABLE_NAME = async () => {
	const { value } = await prompts({
		type: "text",
		name: "value",
		message: "Please provide table name against which you want to create event",
		validate: (value: string) => (value.length > 0) ? true : false
	});

	return value;
};

const SELECT_TYPE = async () => {
	const choices: IChoice[] = [{
		title: 'database',
		description: `Create Database Event`,
		value: 'database',
	}, {
		title: 'app',
		description: `Create App Event`,
		value: 'app',
	}];

	const { value } = await prompts({
		type: "select",
		name: "value",
		message: "Select Event's Type",
		choices: choices,
		min: 1
	});

	return value;
};

const SELECT_KIND = async () => {
	const choices: IChoice[] = [{
		title: 'sync',
		description: `Synchronous Event Kind`,
		value: 'sync',
	}, {
		title: 'async',
		description: `Asynchronous Event Kind`,
		value: 'async',
	}];

	const { value } = await prompts({
		type: "select",
		name: "value",
		message: "Select Event's Kind",
		choices: choices,
		min: 1
	});

	return value;
};

const SELECT_CALLBACK_TYPE = async () => {
	const choices: IChoice[] = [{
		title: 'function',
		description: `Callback to a Gluestack Service`,
		value: 'function',
	}, {
		title: 'webhook',
		description: `Callback to a Webhook`,
		value: 'webhook',
	}];

	const { value } = await prompts({
		type: "select",
		name: "value",
		message: "Select Event's Callback Type",
		choices: choices,
		min: 1
	});

	return value;
};

const MULTISELECT_DB_EVENTS = async () => {
	const choices: IChoice[] = [{
		title: 'insert',
		description: `Create Insert Database Event`,
		value: 'insert',
	}, {
		title: 'update',
		description: `Create Update Database Event`,
		value: 'update',
	}, {
		title: 'delete',
		description: `Create Delete Database Event`,
		value: 'delete',
	}];

	const { value } = await prompts({
		type: "multiselect",
		name: "value",
		message: "Multi-select database events",
		choices: choices,
		min: 1
	});

	return value;
};

const SELECT_INSTANCES = async (_instances: (IInstance & IHasContainerController)[]) => {
	const choices = [];

	for await (const instance of _instances) {
		// Get the type of the instance
		const type: string | undefined = instance?.callerPlugin.getType();
		const name: string | undefined = instance?.callerPlugin.getName();

		// If and only if the instance is a "stateless" + "backend" plugin
		if (
			instance && type && name &&
			instance?.containerController &&
			type === 'stateless' && services.includes(name)
		) {
			choices.push({
				title: instance.getName(),
				description: `Select instance ${instance.getName()}`,
				value: instance
			});
		}
	}

	const { value } = await prompts({
		type: "select",
		name: "value",
		message: "Select a service plugin",
		choices: choices
	});

	return value;
};

const SELECT_FUNCTIONS = async (functions: string[]) => {
	const choices = functions.map((_function: string) => {
		return {
			title: _function,
			value: _function
		};
	});

	const { value } = await prompts({
		type: "select",
		name: "value",
		message: "Select a function",
		choices: choices,
	});

	return value;
};

const INPUT_WEBHOOK = async () => {
	const { value } = await prompts({
		type: "text",
		name: "value",
		message: "Please provide Webhook URL",
		validate: (value: string) => (value.length > 0) ? true : false
	});

	return value;
};

const INPUT_EVENT_NAME = async () => {
	const { value } = await prompts({
		type: "text",
		name: "value",
		message: "Please provide event name",
		validate: (value: string) => (value.length > 0) ? true : false,
		format: (value: string) => removeSpecialChars(value)
	});

	return value;
};

const CREATE_CONTENT = (kind: 'sync' | 'async', type: 'function' | 'webhook', value: any) => {
	if (type === 'function' && (!value.function || !value.method)) {
		process.exit(-1);
	}

	if (type === 'webhook' && !value.webhook) {
		process.exit(-1);
	}

	return {
		kind,
		type,
		value: type === 'function' ? `${value.function}::${value.method}` : value.webhook
	};
};

