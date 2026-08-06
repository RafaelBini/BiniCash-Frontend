import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsCreditsPageComponent } from './analytics-credits-page.component';

describe('AnalyticsCreditsPageComponent', () => {
  let component: AnalyticsCreditsPageComponent;
  let fixture: ComponentFixture<AnalyticsCreditsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnalyticsCreditsPageComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalyticsCreditsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
