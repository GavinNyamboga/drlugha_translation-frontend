import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModerationAssignment } from "@core/models/moderation/moderation-assignment";
import { BatchProgressStatus } from "../../../../@core/enums/batch-progress-status";
import { BatchService } from "../../../../@core/services/batch/batch.service";
import { AuthService } from "../../../../@core/services/auth/auth.service";
import { TranslationService } from "../../../../@core/services/translation/translation.service";
import { BatchDetailAssignments } from "../../../../@core/models/batch/batch-detail-assignments";
import { ModerateProgressConfigComponent } from "./components/moderate-progress-config/moderate-progress-config.component";

@Component({
	selector: "app-moderate",
	templateUrl: "./moderate.component.html",
	styleUrls: ["./moderate.component.scss"],
	host: { class: "translate-application" }
})
export class ModerateComponent extends ModerateProgressConfigComponent implements OnInit {
	moderationAssignment: ModerationAssignment;
	currentUser: any;
	batchDetailAssignments: BatchDetailAssignments;
	batchDetailsId: number;

	currentRouteDetails: {
		assignmentUrl: string;
		approveTranslationUrl: string;
		rejectTranslationUrl: string;
		markAsReviewedUrl: string;
		task: BatchProgressStatus;
	};

	constructor(
		private router: Router,
		protected activatedRoute: ActivatedRoute,
		private batchService: BatchService,
		private authService: AuthService,
		private translationservice: TranslationService) {
		super(activatedRoute);
		if (this.activatedRoute.snapshot.data["page"] === "moderate") {
			this.currentRouteDetails = {
				assignmentUrl: "reviewer",
				approveTranslationUrl: "approve/translatedsentence/",
				rejectTranslationUrl: "reject/translatedsentence",
				markAsReviewedUrl: "textVerified",
				task: BatchProgressStatus.EXPERT_REVIEW
			};
		} else {
			this.currentRouteDetails = {
				assignmentUrl: "second-reviewer",
				approveTranslationUrl: "translatedsentence/expert-approve/",
				rejectTranslationUrl: "translatedsentence/expert-reject",
				markAsReviewedUrl: "secondVerification",
				task: BatchProgressStatus.EXPERT_REVIEW
			};
		}
	}

	ngOnInit() {
		this.currentUser = this.authService.getCurrentUser();

		this.activatedRoute.queryParams.subscribe((params) => {
			this.batchDetailsId = params["batchDetailsId"];
			this.fetchUserAssignment();
		});

		this.getUserBatches();

		this.batchService.batchDetails.subscribe((batchDetails) => {
			this.batchDetailAssignments = batchDetails;
		});
	}

	fetchUserAssignment() {
		this.translationservice.getTranslatedSentencesByModerator(this.currentRouteDetails.assignmentUrl, this.currentUser, this.batchDetailsId).subscribe({
			next: (response) => {
				this.moderationAssignment = response;
			},
			error: (error) => {
			}
		});
	}

	back() {
		this.router.navigate(["/user"]);
	}

	getUserBatches() {
		this.batchService.getUserBatchesByStatus(this.currentUser, this.currentRouteDetails.task);
	}

	get showModerationView() {
		return this.moderationAssignment?.unreviewedSentences?.length || !this.moderationAssignment?.reviewedSentences?.length;
	}

}
