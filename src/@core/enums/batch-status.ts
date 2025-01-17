export enum BatchStatus {
    ASSIGNED_TRANSLATOR = "assignedTranslator",
    TRANSLATED = "translated",
    ASSIGNED_TEXT_VERIFIER = "assignedTextVerifier",
    TRANSLATION_VERIFIED = "translationVerified",
    ASSIGNED_EXPERT_REVIEWER = "assignedExpertReviewer",
    SECOND_VERIFICATION_DONE = "secondVerificationDone",
    ASSIGNED_RECORDER = "assignedRecorder",
    RECORDED = "recorded",
    ASSIGNED_AUDIO_VERIFIER = "assignedAudioVerifier",
    AUDIO_VERIFIED = "audioVerified",
}
