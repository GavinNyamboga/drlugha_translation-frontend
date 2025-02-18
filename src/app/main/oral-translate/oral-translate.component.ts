import {Component, OnDestroy, OnInit} from "@angular/core";
import {Location} from "@angular/common";
import {ActivatedRoute} from "@angular/router";
import {BatchService} from "../../../@core/services/batch/batch.service";
import {AuthService} from "../../../@core/services/auth/auth.service";
import {BatchProgressStatus} from "../../../@core/enums/batch-progress-status";
import {AuthenticationService} from "../../auth/service";
import {LoggedInUser} from "../../auth/models";
import {BatchDetailAssignments} from "../../../@core/models/batch/batch-detail-assignments";
import {
	AssignmentsProgressConfigService
} from "../../../@core/services/assignments/assignments-progress-config.service";

@Component({
	selector: "app-oral-translate",
	templateUrl: "./oral-translate.component.html",
	styleUrls: ["./oral-translate.component.scss"],
	host: { class: "translate-application" }
})
export class OralTranslateComponent implements OnInit, OnDestroy {
	currentUser: LoggedInUser;
	batchDetailAssignments: BatchDetailAssignments;
	batchDetailsId: number;
	currentPage: "recording" | "reviewing" | "expert-reviewing" = "recording";
	constructor(
		private location: Location,
		private batchService: BatchService,
		private authService: AuthService,
		private authenticationService: AuthenticationService,
		private activatedRoute: ActivatedRoute,
		private assignmentConfig: AssignmentsProgressConfigService) {
		this.authenticationService.currentUser.subscribe((user) => this.currentUser = user);
	}

	ngOnInit(): void {
		this.currentPage = this.activatedRoute.firstChild.snapshot.params["currentPage"];
		this.assignmentConfig.showTranscriptionAssignments = false;

		this.getUserBatches();

		this.batchService.batchDetails.subscribe((batchDetails) => {
			this.batchDetailAssignments = batchDetails;
		});
	}

	ngOnDestroy(): void {
		this.assignmentConfig.showTranscriptionAssignments = true;
	}

	getUserBatches() {
		let progressStatus: BatchProgressStatus = BatchProgressStatus.AUDIO_RECORDING;
		if (this.currentPage == "recording")
			progressStatus = BatchProgressStatus.AUDIO_RECORDING;
		else if (this.currentPage == "reviewing")
			progressStatus = BatchProgressStatus.AUDIO_REVIEWING;
		else if (this.currentPage == "expert-reviewing")
			progressStatus = BatchProgressStatus.AUDIO_EXPERT_REVIEWING;

		this.batchService.getUserBatchesByStatus(this.currentUser.userId, progressStatus);
	}

}
