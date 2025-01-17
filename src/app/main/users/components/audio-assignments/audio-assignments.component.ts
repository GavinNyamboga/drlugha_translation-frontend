import {Component, Input, OnInit} from "@angular/core";
import {UserBatchDetailsStats} from "../../../../../@core/models/user/user-batch-details-stats";

@Component({
	selector: "app-audio-assignments",
	templateUrl: "./audio-assignments.component.html",
	styleUrls: ["./audio-assignments.component.scss"]
})
export class AudioAssignmentsComponent implements OnInit {
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
