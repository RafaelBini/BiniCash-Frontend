import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRulesDialogComponent } from './manage-rules-dialog.component';

describe('ManageRulesDialogComponent', () => {
  let component: ManageRulesDialogComponent;
  let fixture: ComponentFixture<ManageRulesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRulesDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRulesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
