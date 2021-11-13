import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferCategoryDialogComponent } from './transfer-category-dialog.component';

describe('TransferCategoryDialogComponent', () => {
  let component: TransferCategoryDialogComponent;
  let fixture: ComponentFixture<TransferCategoryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferCategoryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferCategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
