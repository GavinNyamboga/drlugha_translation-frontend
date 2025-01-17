import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbNavModule, NgbPaginationModule, NgbProgressbarModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgSelectModule } from '@ng-select/ng-select';
import { CoreDirectivesModule } from '../../../@core/directives/directives';
import { AudioPlayerModule } from '../../../@core/components/audio-player/audio-player.module';
import { DownloadAudioHelperModule } from '../../../@core/components/download-audio-helper/download-audio-helper.module';
import { CoreCommonModule } from '../../../@core/common.module';

import { ReportsComponent } from './reports.component';
import { BatchDetailsReportComponent } from './batch-details-report/batch-details-report.component';
import { AllBatchesSummaryReportComponent } from './all-batches-summary-report/all-batches-summary-report.component';
import { ReReviewBatchesComponent } from './re-review-batches/re-review-batches.component';
import { BatchDetailsStatisticsComponent } from './components/batch-details-statistics/batch-details-statistics.component';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    children: [
      {
        path: 'all',
        component: AllBatchesSummaryReportComponent
      },
    //   {
    //     path: 're-review-batches',
    //     component: ReReviewBatchesComponent
    //   },
      {
        path: 'batch-details/:batchDetailsId',
        component: BatchDetailsReportComponent
      },
      {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  declarations: [
    ReportsComponent,
    BatchDetailsReportComponent,
    AllBatchesSummaryReportComponent,
    ReReviewBatchesComponent,
    BatchDetailsStatisticsComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes), // Define routes here
    CoreDirectivesModule,
    NgbProgressbarModule,
    ReactiveFormsModule,
    AudioPlayerModule,
    NgbPaginationModule,
    NgApexchartsModule,
    DownloadAudioHelperModule,
    NgbNavModule,
    CoreCommonModule,
    NgSelectModule
  ]
})
export class ReportsModule { }
