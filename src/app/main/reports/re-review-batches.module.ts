import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReReviewBatchesComponent } from './re-review-batches/re-review-batches.component';

@NgModule({
  declarations: [
    ReReviewBatchesComponent
  ],
  imports: [
    CommonModule
    // Additional imports if needed
  ],
  exports: [
    ReReviewBatchesComponent
  ]
})
export class ReReviewBatchesModule { }
