import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { StepperSelectionEvent } from "@angular/cdk/stepper";
import { User } from "../../../../../../@core/models/user.model";
import { BatchStatus } from "../../../../../../@core/enums/batch-status";
import { BatchService } from "../../../../../../@core/services/batch/batch.service";
import { CompletedSentence } from "../../../../../../@core/models/sentence/completed-sentence";
import { BatchType } from "../../../../../../@core/enums/batch-type";
import { UserBatchRole } from "@core/enums/bath-assigned-user-role";

@Component({
	selector: "app-assign-verifiers",
	templateUrl: "./assign-verifiers.component.html",
	styleUrls: ["./assign-verifiers.component.scss"]
})
export class AssignVerifiersComponent implements OnInit, OnChanges {
	@Input() users: User[] = [];
	@Input() batchId: number;
	@Input() batchDetail: any;
	@Input() batchType: BatchType;
	@Output() addBatchDetails: EventEmitter<any> = new EventEmitter<any>();

	batchStatus = BatchStatus;
	textVerifierForm: UntypedFormGroup;
	translatorForm: UntypedFormGroup;
	secondReviewerForm: UntypedFormGroup;
	recorderForm: UntypedFormGroup;
	audioVerifier: UntypedFormGroup;
	progress: number;
	completedSentences: CompletedSentence[] = [];
	assigneeTitle: string;

	constructor(
		private fb: UntypedFormBuilder,
		private batchService: BatchService,
		private toastService: ToastrService) {
		this.initiateForms();
	}

	ngOnInit(): void {
		this.batchType === BatchType.AUDIO ? this.assigneeTitle = "Transcriber" : this.assigneeTitle = "Translator";
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.batchDetail?.currentValue) {
			this.setFormDefaultValues();
			this.progress = this.getStepProgress;
		}
	}

	private initiateForms(): void {
		this.textVerifierForm = this.fb.group({
			textVerifier: ["", Validators.required]
		});

		this.translatorForm = this.fb.group({
			translator: ["", Validators.required]
		});

		this.secondReviewerForm = this.fb.group({
			secondReviewer: ["", Validators.required]
		});

		this.recorderForm = this.fb.group({
			recorders: [
				[],
				[
					Validators.required,
					Validators.minLength(1)
				]
			]
		});

		this.audioVerifier = this.fb.group({
			audioVerifier: ["", Validators.required]
		});
	}

	private setFormDefaultValues(): void {
		this.textVerifierForm.patchValue({
			textVerifier: this.batchDetail?.translationVerifiedBy?.userId
		});

		this.translatorForm.patchValue({
			translator: this.batchDetail?.translatedBy?.userId
		});

		this.secondReviewerForm.patchValue({
			secondReviewer: this.batchDetail?.secondReviewer?.userId
		});

		this.recorderForm.patchValue({
			recorders: this.batchDetail?.recordedBy?.map((recorder: any) => recorder.userId) || []
		});

		this.audioVerifier.patchValue({
			audioVerifier: this.batchDetail?.audioVerifiedBy?.userId
		});
	}

	private get getStepProgress(): number {
		switch (this.batchDetail?.batchStatus) {
			case this.batchStatus.ASSIGNED_TRANSLATOR:
				return 1;
			case this.batchStatus.TRANSLATED:
				return 2;
			case this.batchStatus.ASSIGNED_TEXT_VERIFIER:
				return 3;
			case this.batchStatus.TRANSLATION_VERIFIED:
				return 4;
			case this.batchStatus.ASSIGNED_EXPERT_REVIEWER:
				return 5;
			case this.batchStatus.SECOND_VERIFICATION_DONE:
				return 6;
			case this.batchStatus.ASSIGNED_RECORDER:
				return 7;
			case this.batchStatus.RECORDED:
				return 8;
			case this.batchStatus.ASSIGNED_AUDIO_VERIFIER:
				return 9;
			case this.batchStatus.AUDIO_VERIFIED:
				return 10;
			default:
				return 11;
		}
	}

	assignTextVerifier(): void {
		this.textVerifierForm.markAllAsTouched();
		if (this.textVerifierForm.invalid) {
			return;
		}

		const textVerifier = parseInt(this.textVerifierForm.value.textVerifier, 10);
		const payload = {
			userIds: [textVerifier]
		};

		this.batchService.assignUsersToBatch(this.batchDetail.batchDetailsId, payload, UserBatchRole.TEXT_VERIFIER).subscribe(
			(res) => {
				this.addBatchDetails.emit(res);
				this.toastService.success("Text verifier added successfully");
			},
			(error) => {
				console.error(error);
				this.toastService.error("Something went wrong. Please try again later");
			}
		);
	}

	assignSecondReviewer(): void {
		this.secondReviewerForm.markAllAsTouched();
		if (this.secondReviewerForm.invalid) {
			return;
		}

		const { secondReviewer } = this.secondReviewerForm.value;
		const payload = {
			userIds: [secondReviewer]
		};

		this.batchService.assignUsersToBatch(this.batchDetail.batchDetailsId, payload, UserBatchRole.EXPERT_TEXT_REVIEWER).subscribe(
			(res) => {
				this.addBatchDetails.emit(res);
				this.toastService.success("Second reviewer added successfully");
			},
			(error) => {
				console.log(error);
				this.toastService.error("Something went wrong. Please try again later");
			}
		);
	}

	assignRecorders(): void {
		// Mark all form controls as touched to trigger validation
		this.recorderForm.markAllAsTouched();

		// Check if the form is valid
		if (this.recorderForm.invalid) {
			return;
		}

		// Get selected recorder IDs
		const recorderIds = this.recorderForm.value.recorders;

		// Prepare the payload for multiple recorders
		const payload = {
			userIds: recorderIds
		};

		// Call service method to assign multiple recorders
		this.batchService.assignUsersToBatch(this.batchDetail.batchDetailsId, payload, UserBatchRole.AUDIO_RECORDER).subscribe(
			(res) => {
				this.addBatchDetails.emit(res);
				this.toastService.success("Recorders added successfully");
			},
			(error) => {
				console.error(error);
				this.toastService.error("Something went wrong. Please try again later");
			}
		);
	}

	assignAudioVerifier(): void {
		this.audioVerifier.markAllAsTouched();
		if (this.audioVerifier.invalid) {
			return;
		}

		const { audioVerifier } = this.audioVerifier.value;
		const payload = {
			userIds: [audioVerifier]
		};

		this.batchService.assignUsersToBatch(this.batchDetail.batchDetailsId, payload, UserBatchRole.AUDIO_VERIFIER).subscribe(
			(res) => {
				this.addBatchDetails.emit(res);
				this.toastService.success("Audio verifier added successfully");
			},
			(error) => {
				console.log(error);
				this.toastService.error("Something went wrong. Please try again later");
			}
		);
	}

	tabSelectionChange(selectionEvent: StepperSelectionEvent) {
		if (selectionEvent.selectedIndex == 5) {
			// this.fetchCompletedSentences();
		}
	}

	fetchCompletedSentences() {
		this.batchService.getCompletedSentences(this.batchDetail.batchDetailsId).subscribe(
			(res) => {
				this.completedSentences = res.completedSentences;

				console.log(this.completedSentences);
			},
			(error) => {
				console.log(error);
				this.toastService.error("Something went wrong. Please try again later");
			}
		);
	}

	protected readonly BatchType = BatchType;
}
