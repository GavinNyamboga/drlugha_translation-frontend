import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReReviewBatchesComponent } from './re-review-batches.component';

describe('ReReviewBatchesComponent', () => {
  let component: ReReviewBatchesComponent;
  let fixture: ComponentFixture<ReReviewBatchesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReReviewBatchesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReReviewBatchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
