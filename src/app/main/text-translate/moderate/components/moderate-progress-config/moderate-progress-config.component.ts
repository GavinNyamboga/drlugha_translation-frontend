import {Component, inject} from "@angular/core";

import {BatchProgressStatus} from "../../../../../../@core/enums/batch-progress-status";
import {ActivatedRoute} from "@angular/router";
import {
	AssignmentsProgressConfigService
} from "../../../../../../@core/services/assignments/assignments-progress-config.service";


@Component({
	template: ""
})
export class ModerateProgressConfigComponent {
	currentRouteDetails : {
		assignmentUrl: string;
		approveTranslationUrl: string;
		rejectTranslationUrl: string;
		markAsReviewedUrl: string;
		task: BatchProgressStatus;
	};

	private assignmentsConfig = inject(AssignmentsProgressConfigService);
	constructor(protected activatedRoute: ActivatedRoute) {
		if (this.activatedRoute.snapshot.data["page"] === "moderate") {
			this.currentRouteDetails = {
				assignmentUrl: "reviewer",
				approveTranslationUrl: "approve/translatedsentence/",
				rejectTranslationUrl: "reject/translatedsentence",
				markAsReviewedUrl: "textVerified",
				task: BatchProgressStatus.REVIEW
			};
		}else {
			this.currentRouteDetails = {
				assignmentUrl: "second-reviewer",
				approveTranslationUrl: "translatedsentence/expert-approve/",
				rejectTranslationUrl: "translatedsentence/expert-reject",
				markAsReviewedUrl: "secondVerification",
				task: BatchProgressStatus.EXPERT_REVIEW
			};
		}

		this.assignmentsConfig.defaultUrl = this.url;
		this.assignmentsConfig.batchProgress = this.currentRouteDetails.task;
		this.assignmentsConfig.badgeLabels = this.currentRouteDetails.task;
	}
	get url(): string {
		const activePage = this.currentRouteDetails.assignmentUrl == "reviewer" ? "moderate" : "expert-review";
		return "/main/text-translate/"+ activePage + "/sentences";
	}
}
