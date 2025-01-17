import { Component, OnDestroy } from "@angular/core";
import { LanguageService } from "../../../@core/services/language/language.service";
import { Observable, of, Subject } from "rxjs";
import { Language } from "../../../@core/models/language/language";
import { catchError, finalize, map, takeUntil } from "rxjs/operators";
import { FormBuilder, FormGroup } from "@angular/forms";
import { CompletedSentence } from "../../../@core/models/sentence/completed-sentence";
import { SentenceService } from "../../../@core/services/sentence.service";
import { DownloadExcelService } from "../../../@core/services/excel/download-excel.service";
import { DownloadHelperService } from "../../../@core/services/download-helper/download-helper.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";
import {
  DownloadAudioFilesComponent
} from "../../../@core/components/download-audio-helper/components/download-audio-files/download-audio-files.component";

@Component({
  selector: "app-language-sentences",
  templateUrl: "./language-sentences.component.html",
})
export class LanguageSentencesComponent extends DownloadAudioFilesComponent implements OnDestroy {
  destroy$ = new Subject<boolean>();
  languages$: Observable<Language[]> = this.languageService.getLanguages()
    .pipe(catchError(() => of([])));
  languageSentences: CompletedSentence[] = [];
  selectedLanguage: string;
  languageForm: FormGroup;
  loadingSentences = false;
  page = 1;
  pageSize = 50;

  constructor(
    private languageService: LanguageService,
    private sentenceService: SentenceService,
    private formBuilder: FormBuilder,
    private downloadExcelService: DownloadExcelService,
    protected downloadHelper: DownloadHelperService,
    protected modalService: NgbModal,
    protected toastr: ToastrService,) {
    super(downloadHelper, modalService, toastr);
  }

  ngOnInit(): void {
    this.languageForm = this.formBuilder.group({
      language: [null]
    });

    this.onLanguageChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  onLanguageChange() {
    this.languageForm.get("language").valueChanges.subscribe((language) => {
      if (!language) return;

      this.loadingSentences = true;
      this.languageSentences = [];
      this.sentenceService.getExpertReviewedSentencesPerLanguage(language)
        .pipe(
          map((response) => {
            this.selectedLanguage = response.language;
            // Filter out duplicates based on a unique identifier
            const uniqueSentences = this.removeDuplicates(response.expertReviewedSentences, 'sentenceId');
            return uniqueSentences;
          }),
          takeUntil(this.destroy$),
          catchError(() => of([])),
          finalize(() => this.loadingSentences = false)
        ).subscribe((sentences) => {
          this.languageSentences = sentences;
        });
    });
  }

  exportToExcel() {
    if (!this.selectedLanguage || this.languageSentences.length === 0)
      return;

    const dataToExport = this.languageSentences.map((sentence, index) => {
      return {
        "#": index + 1,
        "Sentence": sentence.sentenceText,
        "Translated Sentence": sentence.translatedText,
      };
    });

    this.downloadExcelService.downloadExcelFileFromJson(dataToExport, "Sentences-Report-" + this.selectedLanguage);
  }

  open(downloadModal: any) {
    // this.openModal(downloadModal, this.languageSentences);
  }

  removeDuplicates(arr: any[], key: string): any[] {
    return arr.reduce((unique, item) => {
      const existingItem = unique.find(i => i[key] === item[key]);
      if (!existingItem) {
        unique.push(item);
      }
      return unique;
    }, []);
  }
}
