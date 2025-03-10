import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LanguageStatisticsComponent } from './language-statistics.component';

describe('LanguageStatisticsComponent', () => {
  let component: LanguageStatisticsComponent;
  let fixture: ComponentFixture<LanguageStatisticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LanguageStatisticsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LanguageStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
