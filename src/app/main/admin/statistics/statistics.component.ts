import {Component, OnInit, ViewEncapsulation} from "@angular/core";
import {NgbCalendar, NgbDate, NgbDateParserFormatter} from "@ng-bootstrap/ng-bootstrap";
import {UserStatisticsService} from "./services/user-statistics.service";
import {UserStatistics} from "./models/user-statistics";
import {ToastrService} from "ngx-toastr";
import * as XLSX from "xlsx";

@Component({
	selector: "app-statistics",
	templateUrl: "./statistics.component.html",
	styleUrls: ["./statistics.component.scss"],
	encapsulation: ViewEncapsulation.None
})
export class StatisticsComponent implements OnInit {
	public hoveredDate: NgbDate | null = null;
	public fromDate: NgbDate | null;
	public toDate: NgbDate | null;
	public userStatistics: UserStatistics[] = [];
	public loadingStatistics = false;
	public selectedOption: "text" | "audio" = "text";
	constructor(
		public formatter: NgbDateParserFormatter,
		private calendar: NgbCalendar,
		private userStatisticsService: UserStatisticsService,
		private toastService: ToastrService) {

	}

	ngOnInit() {
	}

	isHovered(date: NgbDate) {
		return (
			this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
		);
	}

	isInside(date: NgbDate) {
		return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
	}

	isRange(date: NgbDate) {
		return (
			date.equals(this.fromDate) ||
			(this.toDate && date.equals(this.toDate)) ||
			this.isInside(date) ||
			this.isHovered(date)
		);
	}

	onDateSelection(date: NgbDate) {
		if (!this.fromDate && !this.toDate) {
			this.fromDate = date;
		} else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
			this.toDate = date;
		} else {
			this.toDate = null;
			this.fromDate = date;
		}
	}

	generateReport() {
		const fromDate = this.formatter.format(this.fromDate);
		const toDate = this.formatter.format(this.toDate);

		this.loadingStatistics = true;
		this.userStatistics = [];
		this.userStatisticsService.getUserStatistics(fromDate, toDate, this.selectedOption).subscribe((userStatistics: any) => {
			this.loadingStatistics = false;
			this.userStatistics = userStatistics;
		}, () => {
			this.loadingStatistics = false;
			this.toastService.error("Failed to fetch report for the selected date");
		});
	}

	exportToExcel() {
		const element = document.getElementById("user-statistics-report");

		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {raw: true});

		ws["!cols"] = [];
		ws["!cols"][0] = {wch: 5};
		ws["!cols"][1] = {wch: 20};
		ws["!cols"][2] = {wch: 20};
		ws["!cols"][3] = {wch: 20};
		ws["!cols"][4] = {wch: 20};
		ws["!cols"][4] = {wch: 20};

		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

		const fileName = `UserStatisticsReport_${this.formatter.format(this.fromDate)}_${this.formatter.format(this.toDate)}.xlsx`;
		XLSX.writeFile(wb, fileName);
	}

	updateTable($event) {
		this.selectedOption = $event.nextId;

		if (this.fromDate && this.toDate)
			this.generateReport();
	}
}
