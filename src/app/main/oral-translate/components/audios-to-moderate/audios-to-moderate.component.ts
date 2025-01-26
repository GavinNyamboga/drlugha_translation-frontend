import {Component, ElementRef, Input, OnChanges, OnInit, QueryList, SimpleChanges, ViewChild, ViewChildren} from "@angular/core";
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

	//@ViewChild("audio") audio: ElementRef;
	@ViewChildren("audioControl") audioElements: QueryList<ElementRef>;


	currentAssignment: RecordedSentence;
	currentIndex = 0;
	selectedActions: { [voiceId: number]: boolean } = {}; 

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
				this.selectedActions[voiceId] = true; // Mark this audio as acted upon
        		this.checkActionsCompleted();
			},
			error: () => {
				this.toastr.error("Failed to approve voice");
			},
		});
	}

	rejectVoice(voiceId: number) {
		this.recordingService.rejectVoiceRecording(voiceId, true).subscribe({
			next: () => {
				this.selectedActions[voiceId] = true; // Mark this audio as acted upon
        		this.checkActionsCompleted();
			},
			error: () => {
				this.toastr.error("Failed to reject voice");
			},
		});
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
