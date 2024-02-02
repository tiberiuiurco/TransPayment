import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePaymentDialogComponent } from './manage-payment-dialog.component';

describe('ManagePaymentDialogComponent', () => {
  let component: ManagePaymentDialogComponent;
  let fixture: ComponentFixture<ManagePaymentDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePaymentDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePaymentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
