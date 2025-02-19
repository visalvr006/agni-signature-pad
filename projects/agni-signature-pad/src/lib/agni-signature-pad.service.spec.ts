import { TestBed } from '@angular/core/testing';

import { AgniSignaturePadService } from './agni-signature-pad.service';

describe('AgniSignaturePadService', () => {
  let service: AgniSignaturePadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AgniSignaturePadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
