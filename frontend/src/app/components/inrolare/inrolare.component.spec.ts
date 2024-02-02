import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InrolareComponent } from './inrolare.component';

describe('InrolareComponent', () => {
  let component: InrolareComponent;
  let fixture: ComponentFixture<InrolareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InrolareComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InrolareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
