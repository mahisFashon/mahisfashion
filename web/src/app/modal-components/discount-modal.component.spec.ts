import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountModalComponent } from './discount-modal.component';

describe('DiscountModalComponent', () => {
  let component: DiscountModalComponent;
  let fixture: ComponentFixture<DiscountModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
