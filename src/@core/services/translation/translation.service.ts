import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import {environment} from "../../../environments/environment";
import {ModerationAssignment} from "../../models/moderation/moderation-assignment";
import {AudioAssignmentRecord} from "../../models/audio/audio-assignment-record";

@Injectable({
	providedIn: "root"
})
export class TranslationService {

	constructor(private _http: HttpClient) {}

	//Fetch all translated sentences
	getAllTranslatedSentences(): Observable<any> {
		return this._http.get(environment.apiUrl + "fetch/translatedsentence");
	}

	//Translated sentences
	translateSentence(assignmentId: number, translatedText: any): Observable<any> {
		return this._http.post(environment.apiUrl + "translate/sentence/" + assignmentId, translatedText);
	}

	rejectTranslation(rejectUrl: string, comment): Observable<any> {
		return this._http.put(environment.apiUrl + rejectUrl, comment);
	}

	approveTranslation(assignmentId: number, approveUrl: string): Observable<any> {
		return this._http.put(environment.apiUrl + approveUrl + assignmentId, {});
	}

	//Get sentence by Id
	getTranslatedSentenceById(sentenceId: number): Observable<any> {
		return this._http.get(environment.apiUrl + "fetch/translatedsentence/" + sentenceId);
	}

	//Update translated sentence
	updateTranslatedSentence(translatedSentenceId: number,traslatedText: string): Observable<any> {
		return this._http.put(environment.apiUrl + "update/tranlated/" + translatedSentenceId, traslatedText);
	}
	//delete translated sentence
	deleteTranslatedSentence(sentenceId: number): Observable<any> {
		return this._http.delete(environment.apiUrl + "delete/translatedsentence/" + sentenceId);
	}
	//show all aproved sentences
	getApprovedTranslatedSentences(): Observable<any> {
		return this._http.get(environment.apiUrl + "approved/translatedsentence/");
	}
	//fetch reviewers pending work
	getTranslatedSentencesByModerator(assignmentUrl: string, userId: any, batchDetailsId: number): Observable<ModerationAssignment> {
		let params = "";
		if (batchDetailsId)  params = "&batchDetailsId=" + batchDetailsId;

		return this._http.get<ModerationAssignment>(environment.apiUrl + assignmentUrl + "/translatedsentence?userId=" + userId + params);
	}

	getRejectedTranslationsByUser( userId: number) {
		return this._http.get(environment.apiUrl + "rejected/translatedsentences?userId=" + userId);
	}

	getAudioAssignments(userId: any, batchDetailsId: number): Observable<AudioAssignmentRecord> {
		let params = "";
		if (batchDetailsId) params = "&batchDetailsId=" + batchDetailsId;

		return this._http.get<AudioAssignmentRecord>(environment.apiUrl + "recorder/tasks?recorderId=" + userId + params);
	}

	getExpertReviewAssignments(userId: any): Observable<any> {
		return this._http.get(environment.apiUrl + "second-reviewer/translatedsentence?userId=" + userId);
	}

	expertReviewTranslation(assignmentId: number, approve: boolean): Observable<any> {
		const url = approve ? "translatedsentence/expert-approve" : "translatedsentence/expert-reject";

		return this._http.put(environment.apiUrl + url + assignmentId, {});
	}
}
