import {ReviewedSentence} from "../sentence/reviewed-sentence";
import {BatchType} from "../../enums/batch-type";

export interface ModerationAssignment {
	batchDetailsId: number;
	language: string;
	batchType: BatchType;
	reviewedSentences: ReviewedSentence[];
	unreviewedSentences: ReviewedSentence[];
}
