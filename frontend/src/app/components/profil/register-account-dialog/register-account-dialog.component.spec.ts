import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterAccountDialogComponent } from './register-account-dialog.component';

describe('RegisterAccountDialogComponent', () => {
  let component: RegisterAccountDialogComponent;
  let fixture: ComponentFixture<RegisterAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterAccountDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
