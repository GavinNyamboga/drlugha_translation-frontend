import {CompletedSentence} from "../sentence/completed-sentence";
import {BatchType} from "../../enums/batch-type";

export interface BatchDetailReport {
	batchDetailsId: number;
	batchDetailsStatus: string;
	language: string;
	batchType: BatchType;
	numberOfSentences: number;
	numberOfCompletedSentences: number;
	completedSentences: CompletedSentence[];
}
