import { TestBed, inject } from '@angular/core/testing';

import { WomensCategoryServiceService } from './womens-category-service.service';

describe('WomensCategoryServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WomensCategoryServiceService]
    });
  });

  it('should be created', inject([WomensCategoryServiceService], (service: WomensCategoryServiceService) => {
    expect(service).toBeTruthy();
  }));
});
