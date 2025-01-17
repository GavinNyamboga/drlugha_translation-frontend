import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {BatchProgressStatus} from "../../enums/batch-progress-status";
import {BatchDetails} from "../../models/batch/batch-details";

@Injectable({
	providedIn: "root"
})
export class AssignmentsProgressConfigService {
	private _showCount$ = new BehaviorSubject<boolean>(false);
	private _currentIndex$ = new BehaviorSubject<number>(0);
	private _totalCount$ = new BehaviorSubject<number>(0);
	private _defaultUrl$ = new BehaviorSubject<string>("");
	private _badgeLabels$ = new BehaviorSubject<{pending: string, completed: string}>(null);
	private _batchProgress$ = new BehaviorSubject<BatchProgressStatus>(null);
	private _batchDetailCompleted$ = new BehaviorSubject<boolean>(null);
	private _showTranscriptionAssignments$ = new BehaviorSubject<boolean>(true);
	get currentIndex$() {
		return this._currentIndex$.asObservable();
	}

	get totalCount$() {
		return this._totalCount$.asObservable();
	}

	get showCount$() {
		return this._showCount$.asObservable();
	}

	get defaultUrl$() {
		return this._defaultUrl$.asObservable();
	}

	get badgeLabels$() {
		return this._badgeLabels$.asObservable();
	}

	get batchProgress$() {
		return this._batchProgress$.asObservable();
	}

	get batchDetailCompleted$() {
		return this._batchDetailCompleted$.asObservable();
	}

	get showTranscriptionAssignments$() {
		return this._showTranscriptionAssignments$.asObservable();
	}

	set currentIndex(value: number) {
		this._currentIndex$.next(value + 1);
	}

	set totalCount(value: number) {
		this._totalCount$.next(value);
	}

	set showCount(value: boolean) {
		this._showCount$.next(value);
	}

	set defaultUrl(value: string) {
		this._defaultUrl$.next(value);
	}

	set batchProgress(value: BatchProgressStatus) {
		this._batchProgress$.next(value);
	}

	set badgeLabels(batchProgress: BatchProgressStatus) {
		switch (batchProgress) {
		case BatchProgressStatus.translation:
			this._badgeLabels$.next({
				pending: "Pending",
				completed: "Translated"
			});
			return;
		case BatchProgressStatus.review:
		case BatchProgressStatus.expertReview:
		case BatchProgressStatus.audioReviewing:
			this._badgeLabels$.next({
				pending: "Pending Review",
				completed: "Reviewed"
			});
			return;
		case BatchProgressStatus.audioRecording:
			this._badgeLabels$.next({
				pending: "Pending Recording",
				completed: "Recorded"
			});
			return;
		default:
			this._badgeLabels$.next({
				pending: "Pending",
				completed: "Completed"
			});
		}
	}

	set showTranscriptionAssignments(value: boolean) {
		this._showTranscriptionAssignments$.next(value);
	}

	isBatchDetailCompleted(batchDetails: BatchDetails): boolean {
		switch (this._batchProgress$.getValue()) {
		case BatchProgressStatus.translation:
			return batchDetails.translated;
		case BatchProgressStatus.review:
			return batchDetails.reviewed;
		case BatchProgressStatus.expertReview:
			return batchDetails.expertReviewed;
		case BatchProgressStatus.audioReviewing:
			return batchDetails.audioReviewed;
		case BatchProgressStatus.audioRecording:
			return batchDetails.audioRecorded;
		default:
			return null;
		}
	}

}
