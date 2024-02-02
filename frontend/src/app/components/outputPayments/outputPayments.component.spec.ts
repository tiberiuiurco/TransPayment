import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutputPaymentsComponent } from './outputPayments.component';

describe('PlatiComponent', () => {
  let component: OutputPaymentsComponent;
  let fixture: ComponentFixture<OutputPaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OutputPaymentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OutputPaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
