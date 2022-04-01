import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditStagedTransactionsDialogComponent } from './edit-staged-transactions-dialog.component';

describe('EditStagedTransactionsDialogComponent', () => {
  let component: EditStagedTransactionsDialogComponent;
  let fixture: ComponentFixture<EditStagedTransactionsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditStagedTransactionsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditStagedTransactionsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
