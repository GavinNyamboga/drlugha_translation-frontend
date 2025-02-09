import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AudioAssignmentModerate} from "../../../../@core/models/audio/audio-assignment-moderate";
import {AuthService} from "../../../../@core/services/auth/auth.service";
import {RecordingsService} from "../../../../@core/services/recordings.service";
import {
	AssignmentsProgressConfigService
} from "../../../../@core/services/assignments/assignments-progress-config.service";
import {BatchProgressStatus} from "../../../../@core/enums/batch-progress-status";

@Component({
	selector: "app-voice-moderate",
	templateUrl: "./expert-review.component.html",
	styleUrls: ["./expert-review.component.scss"],
})
export class ExpertReviewComponent implements OnInit {
	batchDetailsId: number;
	currentUser: any;
	currentAssignment: any;
	currentIndex = 0;
	audioAssignment: AudioAssignmentModerate;

	constructor(
		private routes: Router,
		private activatedRoute: ActivatedRoute,
		private authService: AuthService,
		private voiceService: RecordingsService,
		private toastr: ToastrService,
		private assignmentsConfig: AssignmentsProgressConfigService
	) {
		this.assignmentsConfig.defaultUrl = "/main/oral-expert-review/reviewing";
		this.assignmentsConfig.batchProgress = BatchProgressStatus.audioReviewing;
		this.assignmentsConfig.badgeLabels = BatchProgressStatus.audioReviewing;
	}

	ngOnInit(): void {
		this.currentUser = this.authService.getCurrentUser();
		this.activatedRoute.queryParams.subscribe((params) => {
			this.batchDetailsId = params["batchDetailsId"];
			this.fetchReviewersAssignments();
		});
	}

	fetchReviewersAssignments() {
		this.voiceService.fetchReviewersPendingAudios(this.currentUser, this.batchDetailsId).subscribe({
			next: (response) => {
				this.audioAssignment = response;
				this.currentAssignment = this.audioAssignment[this.currentIndex];
			},
			error: (error) => {
				this.toastr.error("Failed to fetch assignments");
			},
		});
	}


	back() {
		this.routes.navigate(["/user"]);
	}
}
