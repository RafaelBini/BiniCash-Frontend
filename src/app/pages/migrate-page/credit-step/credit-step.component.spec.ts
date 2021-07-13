import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditStepComponent } from './credit-step.component';

describe('CreditStepComponent', () => {
  let component: CreditStepComponent;
  let fixture: ComponentFixture<CreditStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreditStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
