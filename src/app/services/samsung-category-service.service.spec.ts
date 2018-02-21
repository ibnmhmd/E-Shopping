import { TestBed, inject } from '@angular/core/testing';

import { SamsungCategoryServiceService } from './samsung-category-service.service';

describe('SamsungCategoryServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SamsungCategoryServiceService]
    });
  });

  it('should be created', inject([SamsungCategoryServiceService], (service: SamsungCategoryServiceService) => {
    expect(service).toBeTruthy();
  }));
});
