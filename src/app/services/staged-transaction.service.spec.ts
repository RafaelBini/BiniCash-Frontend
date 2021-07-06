import { TestBed } from '@angular/core/testing';

import { StagedTransactionService } from './staged-transaction.service';

describe('StagedTransactionService', () => {
  let service: StagedTransactionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StagedTransactionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
