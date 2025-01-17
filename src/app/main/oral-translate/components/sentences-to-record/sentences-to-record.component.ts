import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {RecordedSentence} from "../../../../../@core/models/audio/recorded-sentence";
import {RecordingsService} from "../../../../../@core/services/recordings.service";
import {BatchService} from "../../../../../@core/services/batch/batch.service";
import {RecordAudioComponent} from "../../../components/record-audio/record-audio.component";
import {
	AssignmentsProgressConfigService
} from "../../../../../@core/services/assignments/assignments-progress-config.service";

@Component({
	selector: "app-sentences-to-record",
	templateUrl: "./sentences-to-record.component.html",
	styleUrls: ["./sentences-to-record.component.scss"]
})
export class SentencesToRecordComponent implements OnInit, OnChanges, OnDestroy {
	@Input() sentencesToRecord: RecordedSentence[] = [];
	@Input() batchDetailsId: number;
	@Input() language: string;

	@ViewChild("recordAudioComponent") recordAudioComponent: RecordAudioComponent;

	currentAssignment: RecordedSentence;
	currentIndex = 0;
	uploadingAudio = false;

	constructor(
		private domSanitizer: DomSanitizer,
		private recordingsService : RecordingsService,
		private batchService: BatchService,
		private toastr: ToastrService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private assignmentsConfig: AssignmentsProgressConfigService) { }

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.sentencesToRecord) {
			this.sentencesToRecord = changes.sentencesToRecord.currentValue || [];
			this.currentIndex = 0;
			this.currentAssignment = this.sentencesToRecord[this.currentIndex];

			if (this.sentencesToRecord.length > 0) {
				this.assignmentsConfig.showCount = true;
				this.assignmentsConfig.totalCount = this.sentencesToRecord.length;
				this.assignmentsConfig.currentIndex = 0;
			}
		}
	}

	ngOnDestroy() {
		this.assignmentsConfig.showCount = false;
	}

	nextAssignment() {

		if(this.currentIndex == this.sentencesToRecord.length - 1) {
			this.markAudioRecordingAsComplete();
		}else{

			this.currentIndex++;
			this.currentAssignment = this.sentencesToRecord[this.currentIndex];
		}

		this.assignmentsConfig.currentIndex = this.currentIndex;
	}

	markAudioRecordingAsComplete() {
		this.batchService.markAudioRecordingAsCompleted(this.batchDetailsId).subscribe({
			next: () => {
				this.toastr.success("You have completed all your assignments for today");
			},
			error: () => {
				this.toastr.error("Failed to mark audio recording as completed");
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

	saveAudioRecording(blob: any) {
		this.uploadingAudio = true;
		this.recordingsService.sendAudioFile(blob, this.currentAssignment.translatedSentenceId)
			.subscribe((res) => {
				this.uploadingAudio = false;
				this.toastr.success("Audio saved successfully");
				this.recordAudioComponent.clearRecording();
				this.nextAssignment();

			}, (err) => {
				this.uploadingAudio = false;
				this.toastr.error("Error while updating audio file. Please try again");
			});
	}

}
