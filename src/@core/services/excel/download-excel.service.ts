import {Injectable} from "@angular/core";
import * as XLSX from "xlsx";

const EXCEL_EXTENSION = ".xlsx";

@Injectable({
	providedIn: "root"
})
export class DownloadExcelService {
	constructor() {
	}

	public downloadExcelFileFromTable(table, fileName: string) {
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(table, {raw: true});

		ws["!cols"] = [];
		ws["!cols"][0] = {wch: 5};
		ws["!cols"][1] = {wch: 50};
		ws["!cols"][2] = {wch: 50};

		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
		XLSX.writeFile(wb, `${fileName}${EXCEL_EXTENSION}`);
	}

	public downloadExcelFileFromJson(json, fileName: string) {
		const workbook: XLSX.WorkBook = XLSX.utils.book_new();
		const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);

		const wscols = [
			{wch: 5},
			{wch: 50},
			{wch: 50}
		];
		worksheet["!cols"] = wscols;


		// Add the modified worksheet to the workbook and save it
		XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
		XLSX.writeFile(workbook, fileName+".xlsx");
	}
}
