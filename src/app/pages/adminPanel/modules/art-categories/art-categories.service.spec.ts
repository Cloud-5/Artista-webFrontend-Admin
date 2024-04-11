import { TestBed } from '@angular/core/testing';

import { ArtCategoriesService } from './art-categories.service';

describe('ArtCategoriesService', () => {
  let service: ArtCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArtCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
