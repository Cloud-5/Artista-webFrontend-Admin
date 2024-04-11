import { TestBed } from '@angular/core/testing';

import { ArtistRequestsService } from './artist-requests.service';

describe('ArtistRequestsService', () => {
  let service: ArtistRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtistRequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
