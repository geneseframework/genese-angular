import { TestBed } from '@angular/core/testing';

import { GeneseAngularLibraryService } from './genese-angular-library.service';

describe('GeneseAngularLibraryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneseAngularLibraryService = TestBed.get(GeneseAngularLibraryService);
    expect(service).toBeTruthy();
  });
});
