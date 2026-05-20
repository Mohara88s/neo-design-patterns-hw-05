import * as fs from "fs";
import * as path from "path";
import { DirectoryReport } from "./DirectoryReport";

export class DirectoryAnalyzer {
	analyze(dirPath: string): DirectoryReport {
		const report: DirectoryReport = {
			files: 0,
			directories: 0,
			totalSize: 0,
			extensions: {},
		};

		const walk = (currentPath: string) => {
			const entries = fs.readdirSync(currentPath, { withFileTypes: true });

			for (const entry of entries) {
				const fullPath = path.join(currentPath, entry.name);
				if (entry.isDirectory()) {
					report.directories++;
					walk(fullPath);
				} else if (entry.isFile()) {
					report.files++;
					const ext = path.extname(entry.name).toLocaleLowerCase();
					report.extensions[ext] = (report.extensions[ext] || 0) + 1;

					const stats = fs.statSync(fullPath);
					report.totalSize += stats.size;
				}
			}
		};
		walk(dirPath);

		return report;
	}
}
