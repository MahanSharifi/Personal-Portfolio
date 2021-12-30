import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiquadrisComponent } from './biquadris.component';

describe('BiquadrisComponent', () => {
  let component: BiquadrisComponent;
  let fixture: ComponentFixture<BiquadrisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiquadrisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiquadrisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
