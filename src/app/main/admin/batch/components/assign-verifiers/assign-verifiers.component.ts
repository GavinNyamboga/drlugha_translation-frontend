import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {StepperSelectionEvent} from "@angular/cdk/stepper";
import {User} from "../../../../../../@core/models/user.model";
import {BatchStatus} from "../../../../../../@core/enums/batch-status";
import {BatchService} from "../../../../../../@core/services/batch/batch.service";
import {CompletedSentence} from "../../../../../../@core/models/sentence/completed-sentence";
import {BatchType} from "../../../../../../@core/enums/batch-type";

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
			recorder: ["", Validators.required]
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
			recorder: this.batchDetail?.recordedBy?.userId
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

		const  textVerifier = parseInt(this.textVerifierForm.value.textVerifier, 10);
		this.batchService.assignTextVerifier(this.batchDetail.batchDetailsId, {translationVerifiedById: textVerifier}).subscribe(
			(res) => {
				this.addBatchDetails.emit(res);
				this.toastService.success("Text verifier added successfully");
			},
			(error) => {
				console.log(error);
				this.toastService.error("Something went wrong. Please try again later");
			}
		);
	}

	assignSecondReviewer(): void {
		this.secondReviewerForm.markAllAsTouched();
		if (this.secondReviewerForm.invalid) {
			return;
		}

		const  {secondReviewer} = this.secondReviewerForm.value;
		this.batchService.assignSecondReviewer(this.batchDetail.batchDetailsId, {secondReviewerId: secondReviewer}).subscribe(
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

	assignRecorder(): void {
		this.recorderForm.markAllAsTouched();
		if (this.recorderForm.invalid) {
			return;
		}

		const  {recorder} = this.recorderForm.value;
		this.batchService.assignRecorder(this.batchDetail.batchDetailsId, {recordedById: recorder}).subscribe(
			(res) => {
				this.addBatchDetails.emit(res);
				this.toastService.success("Recorder added successfully");
			},
			(error) => {
				console.log(error);
				this.toastService.error("Something went wrong. Please try again later");
			}
		);
	}

	assignAudioVerifier(): void {
		this.audioVerifier.markAllAsTouched();
		if (this.audioVerifier.invalid) {
			return;
		}

		const  {audioVerifier} = this.audioVerifier.value;
		this.batchService.assignAudioVerifier(this.batchDetail.batchDetailsId, {audioVerifiedById: audioVerifier}).subscribe(
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
