import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VBACalcComponent } from './vba-calc.component';

describe('VBACalcComponent', () => {
  let component: VBACalcComponent;
  let fixture: ComponentFixture<VBACalcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VBACalcComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VBACalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
