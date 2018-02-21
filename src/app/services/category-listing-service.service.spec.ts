import { TestBed, inject } from '@angular/core/testing';

import { CategoryListingServiceService } from './category-listing-service.service';

describe('CategoryListingServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CategoryListingServiceService]
    });
  });

  it('should be created', inject([CategoryListingServiceService], (service: CategoryListingServiceService) => {
    expect(service).toBeTruthy();
  }));
});
