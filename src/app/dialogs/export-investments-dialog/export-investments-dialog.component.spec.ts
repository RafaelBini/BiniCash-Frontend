import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportInvestmentsDialogComponent } from './export-investments-dialog.component';

describe('ExportInvestmentsDialogComponent', () => {
  let component: ExportInvestmentsDialogComponent;
  let fixture: ComponentFixture<ExportInvestmentsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportInvestmentsDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportInvestmentsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
