import {AudioAssignment} from "./audio-assignment";
import {RecordedSentence} from "./recorded-sentence";

export interface AudioAssignmentRecord extends AudioAssignment {
	recordedSentences: RecordedSentence[];
	unrecordedSentences: RecordedSentence[];
}
