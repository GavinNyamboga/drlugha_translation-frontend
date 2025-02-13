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
export class ExpertAudioReviewComponent implements OnInit {
	batchDetailsId: number;
	currentUser: any;
	currentAssignment: any;
	currentIndex = 0;
	audioAssignment: AudioAssignmentModerate;
	batchProgressStatus = BatchProgressStatus.AUDIO_EXPERT_REVIEWING;

	constructor(
		private routes: Router,
		private activatedRoute: ActivatedRoute,
		private authService: AuthService,
		private voiceService: RecordingsService,
		private toastr: ToastrService,
		private assignmentsConfig: AssignmentsProgressConfigService
	) {
		this.assignmentsConfig.defaultUrl = "/main/oral-expert-review/review/expert-reviewing";
		this.assignmentsConfig.batchProgress = this.batchProgressStatus;
		this.assignmentsConfig.badgeLabels = this.batchProgressStatus;
	}

	ngOnInit(): void {
		this.currentUser = this.authService.getCurrentUser();
		this.activatedRoute.queryParams.subscribe((params) => {
			this.batchDetailsId = params["batchDetailsId"];
			this.fetchExpertReviewersAssignments();
		});
	}

	fetchExpertReviewersAssignments() {
		this.voiceService.fetchExpertReviewersPendingAudios(this.currentUser, this.batchDetailsId).subscribe({
			next: (response) => {
				this.audioAssignment = response;
				this.currentAssignment = this.audioAssignment.unreviewedAudios[this.currentIndex];
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
