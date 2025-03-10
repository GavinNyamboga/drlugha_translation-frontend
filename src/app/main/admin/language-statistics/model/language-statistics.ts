import { BatchType } from "@core/enums/batch-type";

export interface LanguageStatics {
    languageName: String;
    languageId: number;
    batchTypeStatistics: BatchTypeStatistics[];
}

export interface BatchTypeStatistics {
    batchType: BatchType;
    totalBatchSentencesOrAudios: number;
    totalTranslated: number;
    totalTextApproved: number;
    totalTextRejected: number;
    totalTextExpertApproved: number;
    totalTextExpertRejected: number;
    totalAudioRecorded: number;
    totalAudioApproved: number;
    totalAudioRejected: number;
    totalAudioExpertApproved: number;
    totalExpertAudioRejected: number;
    textToBeExpertReviewed: number;
    audioToBeExpertReviewed: number;
  }