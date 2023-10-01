import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LEDDiceComponent } from './leddice.component';

describe('LEDDiceComponent', () => {
  let component: LEDDiceComponent;
  let fixture: ComponentFixture<LEDDiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LEDDiceComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LEDDiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
