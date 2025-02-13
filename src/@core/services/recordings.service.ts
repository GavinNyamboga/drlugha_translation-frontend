import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AudioAssignmentModerate } from "../models/audio/audio-assignment-moderate";
import { environment } from "../../environments/environment";

@Injectable({
	providedIn: "root"
})
export class RecordingsService {

	constructor(private _http: HttpClient) { }

	//Fetch all voice recordings
	fetchRecordings(): Observable<any> {
		return this._http.get(environment.apiUrl + "all/voice");
	}

	//Fetch reviewers pending audios
	fetchReviewersPendingAudios(userId: number, batchDetailsId: number): Observable<AudioAssignmentModerate> {
		let params = "";
		if (batchDetailsId) params = "&batchDetailsId=" + batchDetailsId;

		return this._http.get<AudioAssignmentModerate>(environment.apiUrl + "reviewer/audio?userId=" + userId + params);
	}

	fetchExpertReviewersPendingAudios(userId: number, batchDetailsId: number): Observable<AudioAssignmentModerate> {
		let params = "";
		if (batchDetailsId)
			params = "&batchDetailsId=" + batchDetailsId;

		return this._http.get<AudioAssignmentModerate>(environment.apiUrl + "voices/expert/audio?userId=" + userId + params);
	}

	approveVoiceRecording(voiceId: number, payload: any): Observable<any> {
		return this._http.put(environment.apiUrl + "approve/voice/" + voiceId, payload);
	}

	rejectVoiceRecording(voiceId: number, payload: any, rejectionReason: string): Observable<any> {
		let params = "";
		if (rejectionReason)
			params = "?rejectionReason=" + rejectionReason;

		return this._http.put(environment.apiUrl + "reject/voice/" + voiceId + params, payload);
	}

	expertReviewVoiceRecording(voiceId: number, payload: any, rejectionReason: string, approve: boolean): Observable<any> {
		let params = "?approve=" + approve;
		if (rejectionReason)
			params += "&rejectionReason=" + rejectionReason;

		return this._http.put(environment.apiUrl + "voice/expert/review/" + voiceId + params, payload);
	}

	//listen to a voice recordings  
	listenToVoice(voiceId: number): Observable<any> {
		return this._http.get(environment.apiUrl + "fetch/voice/" + voiceId);
	}
	//Delete a voice recording
	deleteVoiceRecord(voiceId: number): Observable<any> {
		return this._http.delete(environment.apiUrl + "delete/voicerecord/" + voiceId);
	}

	//Update voice recording status
	updateVoiceRecord(voiceId: number, payload: any): Observable<any> {
		return this._http.put(environment.apiUrl + "voice/updateVoiceRecord/" + voiceId, payload);
	}

	public sendAudioFile = (file: string | Blob, id: number) => {
		const formData = new FormData();
		formData.append("file", file);

		return this._http.post(`${environment.apiUrl}storage/uploadFile/${id}`, formData);
	};

	public updateAudioFile(file: string | Blob, id: number) {
		const formData = new FormData();
		formData.append("file", file);

		const headers = new HttpHeaders({
			enctype: "multipart/form-data",
			responseType: "application/json",
		});

		return this._http.put(`${environment.apiUrl}storage/updateFile/${id}`, formData, { headers: headers });
	}

	//Upload voice recording
	uploadVoiceRecord(translatedSentenceId: number, payload: any): Observable<any> {
		return this._http.put(environment.apiUrl + "record/voice/" + translatedSentenceId, payload);
	}

	//Fetch approved recordings
	fetchApprovedRecording(voiceId): Observable<any> {
		return this._http.get(environment.apiUrl + "fetchApprovedRecording/" + voiceId);
	}

}
