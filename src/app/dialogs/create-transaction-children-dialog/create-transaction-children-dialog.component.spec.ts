import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTransactionChildrenDialogComponent } from './create-transaction-children-dialog.component';

describe('CreateTransactionChildrenDialogComponent', () => {
  let component: CreateTransactionChildrenDialogComponent;
  let fixture: ComponentFixture<CreateTransactionChildrenDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateTransactionChildrenDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTransactionChildrenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
