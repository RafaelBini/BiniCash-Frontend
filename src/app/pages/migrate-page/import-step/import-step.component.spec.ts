import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStepComponent } from './import-step.component';

describe('ImportStepComponent', () => {
  let component: ImportStepComponent;
  let fixture: ComponentFixture<ImportStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
