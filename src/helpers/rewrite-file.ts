import fs from 'fs';
import util from 'util';

const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// Replaces file's content with the given database name
export const reWriteFile = async (filePath: string, instanceName: string, defaultVar = 'services') => {
	return new Promise(async (resolve, reject) => {
		try {
			let data: any = await readFile(filePath, "utf8");
			data = data.replaceAll(defaultVar, instanceName);

			await writeFile(filePath, data);
			resolve('done');
		} catch (err) {
			reject(err)
		}
	})
}
