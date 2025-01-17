export interface BatchDetailsSummaryReport {
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
	recorder: number;
	audiosRecorded: string;
	audioModerator: number;
	audiosApproved: number;
	audiosRejected: string;
	language: string;
	status: string;
}
