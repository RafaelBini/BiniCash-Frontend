import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewManualDebitsDialogComponent } from './new-manual-debits-dialog.component';

describe('NewManualDebitsDialogComponent', () => {
  let component: NewManualDebitsDialogComponent;
  let fixture: ComponentFixture<NewManualDebitsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewManualDebitsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewManualDebitsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
