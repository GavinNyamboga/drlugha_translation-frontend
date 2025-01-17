export class StatsPerUser {
	userId: number;
	username: string;
	email: string;
	translator: {
        sentencesApproved: number;
        sentencesRejected: number;
        sentencesTranslated: number;
    };
	transcriber: {
		sentencesApproved: number;
		sentencesRejected: number;
		sentencesTranslated: number;
	};
	moderator: {
        sentencesApproved: number;
        sentencesRejected: number;
    };
	transcriptionModerator: {
		sentencesApproved: number;
		sentencesRejected: number;
	};
	expert: {
        sentencesExpertApproved: number;
        sentencesExpertRejected: number;
    };
	transcriptionExpert: {
		sentencesExpertApproved: number;
		sentencesExpertRejected: number;
	};
	recorder: {
        audiosRecorded: number;
        audiosApproved: number;
        audiosRejected: number;
    };
	audioModerator: {
        audiosApproved: number;
        audiosRejected: number;
    };

	constructor(statsPerUser: StatsPerUser) {
		this.userId = statsPerUser.userId;
		this.username = statsPerUser.username;
		this.email = statsPerUser.email;
		this.translator = statsPerUser.translator;
		this.moderator = statsPerUser.moderator;
		this.expert = statsPerUser.expert;
		this.recorder = statsPerUser.recorder;
		this.audioModerator = statsPerUser.audioModerator;
		this.transcriber = statsPerUser.transcriber;
		this.transcriptionModerator = statsPerUser.transcriptionModerator;
		this.transcriptionExpert = statsPerUser.transcriptionExpert;
	}

	get totalSentencesTranslated(): number {
		return this.translator.sentencesTranslated || 0;
	}

	get totalAudiosTranscribed(): number {
		return this.transcriber.sentencesTranslated || 0;
	}

	get totalSentencesModerated(): number {
		return this.moderator.sentencesApproved + this.moderator.sentencesRejected;
	}

	get totalTranscriptionModerated(): number {
		return this.transcriptionModerator.sentencesApproved + this.transcriptionModerator.sentencesRejected;
	}

	get totalSentencesExpertModerated(): number {
		return this.expert.sentencesExpertApproved + this.expert.sentencesExpertRejected;
	}

	get totalTranscriptionExpertModerated(): number {
		return this.transcriptionExpert.sentencesExpertApproved + this.transcriptionExpert.sentencesExpertRejected;
	}

	get totalAudiosRecorded(): number {
		return this.recorder.audiosRecorded || 0;
	}

	get totalAudiosModerated(): number {
		return this.audioModerator.audiosApproved + this.audioModerator.audiosRejected;
	}
}
