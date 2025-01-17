import {fractionToPercentage} from "../../utils/fraction-to-percentage";

export class BatchDetailProgressReport {
	batchDetailsId: number;
	source: string;
	translator: string;
	numberOfSentences: number;
	sentencesTranslated: number;
	moderator: string;
	sentencesApproved: number;
	sentencesRejected: number;
	expert: string;
	sentencesExpertApproved: number;
	sentencesExpertRejected: number;
	recorder: string;
	audiosRecorded: number;
	audioModerator: string;
	audiosApproved: number;
	audiosRejected: number;
	totalSentences: number;
	language: string;

	constructor(batchDetailsProgressReport: BatchDetailProgressReport) {
		this.batchDetailsId =  batchDetailsProgressReport.batchDetailsId;
		this.source =  batchDetailsProgressReport.source;
		this.translator =  batchDetailsProgressReport.translator;
		this.numberOfSentences =  batchDetailsProgressReport.numberOfSentences;
		this.sentencesTranslated =  batchDetailsProgressReport.sentencesTranslated;
		this.moderator =  batchDetailsProgressReport.moderator;
		this.sentencesApproved =  batchDetailsProgressReport.sentencesApproved;
		this.sentencesRejected =  batchDetailsProgressReport.sentencesRejected;
		this.expert =  batchDetailsProgressReport.expert;
		this.sentencesExpertApproved =  batchDetailsProgressReport.sentencesExpertApproved;
		this.sentencesExpertRejected =  batchDetailsProgressReport.sentencesExpertRejected;
		this.recorder =  batchDetailsProgressReport.recorder;
		this.audiosRecorded =  batchDetailsProgressReport.audiosRecorded;
		this.audioModerator =  batchDetailsProgressReport.audioModerator;
		this.audiosApproved =  batchDetailsProgressReport.audiosApproved;
		this.audiosRejected =  batchDetailsProgressReport.audiosRejected;
		this.totalSentences =  batchDetailsProgressReport.totalSentences;
		this.language =  batchDetailsProgressReport.language;
	}

	get translationProgress(): number {
		return fractionToPercentage(this.sentencesTranslated, this.numberOfSentences);
	}

	get moderationProgress(): number {
		const sentencesModerated = this.sentencesApproved + this.sentencesRejected;
		return fractionToPercentage(sentencesModerated, this.numberOfSentences);
	}

	get expertReviewProgress(): number {
		const sentencesExpertlyReviewed = this.sentencesExpertApproved + this.sentencesExpertRejected;

		return fractionToPercentage(sentencesExpertlyReviewed, this.numberOfSentences);
	}

	get audioRecordingProgress(): number {
		return fractionToPercentage(this.audiosRecorded, this.numberOfSentences);
	}

	get audioModerationProgress(): number {
		const audiosModerated = this.audiosApproved + this.audiosRejected;

		return fractionToPercentage(audiosModerated, this.numberOfSentences);
	}
}
