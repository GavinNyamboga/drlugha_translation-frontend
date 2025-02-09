import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";

import { Batch } from "../../../../../@core/models/batch/batch";
import { BatchService } from "../../../../../@core/services/batch/batch.service";
import { BatchType } from "../../../../../@core/enums/batch-type";
import { BatchOrigin } from "@core/enums/batch-origin";
import { PaginatedBatchResponse } from "@core/models/batch/batch-paginated";

@Component({
  selector: "app-all-batches",
  templateUrl: "./all-batches.component.html",
  styleUrls: ["./all-batches.component.scss"]
})
export class AllBatchesComponent implements OnInit, OnDestroy {
  batchesOriginal: Batch[] = [];
  batches: Batch[] = [];
  createBatch = false;
  editBatchesForm: FormGroup;
  editableRows: { [key: number]: boolean } = {};
  loadingBatches = true;
  searchTerm: string = '';

  // Pagination
  pageSize = 25;
  page = 1;
  totalElements = 0;
  totalPages = 0;

  selectedOption: BatchType = BatchType.TEXT;
  unsubscribe$ = new Subject<void>();
  selectedBatchOrigin: string | null = null;
  batchOrigins: { value: string; label: string }[] = [];

  constructor(
    private batchService: BatchService,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.initializeEditBatchesForm(); // Initialize empty form
  }

  ngOnInit(): void {
    this.getBatches();
    this.loadBatchOrigins();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  getBatches(): void {
    this.loadingBatches = true;
    this.batches = [];
    this.batchService.getBatches(this.selectedOption, this.page - 1, this.pageSize, this.selectedBatchOrigin)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response: PaginatedBatchResponse) => {
          this.batches = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.batchesOriginal = [...this.batches];
          this.loadingBatches = false;
          this.updateFormControls();
        },
        error: () => {
          this.loadingBatches = false;
          this.toastr.error("Error getting batch details report");
        }
      });
  }

  private initializeEditBatchesForm(): void {
    this.editBatchesForm = this.fb.group({
      batches: this.fb.array([])
    });
  }

  private updateFormControls(): void {
    const batchesArray = this.editBatchesForm.get('batches') as FormArray;
    
    // Clear existing form controls
    while (batchesArray.length !== 0) {
      batchesArray.removeAt(0);
    }

    // Add new form controls for current page
    this.batches.forEach((batch) => {
      batchesArray.push(this.fb.group({
        batchNo: batch.batchNo,
        source: batch.source,
        description: batch.description,
        linkUrl: batch.linkUrl
      }));
    });
  }

  getFormGroupAt(index: number): FormGroup {
    return (this.editBatchesForm.get('batches') as FormArray).at(index) as FormGroup;
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.getBatches();
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.page = 1;
    this.getBatches();
  }

  filterUpdate($event: KeyboardEvent) {
    const filterValue = ($event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = filterValue;
    this.applyAllFilters();
  }

  applyFilters() {
    this.applyAllFilters();
  }

  private applyAllFilters() {
    this.getBatches();
    //this.updateFormControls();
  }

  createNewBatch() {
    this.createBatch = !this.createBatch;
  }

  reloadBatches() {
    this.getBatches();
    this.createBatch = false;
  }

  confirmDelete(batch: Batch) {
    Swal.fire({
      title: "Delete Batch?",
      text: "Are you sure you want to delete this batch?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      reverseButtons: true,
      confirmButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        this.deleteBatch(batch.batchNo);
      }
    });
  }

  private deleteBatch(batchNo: number): void {
    this.batchService.deleteBatch(batchNo).subscribe(
      () => {
        this.toastr.success("Batch deleted successfully");
        this.getBatches();
      },
      () => {
        this.toastr.error("Error deleting batch");
      }
    );
  }

  activateRowEdit(batch: Batch) {
    this.editableRows[batch.batchNo] = !this.editableRows[batch.batchNo];
  }

  updateBatch(batchIndex: number, batch: Batch) {
    const batchForm = this.getFormGroupAt(batchIndex);

    this.batchService.updateBatch(batchForm.value).subscribe(
      () => {
        batch.source = batchForm.value.source;
        batch.description = batchForm.value.description;
        this.editableRows[batch.batchNo] = false;
        this.toastr.success("Batch updated successfully");
      },
      () => {
        this.toastr.error("Error updating batch");
      }
    );
  }

  updateTable($event) {
    this.selectedOption = $event.nextId;
    this.page = 1;
    this.getBatches();
    this.selectedBatchOrigin = null;
  }

  resetCurrentPage() {
    this.page = 1;
    this.getBatches();
  }

  private loadBatchOrigins(): void {
    this.batchOrigins = [
      { value: BatchOrigin.NORMAL, label: "Normal" },
      { value: BatchOrigin.FEEDBACK, label: "User Feedback" },
      { value: BatchOrigin.RE_REVIEW, label: "Re-review Batches" }
    ];
  }

  protected readonly BatchType = BatchType;
}