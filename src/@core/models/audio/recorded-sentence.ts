export interface RecordedSentence {
	sentenceId: number;
	sentenceText: string;
	translatedSentenceId: number;
	translatedSentenceText: string;
	audioLink: string;
	accepted: boolean;
	comment: string;
	voiceId: number;
}
