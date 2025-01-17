import { Injectable } from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable} from "rxjs";
import {Batch} from "../../models/batch/batch";
import {environment} from "../../../environments/environment";
import {BatchProgressStatus} from "../../enums/batch-progress-status";
import {BatchDetailProgressReport} from "../../models/batch/batch-detail-progress-report";
import { map} from "rxjs/operators";
import {BatchDetailAssignments} from "../../models/batch/batch-detail-assignments";
import {BatchType} from "../../enums/batch-type";

@Injectable({
	providedIn: "root"
})
export class BatchService {
	private batchDetailAssignments$: BehaviorSubject<BatchDetailAssignments> = new BehaviorSubject<BatchDetailAssignments>(null);

	constructor(private httpClient: HttpClient) { }

	get batchDetails(): Observable<BatchDetailAssignments> {
		return this.batchDetailAssignments$.asObservable();
	}

	createBatch(batch): Observable<any> {
		return this.httpClient.post(`${environment.apiUrl}batch`, batch);
	}

	updateBatch(batchPayload) {
		return this.httpClient.put(`${environment.apiUrl}batch`, batchPayload);
	}

	deleteBatch(batchNo) {
		return this.httpClient.delete(`${environment.apiUrl}batch?batchNo=${batchNo}`);
	}

	getBatches(selectedOption: BatchType): Observable<Batch[]> {
		return this.httpClient.get<Batch[]>(`${environment.apiUrl}all/batches?batchType=${selectedOption}`);
	  }

	  getBatchDetails(batchId: number): Observable<any> {
		return this.httpClient.get(`${environment.apiUrl}/batch-details/${batchId}`);
	  }

	assignTranslator(batchId, translator): Observable<any> {
		return this.httpClient.post(`${environment.apiUrl}add/batch-details/${batchId}`, translator);
	}

	assignTextVerifier(batchDetailsId: number, textVerifier: any): Observable<any> {
		return this.httpClient.put(`${environment.apiUrl}assign/text-verifier/${batchDetailsId}`, textVerifier);
	}

	assignSecondReviewer(batchDetailsId: any, secondReviewer: { secondReviewerId: number }): Observable<any> {
		return this.httpClient.put(`${environment.apiUrl}assign/second-reviewer/${batchDetailsId}`, secondReviewer);
	}

	assignRecorder(batchDetailsId: any, recorder: { recordedById: number }): Observable<any> {
		return this.httpClient.put(`${environment.apiUrl}assign/recorder/${batchDetailsId}`, recorder);
	}

	assignAudioVerifier(batchDetailsId: any, param2: { audioVerifiedById: number }): Observable<any> {
		return this.httpClient.put(`${environment.apiUrl}assign/audio-verifier/${batchDetailsId}`, param2);
	}

	markTranslationBatchAsVerified(batchDetailsId, markAsReviewedUrl: string) {
		return this.httpClient.put(`${environment.apiUrl}batch-status/${markAsReviewedUrl}/${batchDetailsId}`, {});
	}

	markTranslationAsExpertReviewed(batchDetailsId) {
		return this.httpClient.put(`${environment.apiUrl}batch-status/secondVerification/${batchDetailsId}`, {});
	}

	markAudioRecordingAsCompleted(batchDetailsId: number) {
		return this.httpClient.put(`${environment.apiUrl}batch-status/recorded/${batchDetailsId}`, {});
	}

	markAudioAsReviewed(batchDetailsId: number) {
		return this.httpClient.put(`${environment.apiUrl}batch-status/audioVerified/${batchDetailsId}`, {});
	}

	getUserBatchesByStatus(userId: number, status: BatchProgressStatus) {
		this.httpClient.get<BatchDetailAssignments>(`${environment.apiUrl}user-batch-details?userId=${userId}&task=${status}`).subscribe((batchDetails: BatchDetailAssignments) => {
			this.batchDetailAssignments$.next(batchDetails);
		});
	}

	getCompletedSentences(batchDetailsId: number) {
		return this.httpClient.get<any>(`${environment.apiUrl}batch-details/completed-sentences?batchDetailsId=${batchDetailsId}`);
	}

	getAllBatchDetailsReportSummary(selectedOption: BatchType) {
		return this.httpClient.get<any>(`${environment.apiUrl}stats/all-batch-details?batchType=${selectedOption}`);
	  }

	getReportPerBatchDetailsId(batchDetailsId: number) {
		return this.httpClient.get<any>(`${environment.apiUrl}batch-details/expert-reviewed?batchDetailsId=${batchDetailsId}`);
	}

	getProgressReportPerBatchDetailsId(batchDetailsId: number): Observable<BatchDetailProgressReport> {
		return this.httpClient.get<any>(`${environment.apiUrl}stats/batch-details?batchDetailsId=${batchDetailsId}`)
			.pipe(map((progressReport: BatchDetailProgressReport) => new BatchDetailProgressReport(progressReport)));
	}

	deleteBatchDetail(batchDetailsId: any) {
		return this.httpClient.delete(`${environment.apiUrl}batch-details?batchDetailsId=${batchDetailsId}`);
	}
}
