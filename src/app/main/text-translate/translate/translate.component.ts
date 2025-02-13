import {Component, OnInit} from "@angular/core";
import {BatchDetails} from "../../../../@core/models/batch/batch-details";
import {Assignments} from "../../../../@core/models/translation/assignments";
import {ActivatedRoute, Router} from "@angular/router";
import {AuthService} from "../../../../@core/services/auth/auth.service";
import {ToastrService} from "ngx-toastr";
import {BatchService} from "../../../../@core/services/batch/batch.service";
import {AssignmentsService} from "../../../../@core/services/assignments.service";
import {SentenceService} from "../../../../@core/services/sentence.service";
import {forkJoin} from "rxjs";
import {BatchProgressStatus} from "../../../../@core/enums/batch-progress-status";
import {BatchDetailAssignments} from "../../../../@core/models/batch/batch-detail-assignments";
import {TranslateProgressConfigComponent} from "./components/translate-progress-config/translate-progress-config";
import {BatchType} from "../../../../@core/enums/batch-type";
import {TranslatedSentence} from "../../../../@core/models/translation/translated-sentence";

@Component({
	selector: "app-translate",
	templateUrl: "./translate.component.html",
	styleUrls: ["./translate.component.scss"]
})
export class TranslateComponent extends TranslateProgressConfigComponent implements OnInit {
	currentUser: any;
	batchDetailAssignments: BatchDetailAssignments;
	selectedBatchDetails: BatchDetails;
	batchDetailsId: number;
	translationAssignment: Assignments;
	showSidebar = false;
	title: string;

	constructor(
		private router: Router,
		private authService: AuthService,
		private toastService: ToastrService,
		private batchService: BatchService,
		private activatedRoute: ActivatedRoute,
		private assignmentsService: AssignmentsService,
		private sentenceService: SentenceService
	)  {
		super();
	}

	back() {
		this.router.navigate(["/user"]);
	}


	ngOnInit(): void {
		this.currentUser = this.authService.getCurrentUser();

		this.activatedRoute.queryParams.subscribe((params) => {
			this.batchDetailsId = params["batchDetailsId"];
			this.setSelectedBatchDetails();
			this.getUserAssignmentsAndTranslatedTexts();
		});

		this.getUserBatches();

		this.batchService.batchDetails.subscribe((batchDetails) => {
			this.batchDetailAssignments = batchDetails;
			this.setSelectedBatchDetails();
		});
	}

	setSelectedBatchDetails() {
		const transcriptionAssignments = this.batchDetailAssignments?.transcriptionAssignments || [];
		const translationAssignments = this.batchDetailAssignments?.translationAssignments || [];

		const batchDetails = [...transcriptionAssignments, ...translationAssignments];
		this.selectedBatchDetails = batchDetails.find((batchDetail) => batchDetail.batchDetailsId == this.batchDetailsId);
	}

	getUserAssignmentsAndTranslatedTexts() {
		let endpoints: any[];
		if (this.batchDetailsId) {
			endpoints = [this.getUserAssignments(), this.getTranslatedTextsPerBatchDetailsId()];
		}else {
			endpoints = [this.getUserAssignments()];
		}

		forkJoin(...endpoints).subscribe(
			([translationAssignment, translatedSentences]) => {
				this.translationAssignment = translationAssignment;
				const unsortedTranslatedSentences: TranslatedSentence[] = translatedSentences || [];
				// Sort by boolean value of accepted, starting with false
				this.translationAssignment.translatedSentences = unsortedTranslatedSentences.sort((a, b) => {
					return a.approved === b.approved ? 0 : a.approved ? 1 : -1;
				});

				this.translationAssignment.translatedSentences = translatedSentences || [];
				this.batchDetailsId = this.translationAssignment.batchDetailsId;
				this.setPageTitle();
			},
			(error) => {
				console.log(error);
			}
		);
	}

	getUserAssignments() {
		return this.assignmentsService.fetchUserAssignment(this.currentUser, this.batchDetailsId);
	}

	getTranslatedTextsPerBatchDetailsId() {
		return this.sentenceService.translatedSentencesPerBatchDetail(this.batchDetailsId);
	}

	getUserBatches() {
		this.batchService.getUserBatchesByStatus(this.currentUser, BatchProgressStatus.TRANSLATION);
	}

	setPageTitle() {
		if (this.translationAssignment.batchType == BatchType.AUDIO && this.showTranslationView)
			this.title = "Audio Transcription";
		else if (this.translationAssignment.batchType == BatchType.TEXT && !this.showTranslationView)
			this.title = "Translated Sentences";
		else
			this.title = "Text Translation";
	}

	showSpecificBatchDetail(batchDetailsId: number) {
		this.router.navigate([], {
			relativeTo: this.activatedRoute.parent,
			queryParams: {
				batchDetailsId: batchDetailsId
			},
			queryParamsHandling: "merge"
		});
	}

	get showTranslationView() {
		return this.translationAssignment?.pendingTasks?.length > 0 || this.translationAssignment?.translatedSentences?.length == 0;
	}

	markAsTranslated() {
		if (this.selectedBatchDetails) {
			this.selectedBatchDetails.translated = true;
		}
	}

	toggleSidebar() {
		this.showSidebar = !this.showSidebar;
	}
}
