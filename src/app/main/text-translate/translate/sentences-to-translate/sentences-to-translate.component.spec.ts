import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentencesToTranslateComponent } from './sentences-to-translate.component';

describe('SentencesToTranslateComponent', () => {
  let component: SentencesToTranslateComponent;
  let fixture: ComponentFixture<SentencesToTranslateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentencesToTranslateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentencesToTranslateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
