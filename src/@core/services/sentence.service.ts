import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {TranslatedSentence} from "../models/translation/translated-sentence";
import {environment} from "../../environments/environment";
import {CompletedSentence} from "../models/sentence/completed-sentence";

@Injectable({
	providedIn: "root"
})
export class SentenceService {

	constructor(private _http: HttpClient) { }

	public getTotalUploadedAndTranslatedSentences(): Observable<{totalSentences: number, totalTranslatedSentences: number}> {
		return this._http.get<{totalSentences: number, totalTranslatedSentences: number}>(`${environment.apiUrl}stats/totals`);
	}

	public getTotalSentences(): Observable<any> {
		return this._http.get(`${environment.apiUrl}all/sentence`);
	}

	translatedSentencesPerBatchDetail(batchDetailsId: number): Observable<TranslatedSentence[]> {
		return this._http.get<TranslatedSentence[]>(`${environment.apiUrl}translated-sentences?batchDetailsId=${batchDetailsId}`);
	}

	updateTranslatedSentence(translatedSentenceId: any, translatedText: any) {
		return this._http.put(`${environment.apiUrl}update/translatedsentence/${translatedSentenceId}`, {translatedText});
	}

	markAsTranslated(batchDetailId: number) {
		return this._http.put(`${environment.apiUrl}batch-status/translated/${batchDetailId}`, {});
	}

	getExpertReviewedSentencesPerLanguage(languageId: number) {
		return this._http.get<{language: string, expertReviewedSentences: CompletedSentence[]}>(`${environment.apiUrl}expert-reviewed-sentences?languageId=${languageId}`);
	}
}
