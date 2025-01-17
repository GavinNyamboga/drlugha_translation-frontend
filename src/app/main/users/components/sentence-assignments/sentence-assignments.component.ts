import {Component, Input, OnInit} from "@angular/core";
import {UserBatchDetailsStats} from "../../../../../@core/models/user/user-batch-details-stats";

@Component({
	selector: "app-sentence-assignments",
	templateUrl: "./sentence-assignments.component.html",
	styleUrls: ["./sentence-assignments.component.scss"]
})
export class SentenceAssignmentsComponent implements OnInit {
	@Input() userBatchDetailsStats: UserBatchDetailsStats;
	@Input() canViewSentences: boolean;

	constructor() { }

	ngOnInit(): void {
	}

	getProgressInPercentage(numerator: number, denominator: number): number {
		const percentage = (numerator/denominator) * 100;

		return parseInt(percentage.toFixed(0));
	}

}
