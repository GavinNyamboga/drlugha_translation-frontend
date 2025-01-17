import { Injectable } from "@angular/core";
import { HttpClient, HttpEventType, HttpResponse } from "@angular/common/http";
import { BehaviorSubject } from "rxjs";
import { environment } from "../../../environments/environment";
import { saveAs } from "file-saver";

@Injectable({
  providedIn: "root"
})
export class DownloadHelperService {
  private _totalProgress$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  private _autoCloseProgress$: BehaviorSubject<number> = new BehaviorSubject<number>(null);

  constructor(private httpClient: HttpClient) {}

  downloadAudioFilesAsZip(batchDetailsId: number) {
    this.totalProgress = 0;
    return this.httpClient.get(`${environment.apiUrl}voice/download?batchDetailsId=${batchDetailsId}`, {
      responseType: "blob",
      reportProgress: true,
      observe: "events"
    });
  }

  get totalProgress$() {
    return this._totalProgress$.asObservable();
  }

  set totalProgress(value: number) {
    this._totalProgress$.next(value);
  }

  get autoCloseProgress$() {
    return this._autoCloseProgress$.asObservable();
  }

  set autoCloseProgress(value: number) {
    this._autoCloseProgress$.next(value);
  }

  handleDownloadResponse(response: any, batchDetailsId: number) {
    if (response.type === HttpEventType.DownloadProgress) {
      const progress = Math.round((100 * response.loaded) / response.total);
      this.totalProgress = progress;
    } else if (response instanceof HttpResponse) {
      if (!response.body || response.body.size === 0) {
        console.error("Received empty or invalid ZIP file.");
        // Handle empty or invalid ZIP file scenario (notify user, log, etc.)
        return;
      }

      const contentDispositionHeader = response.headers.get('Content-Disposition');
      let fileName = `batch_${batchDetailsId}_audio.zip`;
      if (contentDispositionHeader) {
        const fileNameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
        const matches = fileNameRegex.exec(contentDispositionHeader);
        if (matches != null && matches[1]) {
          fileName = matches[1].replace(/['"]/g, '');
        }
      }
      const zipBlob = new Blob([response.body], { type: "application/zip" });
      this.downloadZipFile(zipBlob, fileName);
    }
  }

  downloadZipFile(blob: Blob, fileName: string) {
    saveAs(blob, fileName);
  }
}
