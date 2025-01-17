import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";
import {UntypedFormArray, UntypedFormBuilder, UntypedFormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import Swal from "sweetalert2";
import {TranslatedSentence} from "../../../../../@core/models/translation/translated-sentence";
import {SentenceService} from "../../../../../@core/services/sentence.service";
import {BatchType} from "../../../../../@core/enums/batch-type";

@Component({
	selector: "app-verify-text-translations",
	templateUrl: "./verify-text-translations.component.html",
	styleUrls: ["./verify-text-translations.component.scss"]
})
export class VerifyTextTranslationsComponent implements OnInit, OnChanges {
	@Input() batchDetailsId: number;
	@Input() translatedSentences: TranslatedSentence[] = [];
	@Input() batchSource: string;
	@Input() isEditable: boolean;
	@Input() batchType: BatchType = BatchType.TEXT;

	@Output() markedAsTranslated: EventEmitter<void> = new EventEmitter<void>();

	editableSentenceRow: { [key: number]: boolean } = {};
	translatedSentencesForm: UntypedFormGroup;
	protected readonly BatchType = BatchType;
	pageSize = 100;
	page = 1;

	constructor(
		private sentenceService: SentenceService,
		private activatedRoute: ActivatedRoute,
		private fb: UntypedFormBuilder,
		private toastService: ToastrService,
		private router: Router) { }

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.translatedSentences?.currentValue) {
			this.translatedSentences = changes.translatedSentences.currentValue;
			this.initializeTranslatedSentencesForm();
		}
	}


	initializeTranslatedSentencesForm() {
		const translatedSentencesFormArray = this.translatedSentences.map((translatedSentence) => {
			return this.fb.group({
				translatedSentenceId: [translatedSentence.translatedSentenceId],
				translatedText: [translatedSentence.translatedText]
			});
		});

		this.translatedSentencesForm = this.fb.group({
			translatedSentences: this.fb.array(translatedSentencesFormArray)
		});
	}

	get hasRejectedSentences(): boolean {
		return this.translatedSentences.some((translatedSentence) => translatedSentence.approved === false);
	}

	enableSentenceRowEdit(translatedSentence: TranslatedSentence) {
		this.editableSentenceRow[translatedSentence.translatedSentenceId] = !this.editableSentenceRow[translatedSentence.translatedSentenceId];
	}

	updateTranslatedSentence(sentenceIndex) {
		const {translatedSentenceId, translatedText} = this.translatedSentencesFormArray.at(sentenceIndex).value;

		this.sentenceService.updateTranslatedSentence(translatedSentenceId, translatedText).subscribe({
			next: () => {

				this.editableSentenceRow[translatedSentenceId] = false;
				this.translatedSentences[sentenceIndex].translatedText = translatedText;
				this.translatedSentences[sentenceIndex].approved = null;

				this.toastService.success("Translation updated successfully");
			},
			error: () => {
				this.toastService.error("Error occurred while updating translation");
			}
		});
	}

	get translatedSentencesFormArray() {
		return this.translatedSentencesForm.get("translatedSentences") as UntypedFormArray;
	}

	confirmMarkAsTranslated() {
		const rejectedSentencesExists = this.translatedSentences.some((translatedSentence) => translatedSentence.approved === false);

		if (rejectedSentencesExists) {
			this.toastService.warning("Kindly correct all sentences that have been rejected");
			return;
		}

		Swal.fire({
			title: "Complete Translation",
			text: "Are you sure you want to mark this translation as complete?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonText: "Yes, complete it!",
			cancelButtonText: "No, cancel!",
			reverseButtons: true
		}).then((result) => {
			if (result.value) {
				this.markAsTranslated();
			}
		});
	}

	private markAsTranslated() {
		this.sentenceService.markAsTranslated(this.batchDetailsId).subscribe({
			next: () => {
				this.markedAsTranslated.emit();
				this.toastService.success("Translation marked as complete");
			},
			error: () => {
				this.toastService.error("Error occurred while marking translation as complete");
			}
		});
	}
}
