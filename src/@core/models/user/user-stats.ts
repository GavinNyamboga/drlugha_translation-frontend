export interface UserStats {
	userId: number,
	username: string,
	email: string,
	translator: {
		sentencesApproved: number,
		sentencesRejected: number,
		sentencesTranslated: number
	},
	moderator: {
		sentencesApproved: number,
		sentencesRejected: number
	},
	expert: {
		sentencesExpertApproved: number,
		sentencesExpertRejected: number
	},
	recorder: {
		audiosRecorded: number,
		audiosApproved: number,
		audiosRejected: number
	},
	audioModerator: {
		audiosApproved: number,
		audiosRejected: number
	}
}
