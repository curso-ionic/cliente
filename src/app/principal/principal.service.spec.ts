import { TestBed } from '@angular/core/testing';

import { PrincipalService } from './principal.service';

describe('PrincipalService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PrincipalService = TestBed.get(PrincipalService);
    expect(service).toBeTruthy();
  });
});
