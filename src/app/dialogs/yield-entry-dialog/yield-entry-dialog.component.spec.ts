import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YieldEntryDialogComponent } from './yield-entry-dialog.component';

describe('YieldEntryDialogComponent', () => {
  let component: YieldEntryDialogComponent;
  let fixture: ComponentFixture<YieldEntryDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YieldEntryDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YieldEntryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
