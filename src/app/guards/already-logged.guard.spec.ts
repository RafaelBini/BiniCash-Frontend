import { TestBed } from '@angular/core/testing';

import { AlreadyLoggedGuard } from './already-logged.guard';

describe('AlreadyLoggedGuard', () => {
  let guard: AlreadyLoggedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AlreadyLoggedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
