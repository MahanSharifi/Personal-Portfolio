import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechExperiencesComponent } from './tech-experiences.component';

describe('TechExperiencesComponent', () => {
  let component: TechExperiencesComponent;
  let fixture: ComponentFixture<TechExperiencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TechExperiencesComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TechExperiencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
