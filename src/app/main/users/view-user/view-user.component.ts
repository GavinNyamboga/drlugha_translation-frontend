import { Component, OnInit } from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {StatsPerUser} from "../../../../@core/models/user/stats-per-user";
import {UserBatchDetailsStats} from "../../../../@core/models/user/user-batch-details-stats";
import {AuthenticationService} from "../../../auth/service";
import {UserService} from "../../../../@core/services/auth/user.service";

@Component({
	selector: "app-view-user",
	templateUrl: "./view-user.component.html",
	styleUrls: ["./view-user.component.scss"]
})
export class ViewUserComponent implements OnInit {
	private userId: number;

	public statsPerUser: StatsPerUser;
	public userBatchDetailsStats: UserBatchDetailsStats;
	constructor(
		private userService: UserService,
		private activatedRoute: ActivatedRoute,
		private authService: AuthenticationService) { }

	ngOnInit(): void {
		this.userId = this.activatedRoute.snapshot.params.userId;
		this.getStatsPerUser();
		this.getUserBatchDetailsStats();
	}

	getStatsPerUser() {
		this.userService.statsPerUser(this.userId).subscribe((statsPerUser) => {
			this.statsPerUser = statsPerUser;
		});
	}

	getUserBatchDetailsStats() {
		this.userService.userBatchDetailsStats(this.userId).subscribe((userBatchDetailsStats) => {
			this.userBatchDetailsStats = userBatchDetailsStats;
		});
	}

	getProgressInPercentage(numerator: number, denominator: number): number {
		const percentage = (numerator/denominator) * 100;

		return parseInt(percentage.toFixed(0));
	}

	get isAdmin(): boolean {
		return this.authService.isAdmin;
	}
}
