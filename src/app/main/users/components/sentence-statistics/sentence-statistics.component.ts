import {Component, Input, OnInit} from "@angular/core";
import {StatsPerUser} from "../../../../../@core/models/user/stats-per-user";

@Component({
	selector: "app-sentence-statistics",
	templateUrl: "./sentence-statistics.component.html",
	styleUrls: ["./sentence-statistics.component.scss"]
})
export class SentenceStatisticsComponent implements OnInit {
	@Input() statsPerUser: StatsPerUser;
	constructor() { }

	ngOnInit(): void {
	}

}
