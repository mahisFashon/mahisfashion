import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoompageComponent } from './zoompage.component';

describe('ZoompageComponent', () => {
  let component: ZoompageComponent;
  let fixture: ComponentFixture<ZoompageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoompageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoompageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
