import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishStepComponent } from './finish-step.component';

describe('FinishStepComponent', () => {
  let component: FinishStepComponent;
  let fixture: ComponentFixture<FinishStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinishStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
