export interface ReviewedSentence {
	accepted: boolean;
	sentenceId: number;
	sentenceText: string;
	translatedSentenceId: number;
	translatedSentenceText: string;
	comment: string;
	audioLink: string;
}
