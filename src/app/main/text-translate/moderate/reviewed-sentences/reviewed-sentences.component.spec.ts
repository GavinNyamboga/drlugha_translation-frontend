import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewedSentencesComponent } from './reviewed-sentences.component';

describe('ReviewedSentencesComponent', () => {
  let component: ReviewedSentencesComponent;
  let fixture: ComponentFixture<ReviewedSentencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReviewedSentencesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewedSentencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
