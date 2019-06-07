import { TestBed } from '@angular/core/testing';

import { GuitarChordGeneratorService } from './guitar-chord-generator.service';

describe('GuitarChordGeneratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GuitarChordGeneratorService = TestBed.get(GuitarChordGeneratorService);
    expect(service).toBeTruthy();
  });
});
