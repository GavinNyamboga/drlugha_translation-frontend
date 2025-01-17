import {Component, Input, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {AbstractControl, FormBuilder, FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {ReviewedSentence} from "../../../../../@core/models/sentence/reviewed-sentence";
import {BatchProgressStatus} from "../../../../../@core/enums/batch-progress-status";
import {AssignmentsService} from "../../../../../@core/services/assignments.service";
import {TranslationService} from "../../../../../@core/services/translation/translation.service";
import {AuthService} from "../../../../../@core/services/auth/auth.service";
import {BatchService} from "../../../../../@core/services/batch/batch.service";
import {BatchType} from "../../../../../@core/enums/batch-type";

@Component({
	selector: "app-sentences-to-moderate",
	templateUrl: "./sentences-to-moderate.component.html",
	styleUrls: ["./sentences-to-moderate.component.scss"]
})
export class SentencesToModerateComponent implements OnInit, OnChanges {
	@Input() unreviewedSentences: ReviewedSentence[] = [];
	@Input() language: string;
	@Input() batchDetailsId: number;
	@Input() batchType: BatchType;
	@Input() currentRouteDetails: {
		assignmentUrl: string;
		approveTranslationUrl: string;
		rejectTranslationUrl: string;
		markAsReviewedUrl: string;
		task: BatchProgressStatus;
	};

	originalLanguage = "English";
	approveForm: UntypedFormGroup;
	rejectForm: UntypedFormGroup;

	currentAssignment: ReviewedSentence;
	currentIndex = 0;
	commentFormGroup: FormGroup;
	rejectTranslationActive: boolean;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private formbuilder: UntypedFormBuilder,
		private assignmentservice: AssignmentsService,
		private translationservice: TranslationService,
		private authService: AuthService,
		private toastr: ToastrService,
		private batchService: BatchService,
		private fb: FormBuilder
	) {
		this.approveForm = this.formbuilder.group({
			reviewStatus:["approved"],
		});

		this.rejectForm = this.formbuilder.group({
			reviewStatus:["rejected"],
		});

		this.initiateCommentForm();
	}

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.unreviewedSentences?.currentValue) {
			this.unreviewedSentences = changes.unreviewedSentences.currentValue;
			this.currentAssignment = this.unreviewedSentences[0];
			this.updateCommentFormValues();
		}
	}

	initiateCommentForm() {
		this.commentFormGroup = this.fb.group({
			translatedSentenceId: [],
			comment: ["", Validators.required],
		});
	}

	updateCommentFormValues() {
		this.commentFormGroup.markAsUntouched();
		this.commentFormGroup.patchValue({
			translatedSentenceId: this.currentAssignment?.translatedSentenceId,
			comment: ""
		});
	}

	get f(): { [key: string]: AbstractControl } {
		return this.commentFormGroup.controls;
	}
	updateRejectTranslationActiveValue() {
		this.rejectTranslationActive = !this.rejectTranslationActive;
	}

	verifyFunction(translatedSentenceId: number) {
		this.translationservice.approveTranslation(translatedSentenceId, this.currentRouteDetails.approveTranslationUrl).subscribe({
			next: () => {
				this.nextAssignment();
			},
			error: (error) => {
				this.toastr.error(error.message);
			},
		});

	}

	rejectFunction() {
		this.commentFormGroup.markAllAsTouched();

		if (this.commentFormGroup.invalid) {
			return;
		}

		this.translationservice.rejectTranslation(this.currentRouteDetails.rejectTranslationUrl, this.commentFormGroup.value).subscribe({
			next: () => {
				this.nextAssignment();
			},
			error: (error) => {
				this.toastr.error(error.message);
			},
		});

	}

	private nextAssignment() {
		if (this.currentIndex == this.unreviewedSentences.length - 1) {
			this.markTranslationBatchAsVerified();
		} else {
			this.currentIndex++;
			this.currentAssignment = this.unreviewedSentences[this.currentIndex];
			this.rejectTranslationActive = false;
			this.updateCommentFormValues();
		}
	}

	markTranslationBatchAsVerified() {
		this.batchService.markTranslationBatchAsVerified(this.batchDetailsId, this.currentRouteDetails.markAsReviewedUrl).subscribe({
			next: () => {
				this.navigateToBatchDetails();
				this.toastr.success("You have completed all the text verification assignments");
			},
			error: (error) => {
				this.navigateToBatchDetails();
				this.toastr.error("Error while marking the batch as verified");
			}
		});
	}

	private navigateToBatchDetails() {
		const currentBatchDetailsId = this.activatedRoute.snapshot.queryParams.batchDetailsId;

		if (currentBatchDetailsId && currentBatchDetailsId == this.batchDetailsId) {
			window.location.reload();
		} else {
			this.router.navigate([], {
				relativeTo: this.activatedRoute,
				queryParams: {
					batchDetailsId: this.batchDetailsId,
				},
				queryParamsHandling: "merge",
			});
		}
	}

	protected readonly BatchType = BatchType;
}
