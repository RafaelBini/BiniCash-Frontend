import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MigratePageComponent } from './migrate-page.component';

describe('MigratePageComponent', () => {
  let component: MigratePageComponent;
  let fixture: ComponentFixture<MigratePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MigratePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MigratePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
