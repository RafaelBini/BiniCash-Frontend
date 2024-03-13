import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TithePageComponent } from './tithe-page.component';

describe('TithePageComponent', () => {
  let component: TithePageComponent;
  let fixture: ComponentFixture<TithePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TithePageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TithePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
