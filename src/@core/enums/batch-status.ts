export enum BatchStatus {
    ASSIGNED_TRANSLATOR = "ASSIGNED_TRANSLATOR",
    TRANSLATED = "TRANSLATED",
    TRANSCRIBED = "TRANSLATED",
    ASSIGNED_TEXT_VERIFIER = "ASSIGNED_TEXT_VERIFIER",
    TRANSLATION_VERIFIED = "TRANSLATION_VERIFIED",
    ASSIGNED_EXPERT_REVIEWER = "ASSIGNED_EXPERT_REVIEWER",
    SECOND_VERIFICATION_DONE = "SECOND_VERIFICATION_DONE",
    ASSIGNED_RECORDER = "ASSIGNED_TRANSLATOR",
    RECORDED = "RECORDED",
    ASSIGNED_AUDIO_VERIFIER = "ASSIGNED_AUDIO_VERIFIER",
    AUDIO_VERIFIED = "AUDIO_VERIFIED",
    ASSIGNED_EXPERT_AUDIO_REVIEWER = "ASSIGNED_EXPERT_AUDIO_REVIEWER",
    EXPERT_AUDIO_VERIFIED = "EXPERT_AUDIO_VERIFIED",
}
