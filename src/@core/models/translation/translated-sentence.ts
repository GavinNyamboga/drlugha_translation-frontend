import {Sentence} from "../sentence/sentence";

export interface TranslatedSentence {
	translatedSentenceId: number;
	translatedText: string;
	sentence: Sentence;
	approved: boolean;
	moderatorComment: string;
	expertComment: string;
}
