import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyInstanceModalComponent } from './modify-instance-modal.component';

describe('ModifyInstanceModalComponent', () => {
  let component: ModifyInstanceModalComponent;
  let fixture: ComponentFixture<ModifyInstanceModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyInstanceModalComponent]
    });
    fixture = TestBed.createComponent(ModifyInstanceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
