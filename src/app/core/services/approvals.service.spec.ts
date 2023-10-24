/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApprovalsService } from './approvals.service';

describe('Service: Approvals', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApprovalsService]
    });
  });

  it('should ...', inject([ApprovalsService], (service: ApprovalsService) => {
    expect(service).toBeTruthy();
  }));
});
