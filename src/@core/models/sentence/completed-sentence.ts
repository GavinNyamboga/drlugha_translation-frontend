import { AudioDetails } from "../audio/audio-details";

export interface CompletedSentence {
	sentenceId: number;
	sentenceText: string;
	translatedSentenceId: number;
	translatedText: string;
	audioUrl: string;
	transcriptionAudioUrl: string;
	recordedBy?: {
	  voiceId: number;
	};
	audioDetails: AudioDetails[]
  }
  
