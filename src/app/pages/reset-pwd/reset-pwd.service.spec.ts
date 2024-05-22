import { TestBed } from '@angular/core/testing';

import { ResetPwdService } from './reset-pwd.service';

describe('ResetPwdService', () => {
  let service: ResetPwdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResetPwdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
