export interface Sentence {
    sentenceId: number;
    sentenceText: string;
    audioUrl: string;
    recordedBy?: {
      voiceId: number;
    };
  }
  
