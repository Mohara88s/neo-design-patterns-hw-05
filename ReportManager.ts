import { ReportAdapter } from "./ReportAdapter";
import { JsonReportAdapter } from "./JsonReportAdapter";
import { CsvReportAdapter } from "./CsvReportAdapter";
import { XmlReportAdapter } from "./XmlReportAdapter";
import { AnalyzerFacade } from "./AnalyzerFacade";
import * as fs from "fs";
import * as path from "path";

export class ReportManager {
	private static readonly REPORTS_DIR = "reports";
	private adapter: ReportAdapter;
	private fileExtension: string;
	private facade: AnalyzerFacade;

	constructor(format: string = "json") {
		this.initReportsDirectory();
		[this.adapter, this.fileExtension] = this.getAdapter(format);
		this.facade = new AnalyzerFacade(this.adapter);
	}

	private initReportsDirectory(): void {
		if (!fs.existsSync(ReportManager.REPORTS_DIR))
			fs.mkdirSync(ReportManager.REPORTS_DIR);
	}

	private getAdapter(format: string): [ReportAdapter, string] {
		switch (format.toLowerCase()) {
			case "json":
				return [new JsonReportAdapter(), "json"];
			case "xml":
				return [new XmlReportAdapter(), "xml"];
			case "csv":
				return [new CsvReportAdapter(), "csv"];
			default:
				throw new Error(`Unsupported format: ${format}`);
		}
	}

	public generateReport(targetPath: string): void {
		try {
			const report = this.facade.generateReport(targetPath);
			const time = new Date()
				.toISOString()
				.replace(/:/g, "-")
				.replace(/\./g, "-");
			const fileName = `report-${time}.${this.fileExtension}`;
			const fullPath = path.join(ReportManager.REPORTS_DIR, fileName);

			fs.writeFileSync(fullPath, report);

			console.log(`Report generated succesfully: ${fullPath}`);
		} catch (err) {
			console.log(`Error generating report ${err}`);
		}
	}
}
