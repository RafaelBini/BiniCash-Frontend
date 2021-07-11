import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitStepComponent } from './debit-step.component';

describe('DebitStepComponent', () => {
  let component: DebitStepComponent;
  let fixture: ComponentFixture<DebitStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
