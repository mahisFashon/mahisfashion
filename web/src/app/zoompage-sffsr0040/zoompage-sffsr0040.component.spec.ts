import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoompageSFFSR0040Component } from './zoompage-sffsr0040.component';

describe('ZoompageSFFSR0040Component', () => {
  let component: ZoompageSFFSR0040Component;
  let fixture: ComponentFixture<ZoompageSFFSR0040Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoompageSFFSR0040Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoompageSFFSR0040Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
