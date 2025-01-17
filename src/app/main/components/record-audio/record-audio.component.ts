import {Component, EventEmitter, Input, NgZone, OnInit, Output} from "@angular/core";
import {IntervalTimer} from "../../../../@core/utils/interval-timer";
import {secondsToHms} from "../../../../@core/utils/seconds-to-time";
import {DomSanitizer} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";

@Component({
	selector: "app-record-audio",
	templateUrl: "./record-audio.component.html",
	styleUrls: ["./record-audio.component.scss"]
})
export class RecordAudioComponent implements OnInit {
	@Input() uploadingAudio: boolean;
	@Output() saveAudio: EventEmitter<Blob> = new EventEmitter<Blob>();
	elapsedSeconds = 0;
	elapsedTime = "00:00";
	audioRecorded = false;
	recordingStatus: "recording" | "paused" | "stopped" = "stopped";
	intervalTimer: IntervalTimer;
	mediaRecorder: MediaRecorder;
	audioUrl: any;
	audioBlob: Blob;

	constructor(
		private domSanitizer: DomSanitizer,
		private toastr: ToastrService,
		private ngZone: NgZone) { }

	ngOnInit(): void {
	}

	startAudioRecording() {
		this.recordingStatus = "recording";

		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => {
				this.mediaRecorder = new MediaRecorder(stream);
				this.startTimer();
				this.mediaRecorder.start();
				this.mediaRecorder.ondataavailable = (e) => this.ngZone.run(() => {
					this.showAudioRecorded(e.data);
				});
			}, (error) => {
				this.toastr.error("Error while recording audio");
				this.recordingStatus = "stopped";
				console.error(error);
			});
	}

	startTimer() {
		this.intervalTimer = new IntervalTimer(() => {
			this.elapsedSeconds++;
			this.elapsedTime = secondsToHms(this.elapsedSeconds);
		}, 1000);
		this.intervalTimer.start();
	}

	pauseTimer() {
		this.intervalTimer.pause();
	}

	resumeTimer() {
		this.intervalTimer.resume();
	}

	showAudioRecorded(audioData) {
		this.audioBlob = new Blob([audioData], { type: "audio/wav" });
		const audioUrl = URL.createObjectURL(this.audioBlob);
		this.audioUrl = this.sanitizedAudioUrl(audioUrl);
		this.audioRecorded = true;
	}

	sanitizedAudioUrl(audioUrl) {
		return this.domSanitizer.bypassSecurityTrustUrl(audioUrl);
	}

	pauseAudioRecording() {
		this.recordingStatus = "paused";
		this.pauseTimer();
		if (this.mediaRecorder) {
			this.mediaRecorder.pause();
		}
	}

	resumeAudioRecording() {
		this.recordingStatus = "recording";
		this.resumeTimer();
		if (this.mediaRecorder) {
			this.mediaRecorder.resume();
		}
	}

	stopAudioRecording() {
		this.recordingStatus = "stopped";
		this.pauseTimer();
		if (this.mediaRecorder) {
			this.mediaRecorder.stop();
		}
	}

	clearRecording() {
		this.audioRecorded = false;
		this.audioUrl = null;
		this.elapsedSeconds = 0;
		this.elapsedTime = "00:00";
		this.recordingStatus = "stopped";
		this.intervalTimer = null;
	}

	saveAudioRecording() {
		this.saveAudio.emit(this.audioBlob);
	}

	onFileSelected($event: Event) {
		const audioFile = ($event.target as HTMLInputElement).files[0];

		if (!audioFile.type.startsWith("audio/")) {
			this.toastr.error("Please select an audio file");
			return;
		}

		// get audio file duration
		const audio = new Audio(URL.createObjectURL(audioFile));
		audio.onloadedmetadata = () => {
			this.elapsedSeconds = Math.floor(audio.duration);
			this.elapsedTime = secondsToHms(this.elapsedSeconds);
		};

		this.showAudioRecorded(audioFile);
	}
}
