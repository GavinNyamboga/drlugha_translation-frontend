import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {AbstractControl, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {ActivatedRoute, Router} from "@angular/router";
import {slideInOutAnimation} from "../../../../../@core/animations/slide-in-out";
import {Sentence} from "../../../../../@core/models/sentence/sentence";
import {SentenceService} from "../../../../../@core/services/sentence.service";
import {AssignmentsService} from "../../../../../@core/services/assignments.service";
import {TranslationService} from "../../../../../@core/services/translation/translation.service";
import {AuthService} from "../../../../../@core/services/auth/auth.service";
import {
	AssignmentsProgressConfigService
} from "../../../../../@core/services/assignments/assignments-progress-config.service";
import {BatchType} from "../../../../../@core/enums/batch-type";

@Component({
	selector: "app-sentences-to-translate",
	templateUrl: "./sentences-to-translate.component.html",
	styleUrls: ["./sentences-to-translate.component.scss"],
	animations: [
		slideInOutAnimation
	]
})
export class SentencesToTranslateComponent implements OnInit, OnChanges, OnDestroy {
	@Input() untranslatedSentences: Sentence[] = [];
	@Input() language: string;
	@Input() batchDetailsId: number;
	@Input() batchType: BatchType;

	translateForm: FormGroup;
	currentAssignment: Sentence;
	translation = "";
	currentIndex = 0;
	showSentenceText = true;

	constructor(
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private sentenceService: SentenceService,
		private assignmentsService: AssignmentsService,
		private translationService: TranslationService,
		private authService: AuthService,
		private toastService: ToastrService,
		private assignmentsConfig: AssignmentsProgressConfigService,
	) { }

	ngOnInit(): void {
		this.translateForm = this.formBuilder.group({
			translatedText: ["" , [Validators.required]],
		});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.untranslatedSentences) {
			this.untranslatedSentences = changes.untranslatedSentences?.currentValue || [];
			this.currentAssignment = this.untranslatedSentences[0];
			this.currentIndex = 0;
			if (this.untranslatedSentences.length > 0) {
				this.assignmentsConfig.showCount = true;
				this.assignmentsConfig.totalCount = this.untranslatedSentences.length;
				this.assignmentsConfig.currentIndex = 0;
			}
		}
	}

	ngOnDestroy() {
		this.assignmentsConfig.showCount = false;
	}

	get f(): { [key: string]: AbstractControl } {
		return this.translateForm.controls;
	}

	saveTranslation(sentenceId) {
		this.translateForm.markAllAsTouched();

		if (this.translateForm.invalid) {
			return;
		}

		const translatedText = {
			translatedText: this.translateForm.value.translatedText,
			batchDetailsId: this.batchDetailsId,
		};

		this.translationService.translateSentence(sentenceId, translatedText).subscribe({
			next: (response) => {
				console.log(response);
				this.nextAssignment();
			},
			error: (error) => {
				this.toastService.error(error.message);
			},
		});
	}


	nextAssignment() {
		this.clearTextField();
		if (this.currentIndex == this.untranslatedSentences.length - 1) {
			this.toastService.success(`You have completed ${this.batchType == BatchType.AUDIO ? "transcribing" : "translating"} all the sentences in this assignment. Kindly mark it as complete.`);
			this.navigateToNextPage();
		} else {
			this.currentIndex++;
			this.currentAssignment = this.untranslatedSentences[this.currentIndex];
			this.showSentenceTextAnimation();
		}
		this.assignmentsConfig.currentIndex = this.currentIndex;
	}

	clearTextField() {
		this.translateForm.reset();
	}

	showSentenceTextAnimation() {
		this.showSentenceText = !this.showSentenceText;

		setTimeout(() => {
			this.showSentenceText = !this.showSentenceText;
		}, 100);
	}

	navigateToNextPage() {
		const currentBatchDetailsId = this.activatedRoute.snapshot.queryParams.batchDetailsId;

		console.log(currentBatchDetailsId, "currentBatchDetailsId");
		console.log(this.batchDetailsId, "this.batchDetailsId");
		if (currentBatchDetailsId && currentBatchDetailsId == this.batchDetailsId) {
			window.location.reload();
		}else{
			this.router.navigate([], {
				relativeTo: this.activatedRoute,
				queryParams: {
					batchDetailsId: this.batchDetailsId,
				},
				queryParamsHandling: "merge",
			});
		}
	}

	protected readonly BatchType = BatchType;
}
