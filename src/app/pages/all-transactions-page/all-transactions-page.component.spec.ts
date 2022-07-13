import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllTransactionsPageComponent } from './all-transactions-page.component';

describe('AllTransactionsPageComponent', () => {
  let component: AllTransactionsPageComponent;
  let fixture: ComponentFixture<AllTransactionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AllTransactionsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllTransactionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
