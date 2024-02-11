import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeModalComponent } from './income-modal.component';

describe('IncomeModalComponent', () => {
  let component: IncomeModalComponent;
  let fixture: ComponentFixture<IncomeModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [IncomeModalComponent]
    });
    fixture = TestBed.createComponent(IncomeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
