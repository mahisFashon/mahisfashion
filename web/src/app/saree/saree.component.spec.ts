import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SareeComponent } from './saree.component';

describe('SareeComponent', () => {
  let component: SareeComponent;
  let fixture: ComponentFixture<SareeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SareeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SareeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
