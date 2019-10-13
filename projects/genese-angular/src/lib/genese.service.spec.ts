import { TestBed } from '@angular/core/testing';

import { GeneseService } from './genese.service';

describe('GeneseAngularService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneseService = TestBed.get(GeneseService);
    expect(service).toBeTruthy();
  });
});
