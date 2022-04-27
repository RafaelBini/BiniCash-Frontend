import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitDetailsDialogComponent } from './debit-details-dialog.component';

describe('DebitDetailsDialogComponent', () => {
  let component: DebitDetailsDialogComponent;
  let fixture: ComponentFixture<DebitDetailsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DebitDetailsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DebitDetailsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
