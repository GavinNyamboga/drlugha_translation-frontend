import { Component, OnInit } from "@angular/core";
import {UserStats} from "../../../../@core/models/user/user-stats";
import {UserService} from "../../../../@core/services/auth/user.service";

@Component({
	selector: "app-user-stats",
	templateUrl: "./user-stats.component.html",
	styleUrls: ["./user-stats.component.scss"]
})
export class UserStatsComponent implements OnInit {
	userStats: UserStats[] = [];
	loadingStats = true;
	selectedOption: "text" | "audio" = "text";

	constructor(private userService: UserService) { }

	ngOnInit(): void {
		this.getUsersStats();
	}

	getUsersStats() {
		this.userService.usersStats(this.selectedOption).subscribe((userStats) => {
			this.loadingStats = false;
			this.userStats = userStats;
		}, () => {
			this.loadingStats = false;
		});
	}

	updateTable($event) {
		this.selectedOption = $event.nextId;

		this.getUsersStats();
	}
}
