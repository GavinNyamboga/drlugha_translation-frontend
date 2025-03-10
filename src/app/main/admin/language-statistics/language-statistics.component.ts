import { Component, OnDestroy, OnInit } from '@angular/core';
import { LanguageStatisticsService } from './services/language-statistics.service';
import { takeUntil } from 'rxjs/operators';
import { LanguageStatics } from './model/language-statistics';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';


interface BatchTypeStatistic {
  batchType: string;
  totalBatchSentencesOrAudios: number;
  totalTranslated: number;
  totalTextApproved: number;
  totalTextRejected: number;
  totalTextExpertApproved: number;
  totalTextExpertRejected: number;
  totalAudioRecorded: number;
  totalAudioApproved: number;
  totalAudioRejected: number;
  totalAudioExpertApproved: number;
  totalExpertAudioRejected: number;
}

interface Language {
  languageName: string;
  languageId: number;
  totalBatchSentencesOrAudios: number | null;
  totalTranslated: number | null;
  totalTextApproved: number | null;
  totalTextRejected: number | null;
  totalTextExpertApproved: number | null;
  totalTextExpertRejected: number | null;
  totalAudioRecorded: number | null;
  totalAudioApproved: number | null;
  totalAudioRejected: number | null;
  totalAudioExpertApproved: number | null;
  totalExpertAudioRejected: number | null;
  batchCount: number | null;
  batchType: string | null;
  batches: any | null;
  batchTypeStatistics: BatchTypeStatistic[];
}


@Component({
  selector: 'app-language-statistics',
  templateUrl: './language-statistics.component.html',
  styleUrls: ['./language-statistics.component.scss']
})
export class LanguageStatisticsComponent implements OnInit, OnDestroy {

  languages: LanguageStatics[] = [];
  loadingStats = true;
  unsubscribe$ = new Subject<void>();

  constructor(private languageStatisticsService: LanguageStatisticsService,
    private toastr: ToastrService) {

  }

  ngOnInit(): void {
    // In a real application, you would get this data from a service
    this.languageStatisticsService.getLanguageStatistics()
    .pipe(takeUntil(this.unsubscribe$))
    .subscribe({
      next: (response: LanguageStatics[]) => {
        this.languages = response; // Directly assign the array
        this.loadingStats = false;
      },
      error: () => {
        this.loadingStats = false;
        this.toastr.error("Error getting batch details report");
      }
    });
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }


//     this.languages = [
//   {
//     "languageName": "Kikuyu",
//     "languageId": 1,
//     "totalBatchSentencesOrAudios": null,
//     "totalTranslated": null,
//     "totalTextApproved": null,
//     "totalTextRejected": null,
//     "totalTextExpertApproved": null,
//     "totalTextExpertRejected": null,
//     "totalAudioRecorded": null,
//     "totalAudioApproved": null,
//     "totalAudioRejected": null,
//     "totalAudioExpertApproved": null,
//     "totalExpertAudioRejected": null,
//     "batchCount": null,
//     "batchType": null,
//     "batches": null,
//     "batchTypeStatistics": [
//       {
//         "batchType": "AUDIO",
//         "totalBatchSentencesOrAudios": 20000,
//         "totalTranslated": 0,
//         "totalTextApproved": 0,
//         "totalTextRejected": 0,
//         "totalTextExpertApproved": 0,
//         "totalTextExpertRejected": 0,
//         "totalAudioRecorded": 0,
//         "totalAudioApproved": 0,
//         "totalAudioRejected": 0,
//         "totalAudioExpertApproved": 0,
//         "totalExpertAudioRejected": 0
//       },
//       {
//         "batchType": "TEXT",
//         "totalBatchSentencesOrAudios": 377251,
//         "totalTranslated": 103666,
//         "totalTextApproved": 102290,
//         "totalTextRejected": 976,
//         "totalTextExpertApproved": 8784,
//         "totalTextExpertRejected": 335,
//         "totalAudioRecorded": 71332,
//         "totalAudioApproved": 516,
//         "totalAudioRejected": 8,
//         "totalAudioExpertApproved": 2,
//         "totalExpertAudioRejected": 0
//       }
//     ]
//   },
//   {
//     "languageName": "Swahili",
//     "languageId": 2,
//     "totalBatchSentencesOrAudios": null,
//     "totalTranslated": null,
//     "totalTextApproved": null,
//     "totalTextRejected": null,
//     "totalTextExpertApproved": null,
//     "totalTextExpertRejected": null,
//     "totalAudioRecorded": null,
//     "totalAudioApproved": null,
//     "totalAudioRejected": null,
//     "totalAudioExpertApproved": null,
//     "totalExpertAudioRejected": null,
//     "batchCount": null,
//     "batchType": null,
//     "batches": null,
//     "batchTypeStatistics": [
//       {
//         "batchType": "AUDIO",
//         "totalBatchSentencesOrAudios": 25000,
//         "totalTranslated": 0,
//         "totalTextApproved": 0,
//         "totalTextRejected": 0,
//         "totalTextExpertApproved": 0,
//         "totalTextExpertRejected": 0,
//         "totalAudioRecorded": 5000,
//         "totalAudioApproved": 4500,
//         "totalAudioRejected": 200,
//         "totalAudioExpertApproved": 2500,
//         "totalExpertAudioRejected": 50
//       },
//       {
//         "batchType": "TEXT",
//         "totalBatchSentencesOrAudios": 420000,
//         "totalTranslated": 185000,
//         "totalTextApproved": 175000,
//         "totalTextRejected": 2500,
//         "totalTextExpertApproved": 12000,
//         "totalTextExpertRejected": 500,
//         "totalAudioRecorded": 95000,
//         "totalAudioApproved": 85000,
//         "totalAudioRejected": 1000,
//         "totalAudioExpertApproved": 40000,
//         "totalExpertAudioRejected": 800
//       }
//     ]
//   },
//   {
//     "languageName": "Yoruba",
//     "languageId": 3,
//     "totalBatchSentencesOrAudios": null,
//     "totalTranslated": null,
//     "totalTextApproved": null,
//     "totalTextRejected": null,
//     "totalTextExpertApproved": null,
//     "totalTextExpertRejected": null,
//     "totalAudioRecorded": null,
//     "totalAudioApproved": null,
//     "totalAudioRejected": null,
//     "totalAudioExpertApproved": null,
//     "totalExpertAudioRejected": null,
//     "batchCount": null,
//     "batchType": null,
//     "batches": null,
//     "batchTypeStatistics": [
//       {
//         "batchType": "AUDIO",
//         "totalBatchSentencesOrAudios": 18000,
//         "totalTranslated": 0,
//         "totalTextApproved": 0,
//         "totalTextRejected": 0,
//         "totalTextExpertApproved": 0,
//         "totalTextExpertRejected": 0,
//         "totalAudioRecorded": 3000,
//         "totalAudioApproved": 2800,
//         "totalAudioRejected": 150,
//         "totalAudioExpertApproved": 1200,
//         "totalExpertAudioRejected": 30
//       },
//       {
//         "batchType": "TEXT",
//         "totalBatchSentencesOrAudios": 350000,
//         "totalTranslated": 120000,
//         "totalTextApproved": 115000,
//         "totalTextRejected": 1800,
//         "totalTextExpertApproved": 9500,
//         "totalTextExpertRejected": 420,
//         "totalAudioRecorded": 60000,
//         "totalAudioApproved": 55000,
//         "totalAudioRejected": 750,
//         "totalAudioExpertApproved": 25000,
//         "totalExpertAudioRejected": 500
//       }
//     ]
//   },
//   {
//     "languageName": "Hausa",
//     "languageId": 4,
//     "totalBatchSentencesOrAudios": null,
//     "totalTranslated": null,
//     "totalTextApproved": null,
//     "totalTextRejected": null,
//     "totalTextExpertApproved": null,
//     "totalTextExpertRejected": null,
//     "totalAudioRecorded": null,
//     "totalAudioApproved": null,
//     "totalAudioRejected": null,
//     "totalAudioExpertApproved": null,
//     "totalExpertAudioRejected": null,
//     "batchCount": null,
//     "batchType": null,
//     "batches": null,
//     "batchTypeStatistics": [
//       {
//         "batchType": "AUDIO",
//         "totalBatchSentencesOrAudios": 22000,
//         "totalTranslated": 0,
//         "totalTextApproved": 0,
//         "totalTextRejected": 0,
//         "totalTextExpertApproved": 0,
//         "totalTextExpertRejected": 0,
//         "totalAudioRecorded": 8000,
//         "totalAudioApproved": 7500,
//         "totalAudioRejected": 300,
//         "totalAudioExpertApproved": 3500,
//         "totalExpertAudioRejected": 120
//       },
//       {
//         "batchType": "TEXT",
//         "totalBatchSentencesOrAudios": 400000,
//         "totalTranslated": 160000,
//         "totalTextApproved": 155000,
//         "totalTextRejected": 2200,
//         "totalTextExpertApproved": 10800,
//         "totalTextExpertRejected": 480,
//         "totalAudioRecorded": 80000,
//         "totalAudioApproved": 75000,
//         "totalAudioRejected": 900,
//         "totalAudioExpertApproved": 35000,
//         "totalExpertAudioRejected": 650
//       }
//     ]
//   }
// ];

  

// Helper function to calculate percentages
calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return (value / total) * 100;
}

// Helper function to format numbers with commas
formatNumber(num: number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

}
