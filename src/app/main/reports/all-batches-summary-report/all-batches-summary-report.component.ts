import { Component, ContentChild, OnDestroy, OnInit, TemplateRef } from "@angular/core";
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
import { DownloadHelperService } from "@core/services/download-helper/download-helper.service";
import { HttpEvent, HttpEventType } from "@angular/common/http";
import { DownloadAudioFilesComponent } from "@core/components/download-audio-helper/components/download-audio-files/download-audio-files.component";
import { LanguageService } from "@core/services/language/language.service";
import { Language } from "@core/models/language/language";
import { BatchStatus } from "@core/enums/batch-status";

@Component({
  selector: "app-all-batches-summary-report",
  templateUrl: "./all-batches-summary-report.component.html",
  styleUrls: ["./all-batches-summary-report.component.scss"]
})
export class AllBatchesSummaryReportComponent extends DownloadAudioFilesComponent implements OnInit, OnDestroy {
  @ContentChild("progressChart", { static: false }) progressChart;
  batchDetailsReportOriginal: BatchDetailsSummaryReport[] = [];
  batchDetailsReport: BatchDetailsSummaryReport[] = [];
  selectedBatchDetailReport: BatchDetailsSummaryReport;
  confirmDeleteFormGroup: FormGroup;
  submitted: boolean;
  totalStats: TotalStats;
  pageSize = 25;
  page = 1;
  totalElements: number = 25;
  totalPages: number = 1;
  loadingReport = true;
  selectedOption: BatchType = BatchType.TEXT;
  unsubscribe$ = new Subject<void>();
  selectedBatches: Set<number> = new Set();
  allSelected: boolean = false;
  downloadInProgress = false;
  languages: Language[] = [];
  selectedStatus: string | null = null;
  selectedLanguage: string | null = null;
  languageId: number | null = null;
  batchStatuses: { value: BatchStatus; label: string }[] = [];

  constructor(
    private router: Router,
    private sentenceservice: SentenceService,
    private batchService: BatchService,
    protected modalService: NgbModal,
    private formBuilder: FormBuilder,
    protected toastr: ToastrService,
    private authenticationService: AuthenticationService,
    protected downloadHelper: DownloadHelperService,
    private languageService: LanguageService,

  ) {
    super(downloadHelper, modalService, toastr);
  }

  ngOnInit(): void {
    this.getUploadedAndTranslatedSentences();
    this.getBatchDetailsReport();
    this.initializeConfirmDeleteFormGroup();
    this.getLanguages();
    this.loadStatuses();
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  onPageChange(newPage: number) {
    this.page = newPage;
    this.loadingReport = true;
    this.batchDetailsReport = [];
    this.batchService.getAllBatchDetailsReportSummary(this.selectedOption, this.page - 1, this.pageSize, this.languageId, this.selectedStatus)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.batchDetailsReport = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.loadingReport = false;

          // Reset selection when page changes
          this.selectedBatches.clear();
          this.allSelected = false;
        },
        error: (error) => {
          this.loadingReport = false;
          this.toastr.error("Error getting batch details report");
        }
      });
  }

  onPageSizeChange(newSize: number) {
    this.pageSize = newSize;
    this.page = 1;
    this.loadingReport = true;
    this.batchDetailsReport = [];

    this.batchService.getAllBatchDetailsReportSummary(this.selectedOption, 0, this.pageSize, this.languageId, this.selectedStatus)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.batchDetailsReport = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.loadingReport = false;

          // Reset selection when page size changes
          this.selectedBatches.clear();
          this.allSelected = false;
        },
        error: (error) => {
          this.loadingReport = false;
          this.toastr.error("Error getting batch details report");
        }
      });
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

    this.batchService.getAllBatchDetailsReportSummary(this.selectedOption, this.page - 1, this.pageSize, this.languageId, this.selectedStatus)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.batchDetailsReport = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.loadingReport = false;

          this.selectedBatches.clear();
          this.allSelected = false;
        },
        error: (error) => {
          this.loadingReport = false;
          this.toastr.error("Error getting batch details report");
        }
      });
  }

  toggleSelectAll() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = Math.min(this.page * this.pageSize, this.batchDetailsReport.length);

    if (this.allSelected) {
      // Deselect batches for the current page
      for (let i = startIndex; i < endIndex; i++) {
        this.selectedBatches.delete(this.batchDetailsReport[i].batchDetailsId);
      }
    } else {
      // Select batches for the current page
      for (let i = startIndex; i < endIndex; i++) {
        this.selectedBatches.add(this.batchDetailsReport[i].batchDetailsId);
      }
    }
    this.allSelected = !this.allSelected;
  }

  toggleBatchSelection(batchId: number) {
    if (this.selectedBatches.has(batchId)) {
      this.selectedBatches.delete(batchId);
      this.allSelected = false;
    } else {
      this.selectedBatches.add(batchId);
      if (this.selectedBatches.size === this.batchDetailsReport.length) {
        this.allSelected = true;
      }
    }
  }


  open(downloadModal) {
    this.openDownloadModal(downloadModal, this.selectedBatches);
  }

  protected openDownloadModal(downloadModal, batchDetailIds: Set<number>) {
    this.modalService.open(downloadModal, {
      size: "sm",
      centered: true,
      backdrop: "static",
      beforeDismiss: async () => {
        return await this.confirmCancel();
      }
    });

    this.downloadInProgress = true;
    this.downloadHelper.downloadMultipleFilesAsZip(batchDetailIds, false)
      .subscribe(
        (event: HttpEvent<Blob>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            const progress = Math.round((100 * event.loaded) / event.total);
            this.downloadHelper.totalProgress = progress;
          } else if (event.type === HttpEventType.Response) {
            const blob = new Blob([event.body], { type: 'application/zip' });

            let fileName = 'audio_and_sentences_group_batch.zip'; // default filename

            this.downloadFile(blob, fileName);
            this.downloadInProgress = false;
            this.startAutoClose();
          }
        },
        (error) => {
          this.toastr.error("Error downloading audio files");
          this.downloadInProgress = false;
        }
      );
  }

  protected downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  protected startAutoClose() {
    this.downloadHelper.autoCloseProgress = 100;
    const interval = setInterval(() => {
      if (this.downloadHelper.autoCloseProgress > 0) {
        this.downloadHelper.autoCloseProgress--;
      } else {
        setTimeout(() => {
          this.modalService.dismissAll();
          this.downloadHelper.autoCloseProgress = null;
          clearInterval(interval);
        }, 500);
      }
    }, 50);
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
    this.batchDetailsReport = [];

    this.selectedStatus = null;
    this.selectedLanguage = null;

    this.getBatchDetailsReport();
    this.loadStatuses();
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

  applyFilters() {
    this.loadingReport = true;
    this.batchDetailsReport = [];
    this.page = 1; //reset page


    this.batchService.getAllBatchDetailsReportSummary(
      this.selectedOption,
      this.page - 1,
      this.pageSize,
      this.languageId,
      this.selectedStatus
    )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.batchDetailsReport = response.content;
          this.totalElements = response.totalElements;
          this.totalPages = response.totalPages;
          this.loadingReport = false;
        },
        error: () => {
          this.loadingReport = false;
          this.toastr.error("Error applying filters.");
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

  private loadStatuses(): void {
    // Clear the previous statuses to avoid duplicates
    this.batchStatuses = [];

    if (this.selectedOption === BatchType.AUDIO) {
      this.batchStatuses = [
        { value: BatchStatus.ASSIGNED_RECORDER, label: "Assigned Transcriber" },
        { value: BatchStatus.TRANSCRIBED, label: "Transcribed" },
        { value: BatchStatus.ASSIGNED_AUDIO_VERIFIER, label: "Audio Assigned Verifier" },
        { value: BatchStatus.AUDIO_VERIFIED, label: "Audio Reviewed" }
      ];
    } else if (this.selectedOption === BatchType.TEXT) {
      this.batchStatuses = [
        { value: BatchStatus.ASSIGNED_TRANSLATOR, label: "Assigned Translator" },
        { value: BatchStatus.TRANSLATED, label: "Translated" },
        { value: BatchStatus.TRANSLATION_VERIFIED, label: "Moderator Reviewed" },
        { value: BatchStatus.SECOND_VERIFICATION_DONE, label: "Expert Reviewed" },
        { value: BatchStatus.ASSIGNED_RECORDER, label: "Audio Recorder Assigned" },
        { value: BatchStatus.RECORDED, label: "Audio recorded" },
        { value: BatchStatus.ASSIGNED_AUDIO_VERIFIER, label: "Audio Assigned Verifier" },
        { value: BatchStatus.AUDIO_VERIFIED, label: "Audio Verified" },
        { value: BatchStatus.ASSIGNED_EXPERT_AUDIO_REVIEWER, label: "Assigned Audio Expert Reviewer" },
        { value: BatchStatus.EXPERT_AUDIO_VERIFIED, label: "Completed" }
      ];
    }
  }

}
