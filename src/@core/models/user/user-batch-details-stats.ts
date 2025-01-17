export interface UserBatchDetailsStats {
    translator: Array<{
        batchDetailsId: number,
        source: string,
        totalSentences: number,
        sentencesTranslated: number,
        sentencesApproved: number,
        sentencesRejected: number,
    }>

	transcriber: Array<{
		batchDetailsId: number,
		source: string,
		totalSentences: number,
		sentencesTranslated: number,
		sentencesApproved: number,
		sentencesRejected: number,
	}>

    moderator: Array<{
        batchDetailsId: number,
        source: string,
        totalSentences: number,
        sentencesApproved: number,
        sentencesRejected: number,
    }>

	transcriptionModerator: Array<{
		batchDetailsId: number,
		source: string,
		totalSentences: number,
		sentencesApproved: number,
		sentencesRejected: number,
	}>

    expert: Array<{
        batchDetailsId: number,
        source: string,
        totalSentences: number,
        sentencesExpertApproved: number,
        sentencesExpertRejected: number,
    }>

	transcriptionExpert: Array<{
		batchDetailsId: number,
		source: string,
		totalSentences: number,
		sentencesExpertApproved: number,
		sentencesExpertRejected: number,
	}>

    recorder: Array<{
        batchDetailsId: number,
        source: string,
        totalSentences: number,
        audiosRecorded: number,
        audiosApproved: number,
        audiosRejected: number,
    }>

    audioModerator: Array<{
        batchDetailsId: number,
        source: string,
        totalSentences: number,
        audiosApproved: number,
        audiosRejected: number,
    }>
}
