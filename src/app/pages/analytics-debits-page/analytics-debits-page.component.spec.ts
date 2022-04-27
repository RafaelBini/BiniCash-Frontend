import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsDebitsPageComponent } from './analytics-debits-page.component';

describe('AnalyticsDebitsPageComponent', () => {
  let component: AnalyticsDebitsPageComponent;
  let fixture: ComponentFixture<AnalyticsDebitsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnalyticsDebitsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsDebitsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
