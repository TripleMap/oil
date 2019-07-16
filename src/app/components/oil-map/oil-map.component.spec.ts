import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OilMapComponent } from './oil-map.component';

describe('OilMapComponent', () => {
  let component: OilMapComponent;
  let fixture: ComponentFixture<OilMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OilMapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OilMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
