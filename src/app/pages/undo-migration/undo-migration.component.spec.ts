import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndoMigrationComponent } from './undo-migration.component';

describe('UndoMigrationComponent', () => {
  let component: UndoMigrationComponent;
  let fixture: ComponentFixture<UndoMigrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UndoMigrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UndoMigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
