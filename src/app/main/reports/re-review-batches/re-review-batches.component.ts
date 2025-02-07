import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import * as XLSX from 'xlsx';
import { BatchService } from '../../../../@core/services/batch/batch.service';
import { ToastrService } from 'ngx-toastr';
import { Language } from '@core/models/language/language';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LanguageService } from '@core/services/language/language.service';

@Component({
  selector: 'app-re-review-batches',
  templateUrl: './re-review-batches.component.html',
  styleUrls: ['./re-review-batches.component.scss']
})
export class ReReviewBatchesComponent implements OnInit {
  @Output() newBatchCreated: EventEmitter<void> = new EventEmitter<void>();

  languages: Language[] = [];
  selectedLanguage: number = null; // Stores the selected language ID
  uploadedSentencesFromExcel: any = [];
  createReReviewBatchForm: UntypedFormGroup;
  loading = false;

  constructor(
    private batchService: BatchService,
    private toastService: ToastrService,
    private fb: UntypedFormBuilder,
    private languageService: LanguageService,
  ) { }

  ngOnInit(): void {
    this.initializeCreateReReviewBatchForm();
    this.getLanguages();
  }

  initializeCreateReReviewBatchForm(): void {
    this.createReReviewBatchForm = this.fb.group({
      selectedLanguage: [null, Validators.required], // Store selected language in the form
      batch: ["", Validators.required],
      rowNumber: ["", Validators.required],
      translatedBy: ["", Validators.required],
      englishSentence: ["", Validators.required],
      datasetSentence: ["", Validators.required],
      modelSentence: ["", Validators.required]
    });
  }
  

  get f(): { [key: string]: AbstractControl } {
    return this.createReReviewBatchForm.controls;
  }

  onFileChange(event): void {
    const selectedLang = this.createReReviewBatchForm.get('selectedLanguage')?.value;

    if (!selectedLang) {
      this.toastService.error("Please select a language before uploading a file.");
      return;
    }
  
    this.uploadedSentencesFromExcel = [];
    const file = event.target.files[0];
  
    if (!file) return; // Prevent errors if no file is selected
  
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
  
      for (let i = 1; i < arraylist.length; i++) { // Skip header row
        const row = arraylist[i];
        const processedEntry = {
          batch: row[0] ? String(row[0]).trim() : '',
          rowNumber: row[1] ? String(row[1]).trim() : '',
          translatedBy: row[2] ? String(row[2]).trim() : '',
          englishSentence: row[3] ? String(row[3]).trim() : '',
          datasetSentence: row[4] ? String(row[4]).trim() : '',
          modelSentence: row[5] ? String(row[5]).trim() : '',
        };
  
        if (Object.values(processedEntry).some(val => val !== '')) {
          this.uploadedSentencesFromExcel.push(processedEntry);
        }
      }
  
      this.createReReviewBatchForm.patchValue({ sentences: this.uploadedSentencesFromExcel });
      console.log("Uploaded Sentences:", this.uploadedSentencesFromExcel);
    };
  
    event.target.value = "";
  }
  

  createReReviewBatch(): void {
    this.createReReviewBatchForm.markAllAsTouched();
    const selectedLang = this.createReReviewBatchForm.get('selectedLanguage')?.value;
  
    if (!selectedLang || this.uploadedSentencesFromExcel.length === 0) {
      this.toastService.error("Please select a language and upload sentences before submitting.");
      return;
    }
  
    this.loading = true; // Disable submit button
    console.log("About to call service");
  
    this.batchService.reReviewBatch(selectedLang, this.uploadedSentencesFromExcel).subscribe({
      next: () => {
        this.createReReviewBatchForm.reset();
        this.uploadedSentencesFromExcel = [];
        this.toastService.success("Sentences uploaded successfully");
        this.newBatchCreated.emit();
        this.loading = false; // Re-enable submit button
      },
      error: () => {
        this.toastService.error("Upload of sentences failed. Please try again");
        this.loading = false; // Re-enable submit button even on error
      }
    });
  }
  

  private getLanguages(): void {
    this.languageService.getLanguages().subscribe(
      (languages) => {
        this.languages = languages;
      }
    );
  }
}
