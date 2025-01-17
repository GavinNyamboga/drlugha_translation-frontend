import {Component, Input, OnInit} from "@angular/core";
import {StatsPerUser} from "../../../../../@core/models/user/stats-per-user";

@Component({
	selector: "app-audio-statistics",
	templateUrl: "./audio-statistics.component.html",
	styleUrls: ["./audio-statistics.component.scss"]
})
export class AudioStatisticsComponent implements OnInit {
	@Input() statsPerUser: StatsPerUser;

	constructor() { }

	ngOnInit(): void {
	}

}
