import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRulesPageComponent } from './manage-rules-page.component';

describe('ManageRulesPageComponent', () => {
  let component: ManageRulesPageComponent;
  let fixture: ComponentFixture<ManageRulesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRulesPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRulesPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
