import { Component, Input, OnInit } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { DomSanitizer } from "@angular/platform-browser";
import { ToastrService } from "ngx-toastr";
import { RecordedSentence } from "../../../../../@core/models/audio/recorded-sentence";
import { RecordingsService } from "../../../../../@core/services/recordings.service";

@Component({
	selector: "app-batch-voice-translations",
	templateUrl: "./batch-voice-translations.component.html",
	styleUrls: ["./batch-voice-translations.component.scss"]
})
export class BatchVoiceTranslationsComponent implements OnInit {
	@Input() recordedSentences: RecordedSentence[] = [];
	selectedSentence: RecordedSentence;
	selectedVoiceId: number;
	uploadingAudio = false;

	constructor(
		private recordingService: RecordingsService,
		private modalService: NgbModal,
		private domSanitizer: DomSanitizer,
		private toastr: ToastrService) { }

	ngOnInit(): void {
	}


	openAudioRecordingModal(content, sentence: RecordedSentence, voiceId: number) {
		this.selectedSentence = sentence;
		this.selectedVoiceId = voiceId;
		const modalRef = this.modalService.open(content, { centered: true, backdrop: true, size: "lg" });
		modalRef.result.then(() => {
			this.closeModal();
		});
	}

	closeModal() {
		this.modalService.dismissAll();
	}
	saveAudioRecording(blob: Blob) {
		this.uploadingAudio = true;
		this.recordingService.updateAudioFile(blob, this.selectedVoiceId).subscribe({
			next: (res: any) => {
				this.toastr.success("Audio saved successfully");
				this.selectedSentence.audioLink = res?.message;
				this.selectedSentence.accepted = null;
				this.uploadingAudio = false;
				const audioElement = document.getElementById(`${this.selectedVoiceId}`) as HTMLAudioElement;
				if (audioElement) {
					const srcElement = audioElement.querySelector('source');
					if (srcElement) {
						srcElement.src = this.selectedSentence.audioLink;
					}
					audioElement.src = this.selectedSentence.audioLink;
					audioElement.load();
				}

				this.modalService.dismissAll();
			},
			error: (error) => {
				this.uploadingAudio = false;
				this.toastr.error("Error while updating audio file");
			}
		});
	}
}
