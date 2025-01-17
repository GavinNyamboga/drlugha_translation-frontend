import {Sentence} from "../sentence/sentence";
import {TranslatedSentence} from "./translated-sentence";
import {BatchType} from "../../enums/batch-type";

export interface Assignments {
	batchDetailsId: number;
	language: string;
	batchType: BatchType;
	pendingTasks: Sentence[];
	translatedSentences: TranslatedSentence[];
}
