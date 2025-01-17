import { Component, OnDestroy, OnInit, TemplateRef } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { AbstractControl, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BatchDetailsSummaryReport } from "../../../../@core/models/batch/batch-details-summary-report";
import { TotalStats } from "../../../../@core/enums/total-stats";
import { SentenceService } from "../../../../@core/services/sentence.service";
import { BatchService } from "../../../../@core/services/batch/batch.service";
import { AuthenticationService } from "../../../auth/service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { BatchType } from "../../../../@core/enums/batch-type";

@Component({
  selector: "app-all-batches-summary-report",
  templateUrl: "./all-batches-summary-report.component.html",
  styleUrls: ["./all-batches-summary-report.component.scss"]
})
export class AllBatchesSummaryReportComponent implements OnInit, OnDestroy {
  batchDetailsReportOriginal: BatchDetailsSummaryReport[] = [];
  batchDetailsReport: BatchDetailsSummaryReport[] = [];
  selectedBatchDetailReport: BatchDetailsSummaryReport;
  confirmDeleteFormGroup: FormGroup;
  submitted: boolean;
  totalStats: TotalStats;
  pageSize = 25;
  page = 1;
  loadingReport = true;
  selectedOption: BatchType = BatchType.TEXT;
  unsubscribe$ = new Subject<void>();

  constructor(
    private router: Router,
    private sentenceservice: SentenceService,
    private batchService: BatchService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    this.getUploadedAndTranslatedSentences();
    this.getBatchDetailsReport();
    this.initializeConfirmDeleteFormGroup();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  private getUploadedAndTranslatedSentences() {
    this.sentenceservice.getTotalUploadedAndTranslatedSentences().subscribe({
      next: (response: TotalStats) => {
        this.totalStats = response;
      },
      error: (error) => {
        this.toastr.error(error.message);
      }
    });
  }

  private getBatchDetailsReport() {
    this.loadingReport = true;
    this.unsubscribe$ = new Subject<void>();
    this.batchDetailsReportOriginal = [];

    this.batchService.getAllBatchDetailsReportSummary(this.selectedOption)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.batchDetailsReportOriginal = response;
          this.batchDetailsReport = [...this.batchDetailsReportOriginal];
          this.loadingReport = false;
        },
        error: (error) => {
          this.loadingReport = false;
          this.toastr.error("Error getting batch details report");
        }
      });
  }

  private initializeConfirmDeleteFormGroup() {
    this.confirmDeleteFormGroup = this.formBuilder.group({
      source: ["", [Validators.required]]
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.confirmDeleteFormGroup.controls;
  }

  get isAdmin() {
    return this.authenticationService.isAdmin;
  }

  get extraColSpan() {
    return this.isAdmin ? 1 : 0;
  }

  back() {
    this.router.navigate(["/user"]);
  }

  openDeleteBatchDetailModal(batchDetailReport: BatchDetailsSummaryReport, deleteBatchDetailModal: TemplateRef<any>) {
    this.selectedBatchDetailReport = batchDetailReport;
    this.modalService.open(deleteBatchDetailModal, { centered: true, size: "sm" });
  }

  closeModal() {
    this.submitted = false;
    this.modalService.dismissAll();
  }

  deleteBatchDetail() {
    this.submitted = true;
    console.log(this.f.source.value);
    if (this.confirmDeleteFormGroup.invalid || this.selectedBatchDetailReport.source !== this.f.source.value) {
      return;
    }

    this.batchService.deleteBatchDetail(this.selectedBatchDetailReport.batchDetailsId).subscribe({
      next: () => {
        this.toastr.success("Batch detail deleted successfully");
        this.batchDetailsReport = this.batchDetailsReport.filter((batchDetailReport) => batchDetailReport.batchDetailsId !== this.selectedBatchDetailReport.batchDetailsId);
        this.closeModal();
      },
      error: () => {
        this.toastr.error("Error deleting batch detail");
      }
    });
  }

  updateTable($event) {
    this.selectedOption = this.mapStringToBatchType($event.nextId);
    this.unsubscribe$.next();
    this.page = 1;
    this.getBatchDetailsReport();
  }

  filterUpdate($event: KeyboardEvent) {
    const filterValue = ($event.target as HTMLInputElement).value;
    this.batchDetailsReport = this.batchDetailsReportOriginal.filter((batchDetailReport) => batchDetailReport.source.toLowerCase().includes(filterValue.toLowerCase()));
  }

  resetCurrentPage() {
    this.page = 1;
  }

  getUniqueSentencesApprovedByExpert(report: BatchDetailsSummaryReport, expert: string): number {
    const uniqueSentences = new Set<string>();
  
    // Check if the expert's name matches the specified one
    if (report.expert === expert) {
      // Assuming sentencesExpertApproved represents the number of sentences approved by the expert
      // Adjust this based on your actual property name
      uniqueSentences.add(report.sentencesExpertApproved.toString()); // Convert to string to ensure uniqueness
    }
  
    return uniqueSentences.size;
  }

  private mapStringToBatchType(option: string): BatchType {
    switch (option.toLowerCase()) {
      case "text":
        return BatchType.TEXT;
      case "audio":
        return BatchType.AUDIO;
      case "text_feedback":
        return BatchType.TEXT_FEEDBACK;
      default:
        return BatchType.TEXT;
    }
  }
}
