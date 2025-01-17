import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {User} from "../../../../../../@core/models/user.model";
import {BatchService} from "../../../../../../@core/services/batch/batch.service";
import {Language} from "../../../../../../@core/models/language/language";
import {BatchType} from "../../../../../../@core/enums/batch-type";

@Component({
	selector: "app-assign-translator",
	templateUrl: "./assign-translator.component.html",
	styleUrls: ["./assign-translator.component.scss"]
})
export class AssignTranslatorComponent implements OnInit {
	@Input() batchId: number;
	@Input() selectedLanguage: Language;
	@Input() users: User[] = [];
	@Input() batchType: BatchType;

	@Output() addBatchDetails: EventEmitter<any> = new EventEmitter<any>();

	translatorForm: UntypedFormGroup;
	assigneeTitle = "Translator";

	constructor(
		private fb: UntypedFormBuilder,
		private batchService: BatchService,
		private toastService: ToastrService) { }

	ngOnInit(): void {
		this.initiateForms();
		console.log(this.batchType);
		this.batchType === BatchType.AUDIO ? this.assigneeTitle = "Transcriber" : this.assigneeTitle = "Translator";
	}

	initiateForms(): void {
		this.translatorForm = this.fb.group({
			translator: ["", Validators.required]
		});
	}

	get f(): {[key: string]: AbstractControl} {
		return this.translatorForm.controls;
	}

	addTranslator(): void {
		const {translator} = this.translatorForm.value;

		const translatorData = {
			language: this.selectedLanguage?.languageId,
			translatedById: parseInt(translator)
		};

		this.batchService.assignTranslator(this.batchId, translatorData).subscribe(
			(response) => {
				this.addBatchDetails.emit(response);
				this.toastService.success(`${this.assigneeTitle} added successfully`);
			},
			(error) => {
				const message = error?.error?.message || "Something went wrong, please try again later";
				this.toastService.error(message);
			}
		);
	}

	protected readonly BatchType = BatchType;
}
