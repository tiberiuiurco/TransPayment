import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageResourceDialogComponent } from './manage-resource-dialog.component';

describe('ManageResourceDialogComponent', () => {
  let component: ManageResourceDialogComponent;
  let fixture: ComponentFixture<ManageResourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageResourceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageResourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
