import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { BatchService } from '../../../../@core/services/batch/batch.service';
import { ToastrService } from 'ngx-toastr';
import { Batch } from '../../../../@core/models/batch/batch';
import { BatchType } from '../../../../@core/enums/batch-type'; // Adjust path as needed

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
  batches: Batch[] = [];
  batchSize = 500;
  loadingBatches = false;
  pageSize = 10;
  page = 1;
  editBatchesForm: any;
  editableRows: any = {};
  selectedOption: BatchType = BatchType.TEXT; // default option
  selectedBatchId: number | null = null; // Added property
  selectedBatchDetails: Batch | null = null; // Adjust type as needed
  batchTypes = BatchType; // Add this property

  constructor(private batchService: BatchService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.fetchBatches();
  }

  onFileChange(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);
    if (target.files.length !== 1) {
      this.toastr.error('Cannot use multiple files');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];
      const data = <any[][]>(XLSX.utils.sheet_to_json(ws, { header: 1 }));

      const header = data[0];
      const englishSentenceIndex = header.indexOf('English_Sentence');
      const datasetSentenceIndex = header.indexOf('Dataset sentence');

      this.excelSentences = data.slice(1).map(row => ({
        'English_Sentence': row[englishSentenceIndex],
        'Dataset sentence': row[datasetSentenceIndex]
      }));
    };
    reader.readAsBinaryString(target.files[0]);
  }

  generateBatch(): void {
    const batches = [];
    for (let i = 0; i < this.excelSentences.length; i += this.batchSize) {
      const batch = this.excelSentences.slice(i, i + this.batchSize);
      batches.push(batch);
    }

    this.loadingBatches = true;

    batches.forEach((batch, index) => {
      this.batchService.createBatch({ sentences: batch }).subscribe(
        () => {
          if (index === batches.length - 1) {
            this.toastr.success('Batches created successfully');
            this.excelSentences = [];
            this.loadingBatches = false;
            this.fetchBatches();
          }
        },
        () => {
          this.toastr.error('Error creating batch');
          this.loadingBatches = false;
        }
      );
    });
  }

  fetchBatches(): void {
    this.loadingBatches = true;
    this.batchService.getBatches(this.selectedOption).subscribe(
      (response: Batch[]) => {
        this.batches = response;
        this.loadingBatches = false;
      },
      (error) => {
        this.toastr.error('Error fetching batches');
        this.loadingBatches = false;
      }
    );
  }

  onBatchChange(): void {
    const selectedBatch = this.batches.find(batch => batch.batchNo === this.selectedBatchId);
    if (selectedBatch) {
      this.selectedBatchDetails = selectedBatch;
    } else {
      this.selectedBatchDetails = null;
    }
  }

  activateRowEdit(batch: Batch): void {
    this.editableRows[batch.batchNo] = !this.editableRows[batch.batchNo];
  }

  updateBatch(index: number, batch: Batch): void {
    // Implement the update logic here
    // For now, just toggle the edit mode off
    this.editableRows[batch.batchNo] = false;
    this.toastr.success('Batch updated successfully');
  }

  confirmDelete(batch: Batch): void {
    // Implement the delete logic here
    this.toastr.success('Batch deleted successfully');
  }
}
