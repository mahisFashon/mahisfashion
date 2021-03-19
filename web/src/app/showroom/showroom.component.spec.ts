import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ShowroomComponent } from './showroom.component';

describe('ShowroomComponent', () => {
  let component: ShowroomComponent;
  let fixture: ComponentFixture<ShowroomComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
