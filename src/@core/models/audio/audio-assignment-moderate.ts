import {AudioAssignment} from "./audio-assignment";
import {RecordedSentence} from "./recorded-sentence";

export interface AudioAssignmentModerate extends AudioAssignment {
	reviewedAudios: RecordedSentence[];
	unreviewedAudios: RecordedSentence[];
}
