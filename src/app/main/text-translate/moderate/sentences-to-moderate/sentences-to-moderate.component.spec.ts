import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SentencesToModerateComponent } from './sentences-to-moderate.component';

describe('SentencesToModerateComponent', () => {
  let component: SentencesToModerateComponent;
  let fixture: ComponentFixture<SentencesToModerateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SentencesToModerateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SentencesToModerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
