import { Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { RecordedSentence } from "../../../../../@core/models/audio/recorded-sentence";
import { RecordingsService } from "../../../../../@core/services/recordings.service";
import { BatchService } from "../../../../../@core/services/batch/batch.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BatchProgressStatus } from "@core/enums/batch-progress-status";

@Component({
	selector: "app-audios-to-moderate",
	templateUrl: "./audios-to-moderate.component.html",
	styleUrls: ["./audios-to-moderate.component.scss"]
})
export class AudiosToModerateComponent implements OnInit, OnChanges {
	@Input() sentencesToModerate: RecordedSentence[] = [];
	@Input() language: string;
	@Input() batchDetailsId: number;
	@Input() batchProgressStatus: BatchProgressStatus;

	//@ViewChild("audio") audio: ElementRef;
	@ViewChildren("audioControl") audioElements: QueryList<ElementRef>;


	currentAssignment: RecordedSentence;
	currentIndex = 0;
	selectedActions: { [voiceId: number]: boolean } = {};
	rejectAudioActive: boolean;
	commentFormGroup: FormGroup;

	constructor(
		private recordingService: RecordingsService,
		private batchService: BatchService,
		private toastr: ToastrService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private fb: FormBuilder) { }

	ngOnInit(): void {
		this.commentFormGroup = this.fb.group({
			comment: ['', Validators.required]
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.sentencesToModerate) {
			this.sentencesToModerate = changes.sentencesToModerate.currentValue || [];
			this.currentIndex = 0;
			this.currentAssignment = this.sentencesToModerate[0];
		}
	}

	approveVoice(voiceId: number) {

		if (this.batchProgressStatus && this.batchProgressStatus == BatchProgressStatus.AUDIO_EXPERT_REVIEWING) {
			this.recordingService.expertReviewVoiceRecording(voiceId, true, null, true).subscribe({
				next: () => {
					this.selectedActions[voiceId] = true;
					this.checkActionsCompleted();
				},
				error: () => {
					this.toastr.error("Failed to approve voice");
				},
			});		
		} else if (this.batchProgressStatus && this.batchProgressStatus == BatchProgressStatus.AUDIO_REVIEWING) {
			this.recordingService.approveVoiceRecording(voiceId, true).subscribe({
				next: () => {
					this.selectedActions[voiceId] = true;
					this.checkActionsCompleted();
				},
				error: () => {
					this.toastr.error("Failed to approve voice");
				},
			});		
		}
	}

	rejectFunction(voiceId: number) {
		this.commentFormGroup.markAllAsTouched();

		if (this.commentFormGroup.invalid) {
			return;
		}

		const comment = this.commentFormGroup.get('comment').value;

		if (this.batchProgressStatus && this.batchProgressStatus == BatchProgressStatus.AUDIO_REVIEWING) {
			this.recordingService.rejectVoiceRecording(voiceId, true, comment).subscribe({
				next: () => {
					this.selectedActions[voiceId] = true;
					this.rejectAudioActive = false;
					this.commentFormGroup.reset(); // Reset the entire form
					this.commentFormGroup.get('comment').setValue(''); // Explicitly clear the comment field
					this.nextAssignment();
				},
				error: (error) => {
					this.toastr.error(error.message);
				},
			});
		}

		else if (this.batchProgressStatus && this.batchProgressStatus == BatchProgressStatus.AUDIO_EXPERT_REVIEWING) {
			this.recordingService.expertReviewVoiceRecording(voiceId, true, comment, false).subscribe({
				next: () => {
					this.selectedActions[voiceId] = true;
					this.rejectAudioActive = false;
					this.commentFormGroup.reset(); // Reset the entire form
					this.commentFormGroup.get('comment').setValue(''); // Explicitly clear the comment field
					this.nextAssignment();
				},
				error: (error) => {
					this.toastr.error(error.message);
				},
			});
		}

	}

	updateRejectAudioActiveValue() {
		this.rejectAudioActive = !this.rejectAudioActive;

		if (!this.rejectAudioActive) {
			this.commentFormGroup.reset();
			this.commentFormGroup.get('comment').setValue('');
		}
	}

	checkActionsCompleted() {
		const allActionsSelected = this.currentAssignment.audioList.every(audio =>
			this.selectedActions[audio.voiceId]
		);

		if (allActionsSelected) {
			console.log('Both actions selected for this set');
			this.nextAssignment();
		} else {
			console.log('Waiting for actions...');
		}
	}

	nextAssignment() {
		if (this.currentIndex == this.sentencesToModerate.length - 1) {
			this.markAudioAsReviewed();
		} else {
			this.currentIndex++;
			this.currentAssignment = this.sentencesToModerate[this.currentIndex];
			this.rejectAudioActive = false;
			this.loadAudioForCurrentAssignment();
		}
	}

	loadAudioForCurrentAssignment(): void {
		const audioControlElements = this.audioElements.toArray();
		audioControlElements.forEach(audioControl => {
			audioControl.nativeElement.load(); // Load each audio in the list
		});
	}

	markAudioAsReviewed() {
		let expertReview = false;
		if (this.batchProgressStatus == BatchProgressStatus.AUDIO_EXPERT_REVIEWING)
			expertReview = true;

		this.batchService.markAudioAsReviewed(this.batchDetailsId, expertReview).subscribe({
			next: () => {
				this.toastr.success("You have successfully reviewed all the audios in this batch");
			},
			error: () => {
				this.toastr.error("Failed to mark audio as reviewed");
			},
			complete: () => {
				this.navigateToBatchDetails();
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

}
