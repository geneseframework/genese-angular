import { TestBed } from '@angular/core/testing';

import { GeneseAngularService } from './genese-angular.service';

describe('GeneseAngularService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneseAngularService = TestBed.get(GeneseAngularService);
    expect(service).toBeTruthy();
  });
});
