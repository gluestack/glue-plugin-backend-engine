import fs from "fs";
import moment from "moment";

export async function timeStamp(filePath: string) {
	return new Promise((resolve, _reject) => {
		fs.stat(filePath, (_err, stats) => {

			let currentTime = moment();
			let lastModifiedTime = moment(stats.mtime);
			let duration = moment.duration(currentTime.diff(lastModifiedTime));

			return resolve(duration.humanize());
		});
	});
}