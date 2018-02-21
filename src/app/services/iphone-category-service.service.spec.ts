import { TestBed, inject } from '@angular/core/testing';

import { IphoneCategoryServiceService } from './iphone-category-service.service';

describe('IphoneCategoryServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IphoneCategoryServiceService]
    });
  });

  it('should be created', inject([IphoneCategoryServiceService], (service: IphoneCategoryServiceService) => {
    expect(service).toBeTruthy();
  }));
});
