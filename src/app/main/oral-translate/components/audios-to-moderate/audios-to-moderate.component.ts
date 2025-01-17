import {Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {RecordedSentence} from "../../../../../@core/models/audio/recorded-sentence";
import {RecordingsService} from "../../../../../@core/services/recordings.service";
import {BatchService} from "../../../../../@core/services/batch/batch.service";

@Component({
	selector: "app-audios-to-moderate",
	templateUrl: "./audios-to-moderate.component.html",
	styleUrls: ["./audios-to-moderate.component.scss"]
})
export class AudiosToModerateComponent implements OnInit, OnChanges {
	@Input() sentencesToModerate: RecordedSentence[] = [];
	@Input() language: string;
	@Input() batchDetailsId: number;

	@ViewChild("audio") audio: ElementRef;

	currentAssignment: RecordedSentence;
	currentIndex = 0;
	constructor(
		private recordingService: RecordingsService,
		private batchService: BatchService,
		private toastr: ToastrService,
		private router: Router,
		private activatedRoute: ActivatedRoute) { }

	ngOnInit(): void {
	}

	ngOnChanges(changes:SimpleChanges): void {
		if (changes.sentencesToModerate) {
			this.sentencesToModerate = changes.sentencesToModerate.currentValue || [];
			this.currentIndex = 0;
			this.currentAssignment = this.sentencesToModerate[0];
		}
	}

	approveVoice(voiceId: number) {
		this.recordingService.approveVoiceRecording(voiceId, true).subscribe({
			next: () => {
				this.nextAssignment();
			},
			error: () => {
				this.toastr.error("Failed to approve voice");
			},
		});
	}

	rejectVoice(voiceId: number) {
		this.recordingService.rejectVoiceRecording(voiceId, true).subscribe({
			next: () => {
				this.nextAssignment();
			},
			error: () => {
				this.toastr.error("Failed to reject voice");
			},
		});
	}

	nextAssignment() {
		if (this.currentIndex == this.sentencesToModerate.length - 1) {
			this.markAudioAsReviewed();
		} else {
			this.currentIndex++;
			this.currentAssignment = this.sentencesToModerate[this.currentIndex];
			this.audio.nativeElement.load();
		}
	}

	markAudioAsReviewed() {
		this.batchService.markAudioAsReviewed(this.batchDetailsId).subscribe({
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
