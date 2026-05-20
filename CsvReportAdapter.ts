import { ReportAdapter } from "./ReportAdapter";
import { DirectoryReport } from "./DirectoryReport";

export class CsvReportAdapter implements ReportAdapter {
	export(report: DirectoryReport): string {
		const lines = [
			"Metric,Value",
			`Total Files,${report.files}`,
			`Total Directories,${report.directories}`,
			`Total Size(bytes),${report.totalSize}`,
			"",
			"Extension,Count",
			...Object.entries(report.extensions).map(
				([extension, count]) => `${extension},${count}`,
			),
		];
		return lines.join("\n");
	}
}
