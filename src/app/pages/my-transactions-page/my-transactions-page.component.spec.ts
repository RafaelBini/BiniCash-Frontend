import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTransactionsPageComponent } from './my-transactions-page.component';

describe('MyTransactionsPageComponent', () => {
  let component: MyTransactionsPageComponent;
  let fixture: ComponentFixture<MyTransactionsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyTransactionsPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTransactionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
