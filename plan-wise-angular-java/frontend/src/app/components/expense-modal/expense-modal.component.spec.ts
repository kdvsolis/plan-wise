import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenseModalComponent } from './expense-modal.component';

describe('ExpenseModalComponent', () => {
  let component: ExpenseModalComponent;
  let fixture: ComponentFixture<ExpenseModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpenseModalComponent]
    });
    fixture = TestBed.createComponent(ExpenseModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
