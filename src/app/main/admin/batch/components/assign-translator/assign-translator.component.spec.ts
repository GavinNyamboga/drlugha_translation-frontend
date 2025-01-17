import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignTranslatorComponent } from './assign-translator.component';

describe('AssignTranslatorComponent', () => {
  let component: AssignTranslatorComponent;
  let fixture: ComponentFixture<AssignTranslatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignTranslatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignTranslatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
