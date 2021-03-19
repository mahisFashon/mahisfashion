import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MyposComponent } from './mypos.component';

describe('MyposComponent', () => {
  let component: MyposComponent;
  let fixture: ComponentFixture<MyposComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyposComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
