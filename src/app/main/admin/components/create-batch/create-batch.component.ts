import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from "@angular/core";
import * as XLSX from "xlsx";
import {AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {BatchService} from "../../../../../@core/services/batch/batch.service";

@Component({
	selector: "app-create-batch",
	templateUrl: "./create-batch.component.html",
	styleUrls: ["./create-batch.component.scss"]
})
export class CreateBatchComponent implements OnInit {
	@Output() newBatchCreated: EventEmitter<void> = new EventEmitter<void>();

	@ViewChild("excelTable", { static: false }) TABLE: ElementRef;
	createBatchForm: UntypedFormGroup;
	uploadedSentencesFromExcel: any = [];

	constructor(
		private fb: UntypedFormBuilder,
		private toastService: ToastrService,
		private batchService: BatchService) { }

	ngOnInit(): void {
		this.initializeCreateBatchForm();
	}

	initializeCreateBatchForm(): void {
		this.createBatchForm = this.fb.group({
			source: ["", Validators.required],
			linkUrl: ["", Validators.required],
			description: ["", Validators.required],
			sentences: ["", Validators.required],
		});
	}

	get f(): { [key: string]: AbstractControl } {
		return this.createBatchForm.controls;
	}

	downloadExcelSample(): void {
		const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.TABLE.nativeElement);
		const wb: XLSX.WorkBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
		XLSX.writeFile(wb, "AddSentences.xlsx");
	}

	onFileChange(event): void {
		this.uploadedSentencesFromExcel = [];
		const file = event.target.files[0];
		const fileReader = new FileReader();
		fileReader.readAsArrayBuffer(file);
		fileReader.onload = () => {
			const arrayBuffer: any = fileReader.result;
			const data = new Uint8Array(arrayBuffer);
			const arr = [];
			for (let i = 0; i !== data.length; ++i) {
				arr[i] = String.fromCharCode(data[i]);
			}

			const bstr = arr.join("");
			const workbook = XLSX.read(bstr, { type: "binary" });

			const sheetName = workbook.SheetNames[0];
			const worksheet = workbook.Sheets[sheetName];

			const arraylist = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

			for (let i = 0; i < arraylist.length; i++) {
				const sentence = arraylist[i][0];
				if (sentence && sentence.trim() !== "") {
					this.uploadedSentencesFromExcel.push({
						sentenceText: sentence,
					});
				}
			}

			this.createBatchForm.patchValue({
				sentences: this.uploadedSentencesFromExcel
			});

			event.target.value = "";
		};
	}

	createBatch(): void {
		this.createBatchForm.markAllAsTouched();
		if (this.createBatchForm.invalid) {
			return;
		}

		this.batchService.createBatch(this.createBatchForm.value).subscribe({
			next: () => {
				this.createBatchForm.reset();
				this.uploadedSentencesFromExcel = [];
				this.toastService.success("Sentences uploaded successfully");
				this.newBatchCreated.emit();
			},
			error: () => {
				this.toastService.error("Upload of sentences failed. Please try again");
			}
		});
	}
}
