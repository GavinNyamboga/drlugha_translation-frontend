import { Component, OnInit } from "@angular/core";
import {Input } from "@angular/core";
import * as RecordRTC from "recordrtc";
import { DomSanitizer } from "@angular/platform-browser";
import {RecordingsService} from "../../services/recordings.service";

@Component({
	selector: "app-record",
	templateUrl: "./record.component.html",
	styleUrls: ["./record.component.scss"]
})
export class RecordComponent implements OnInit {


  @Input() id: any;
  //le me initiate Record OBJ
  public record: any;
  //Will use this flag for detect recording
  public recording = false;
  //Url of Blob
  public url: any;
  public url1: any;
  public error: any;

  // public audios: Audio[] = [];

  constructor(
    private domSanitizer: DomSanitizer,
    private recordingService: RecordingsService
  ) {}

  ngOnInit(): void {
  	// this.getAudios();
  }

  // public getAudios(): void {
  //   this.recordingsservice.uploadVoiceRecord(translatedSentenceId , payload).subscribe(
  //     (response: Audio[]) => {
  //       this.audios = response;
  //     },
  //     (error: HttpErrorResponse) => {
  //       alert(error.message);
  //     }
  //   );
  // }


  sanitize(url: string) {
  	return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  
  // Start recording.
   
  initiateRecording() {
  	this.recording = true;
  	const mediaConstraints = {
  		video: false,
  		audio: true,
  	};
  	navigator.mediaDevices
  		.getUserMedia(mediaConstraints)
  		.then(this.successCallback.bind(this), this.errorCallback.bind(this));
  }
  
  // Will be called automatically.
  
  successCallback(stream: any) {
  	const options = {
  		mimeType: "audio/wav",
  		numberOfAudioChannels: 1,
  	};
  	//Start Actuall Recording
  	const StereoAudioRecorder = RecordRTC.StereoAudioRecorder;
  	this.record = new StereoAudioRecorder(stream, options);
  	this.record.record();
  }
  // Stop recording.
   
  stopRecording() {
  	this.recording = false;
  	this.record.stop(this.processRecording.bind(this));
  }
  /**
   * processRecording Do what ever you want with blob
   * @param  {any} blob Blog
   */
  processRecording(blob: any) {
  	this.url = URL.createObjectURL(blob);
  	console.log(blob);
  	console.log(this.url);

  	this.recordingService.sendAudioFile(blob, this.id);
  }
  /**
   * Process Error.
   */
  errorCallback(error: any) {
  	this.error = "Can not play audio in your browser";
  }

  clearUrl() {
  	this.url = "";
  }

}

