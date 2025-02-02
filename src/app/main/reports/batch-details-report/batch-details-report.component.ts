import { Component, ContentChild, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DownloadAudioFilesComponent } from "../../../../@core/components/download-audio-helper/components/download-audio-files/download-audio-files.component";
import { BatchDetailReport } from "../../../../@core/models/batch/batch-detail-report";
import { BatchService } from "../../../../@core/services/batch/batch.service";
import { DownloadHelperService } from "../../../../@core/services/download-helper/download-helper.service";
import { DownloadExcelService } from "../../../../@core/services/excel/download-excel.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { BatchType } from "@core/enums/batch-type";
import { HttpEvent, HttpEventType } from "@angular/common/http";

@Component({
  selector: "app-batch-details-report",
  templateUrl: "./batch-details-report.component.html",
  styleUrls: ["./batch-details-report.component.scss"],
})
export class BatchDetailsReportComponent
  extends DownloadAudioFilesComponent
  implements OnInit, OnDestroy {
  @ContentChild("progressChart", { static: false }) progressChart;
  private batchDetailsId: number;
  batchDetailsReport: BatchDetailReport;
  pageSize = 50;
  page = 1;
  maxBatchSize = 500; // Maximum batch size
  downloadInProgress = false;

  constructor(
    private batchService: BatchService,
    private activatedRoute: ActivatedRoute,
    protected toastr: ToastrService,
    private downloadExcelService: DownloadExcelService,
    protected downloadHelper: DownloadHelperService,
    protected modalService: NgbModal
  ) {
    super(downloadHelper, modalService, toastr);
  }

  ngOnInit(): void {
    this.batchDetailsId = this.activatedRoute.snapshot.params.batchDetailsId;
    this.getBatchDetailsReport();
  }

  ngOnDestroy() { }

  private getBatchDetailsReport() {
    this.batchService
      .getReportPerBatchDetailsId(this.batchDetailsId)
      .subscribe({
        next: (response) => {
          // Cap batch size
          console.log('Batch Details Report Response:', response);
          if (response.completedSentences.length > this.maxBatchSize) {
            response.completedSentences = response.completedSentences.slice(0, this.maxBatchSize);
            this.toastr.warning("Batch size exceeds maximum limit. Only first 500 sentences will be shown.");
          }

          // Check for duplicates based on audio URL
          //const uniqueSentences = this.removeDuplicateAudioURLs(response.completedSentences);
          this.batchDetailsReport = { ...response, completedSentences: response.completedSentences };
        },
        error: (error) => {
          this.toastr.error("Error getting batch details report");
        },
      });
  }

  private removeDuplicateAudioURLs(sentences: any[]) {
    const uniqueSentences = [];
    const seen = new Set();
    for (const sentence of sentences) {
      if (!seen.has(sentence.audioUrl)) {
        seen.add(sentence.audioUrl);
        uniqueSentences.push(sentence);
      }
    }
    return uniqueSentences;
  }

  exportToExcel(downloadModal) {
    this.open(downloadModal, true);
  }

  // exportToExcel() {
  //   const dataToExport = this.batchDetailsReport.completedSentences
  //     // Filter out sentences with "NA" values
  //     .filter(sentence => sentence.sentenceText !== 'NA' && sentence.translatedText !== 'NA')
  //     .map((sentence, index) => {
  //       console.log('Sentence being exported:', sentence); // Add this line to debug
  //       return {
  //         "#": index + 1,
  //         "Sentence": sentence.sentenceText,
  //         "Translated Sentence": sentence.translatedText,
  //         "Audio File Name": sentence.audioUrl,
  //         "Recorded By (Speaker ID)": sentence.recordedBy ? sentence.recordedBy.voiceId : 'Unknown',
  //       };
  //     });

  //   const fileName = `Batch-${this.batchDetailsReport.batchDetailsId}.xlsx`;

  //   this.downloadExcelService.downloadExcelFileFromJson(dataToExport, fileName);
  // }

  open(downloadModal, excelOnly) {
    this.openModal(downloadModal, this.batchDetailsReport, excelOnly);
  }

  get totalAudioFiles() {
    const uniqueAudioUrls = new Set();
    this.batchDetailsReport.completedSentences.forEach((sentence) => {
      if (sentence.audioUrl && !uniqueAudioUrls.has(sentence.audioUrl)) {
        uniqueAudioUrls.add(sentence.audioUrl);
      }
    });
    return uniqueAudioUrls.size;
  }

  protected readonly BatchType = BatchType;

  protected openModal(downloadModal, batchDetailReport: BatchDetailReport, excelOnly: boolean) {
    if (!excelOnly) {
      this.modalService.open(downloadModal, {
        size: "sm",
        centered: true,
        backdrop: "static",
        beforeDismiss: async () => {
          return await this.confirmCancel();
        }
      });
    }

    this.downloadInProgress = true;

    this.downloadHelper.downloadMultipleFilesAsZip(new Set([batchDetailReport.batchDetailsId]), excelOnly)
      .subscribe(
        (event: HttpEvent<Blob>) => {
          if (event.type === HttpEventType.DownloadProgress) {
            const progress = Math.round((100 * event.loaded) / event.total);
            this.downloadHelper.totalProgress = progress;
          } else if (event.type === HttpEventType.Response) {
            const blob = new Blob([event.body], { type: excelOnly ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/zip' });

            const fileName = `batch_${batchDetailReport.batchDetailsId}_${batchDetailReport.language}` + (excelOnly ? `.xlsx` : `.zip`);
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

  protected async confirmCancel() {
    return new Promise<boolean>((resolve, reject) => {
      if (this.downloadInProgress) {
        reject();
      } else {
        resolve(true);
      }
    });
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
}
