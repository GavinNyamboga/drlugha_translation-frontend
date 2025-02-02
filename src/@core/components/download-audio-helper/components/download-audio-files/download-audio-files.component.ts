import { Component, Input, ViewEncapsulation } from "@angular/core";
import { DownloadHelperService } from "../../../../services/download-helper/download-helper.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import { HttpEventType, HttpResponse } from "@angular/common/http";
import { saveAs } from "file-saver";
import { BatchDetailReport } from "../../../../models/batch/batch-detail-report";
import { finalize } from "rxjs/operators";

@Component({
  selector: "app-download-audio-files",
  templateUrl: "./download-audio-files.component.html",
  styleUrls: ["./download-audio-files.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DownloadAudioFilesComponent {
  @Input() modal: any;
  @Input() totalFiles: number;

  totalDownloadProgress$ = this.downloadHelper.totalProgress$;
  totalDownloadProgress = 0;
  downloadInProgress = false;
  autoCloseProgress$ = this.downloadHelper.autoCloseProgress$;

  constructor(
    protected downloadHelper: DownloadHelperService,
    protected modalService: NgbModal,
    protected toastr: ToastrService
  ) {
    this.totalDownloadProgress$.subscribe((progress) => {
      this.totalDownloadProgress = progress;
    });
  }

  protected openModal(downloadModal, batchDetailReport: BatchDetailReport, excelOnly: boolean) {
    this.modalService.open(downloadModal, {
      size: "sm",
      centered: true,
      backdrop: "static",
      beforeDismiss: async () => {
        return await this.confirmCancel();
      },
    });

    this.downloadInProgress = true;
    this.downloadHelper
      .downloadMultipleFilesAsZip(new Set([batchDetailReport.batchDetailsId]), excelOnly)
      .pipe(
        finalize(() => {
          this.downloadInProgress = false;
          this.startAutoClose();
        })
      )
      .subscribe(
        (response) => {
          if (response.type === HttpEventType.DownloadProgress) {
            const progress = Math.round(
              (100 * response.loaded) / response.total
            );
            this.downloadHelper.totalProgress = progress;
          } else if (response instanceof HttpResponse) {
            const zipBlob = new Blob([response.body], {
              type: "application/zip",
            });
            const contentDispositionHeader: string = response.headers.get(
              "Content-Disposition"
            );
            const fileName = this.extractFilename(contentDispositionHeader);

            this.downloadFile(zipBlob, fileName);
            this.toastr.success("Audio files downloaded successfully");
          }
        },
        (error) => {
          this.toastr.error("Error downloading audio files");
        }
      );
  }


  protected openDownloadModal(downloadModal, batchDetailIds: Set<number>, excelOnly: boolean) {
    this.modalService.open(downloadModal, {
      size: "sm",
      centered: true,
      backdrop: "static",
      beforeDismiss: async () => {
        return await this.confirmCancel();
      },
    });
    this.downloadInProgress = true;
    this.downloadHelper
      .downloadMultipleFilesAsZip(batchDetailIds, excelOnly)
      .pipe(
        finalize(() => {
          this.downloadInProgress = false;
          this.startAutoClose();
        })
      )
      .subscribe(
        (response) => {
          if (response.type === HttpEventType.DownloadProgress) {
            const progress = Math.round(
              (100 * response.loaded) / response.total
            );
            this.downloadHelper.totalProgress = progress;
          } else if (response instanceof HttpResponse) {
            const zipBlob = new Blob([response.body], {
              type: "application/zip",
            });
            const contentDispositionHeader: string = response.headers.get(
              "Content-Disposition"
            );
            const fileName = this.extractFilename(contentDispositionHeader);

            this.downloadFile(zipBlob, fileName);
            this.toastr.success("Audio files downloaded successfully");
          }
        },
        (error) => {
          this.toastr.error("Error downloading audio files");
        }
      );
  }


  protected extractFilename(contentDispositionHeader: string): string {
    const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
    const matches = filenameRegex.exec(contentDispositionHeader);
    if (matches != null && matches[1]) {
      return matches[1].replace(/['"]/g, "");
    }
    return "audio-files.zip"; // Default filename if extraction fails
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

  protected downloadFile(blob: Blob, fileName: string) {
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.download = fileName;
    anchor.href = url;
    anchor.click();
    window.URL.revokeObjectURL(url);
  }

  protected startAutoClose() {
    // auto close after 5 seconds;
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
