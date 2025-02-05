import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { BatchService } from '../../../../@core/services/batch/batch.service';
import { ToastrService } from 'ngx-toastr';
import { Language } from '@core/models/language/language';
import { AbstractControl, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

interface ExcelSentence {
  'English_Sentence': string;
  'Dataset sentence': string;
}

@Component({
  selector: 'app-re-review-batches',
  templateUrl: './re-review-batches.component.html',
  styleUrls: ['./re-review-batches.component.scss']
})
export class ReReviewBatchesComponent implements OnInit {
  excelSentences: ExcelSentence[] = [];
  langauges: Language[] = [];
  batchSize = 500;
  loadingBatches = false;
  pageSize = 10;
  page = 1;
  editBatchesForm: any;
  editableRows: any = {};
  uploadedSentencesFromExcel: any = [];
  createReReviewBatchForm: UntypedFormGroup;

  constructor(private batchService: BatchService,
    private toastr: ToastrService,
    private fb: UntypedFormBuilder,
  ) { }


  ngOnInit(): void {
    this.initializeCreateReReviewBatchForm();
  }

  initializeCreateReReviewBatchForm(): void {
    this.createReReviewBatchForm = this.fb.group({
      language: ["", Validators.required],
      sentences: ["", Validators.required],
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.createReReviewBatchForm.controls;
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
        const row = arraylist[i];
        
        // Skip header row if needed
        if (i === 0) continue;
        
        const batch = row[0];
        const rowNumber = row[1];
        const translatedBy = row[2];
        const englishSentence = row[3];
        const datasetSentence = row[4];
        const modelSentence = row[5];
        
        // Add type checking and conversion
        const processValue = (value: any) => {
          return typeof value === 'string' ? value.trim() : 
                 value !== undefined && value !== null ? String(value).trim() : '';
        };
        
        const processedEntry = {
          ...(processValue(batch) && { batch: processValue(batch) }),
          ...(processValue(rowNumber) && { row: processValue(rowNumber) }),
          ...(processValue(translatedBy) && { translatedBy: processValue(translatedBy) }),
          ...(processValue(englishSentence) && { englishSentence: processValue(englishSentence) }),
          ...(processValue(datasetSentence) && { datasetSentence: processValue(datasetSentence) }),
          ...(processValue(modelSentence) && { modelSentence: processValue(modelSentence) })
        };
        
        // Only push if the entry has at least one non-empty property
        if (Object.keys(processedEntry).length > 0) {
          this.uploadedSentencesFromExcel.push(processedEntry);
        }
      }
      
      event.target.value = "";
    };
  }

}
