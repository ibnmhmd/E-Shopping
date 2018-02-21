import { TestBed, inject } from '@angular/core/testing';

import { MensCategoryServiceService } from './mens-category-service.service';

describe('MensCategoryServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MensCategoryServiceService]
    });
  });

  it('should be created', inject([MensCategoryServiceService], (service: MensCategoryServiceService) => {
    expect(service).toBeTruthy();
  }));
});
