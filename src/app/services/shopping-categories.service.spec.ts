import { TestBed, inject } from '@angular/core/testing';

import { ShoppingCategoryServiceService } from './shopping-categories.service';

describe('MensCategoryServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ShoppingCategoryServiceService]
    });
  });

  it('should be created', inject([ShoppingCategoryServiceService], (service: ShoppingCategoryServiceService) => {
    expect(service).toBeTruthy();
  }));
});
