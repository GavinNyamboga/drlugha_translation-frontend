import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {ToastrService} from "ngx-toastr";
import {AudioAssignmentRecord} from "../../../../@core/models/audio/audio-assignment-record";
import {AuthService} from "../../../../@core/services/auth/auth.service";
import {SentenceService} from "../../../../@core/services/sentence.service";
import {TranslationService} from "../../../../@core/services/translation/translation.service";
import {
	AssignmentsProgressConfigService
} from "../../../../@core/services/assignments/assignments-progress-config.service";
import {BatchProgressStatus} from "../../../../@core/enums/batch-progress-status";

@Component({
	selector: "app-translate",
	templateUrl: "./translate.component.html",
	styleUrls: ["./translate.component.scss"]
})
export class TranslateComponent implements OnInit {
	currentUser: any;
	batchDetailsId: number;
	audioAssignment: AudioAssignmentRecord;
	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private toastr: ToastrService,
		private authService: AuthService,
		private sentenceService: SentenceService,
		private translationService : TranslationService,
		private assignmentsConfig: AssignmentsProgressConfigService
	) {
		this.assignmentsConfig.defaultUrl = "/main/oral-translate/translate/recording";
		this.assignmentsConfig.batchProgress = BatchProgressStatus.AUDIO_RECORDING;
		this.assignmentsConfig.badgeLabels = BatchProgressStatus.AUDIO_RECORDING;
	}

	ngOnInit(): void {
		this.currentUser = this.authService.getCurrentUser();
		this.activatedRoute.queryParams.subscribe((params) => {
			this.batchDetailsId = params["batchDetailsId"];
			this.getUserAssignments();
		});
	}

	getUserAssignments() {
		this.translationService.getAudioAssignments(this.currentUser, this.batchDetailsId).subscribe({
			next: (response) => {
				this.audioAssignment = response;
			},
			error: (error) => {
				this.toastr.error(error.message);
			}
		});

	}
}
