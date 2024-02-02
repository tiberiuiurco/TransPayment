import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePartnerDialogComponent } from './manage-partner-dialog.component';

describe('ManagePartnerDialogComponent', () => {
  let component: ManagePartnerDialogComponent;
  let fixture: ComponentFixture<ManagePartnerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePartnerDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManagePartnerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
