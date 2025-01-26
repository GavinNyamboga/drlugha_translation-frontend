import { AudioDetails } from "./audio-details";

export interface RecordedSentence {
	sentenceId: number;
	sentenceText: string;
	translatedSentenceId: number;
	translatedSentenceText: string;
	audioLink: string;
	audioList : AudioDetails[]
	accepted: boolean;
	comment: string;
	voiceId: number;
}
