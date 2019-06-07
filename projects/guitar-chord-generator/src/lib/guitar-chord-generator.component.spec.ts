import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuitarChordGeneratorComponent } from './guitar-chord-generator.component';

describe('GuitarChordGeneratorComponent', () => {
  let component: GuitarChordGeneratorComponent;
  let fixture: ComponentFixture<GuitarChordGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuitarChordGeneratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuitarChordGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
