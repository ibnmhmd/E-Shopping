import { TestBed, inject } from '@angular/core/testing';

import { ElectronicsCategoryServiceService } from './electronics-category-service.service';

describe('ElectronicsCategoryServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ElectronicsCategoryServiceService]
    });
  });

  it('should be created', inject([ElectronicsCategoryServiceService], (service: ElectronicsCategoryServiceService) => {
    expect(service).toBeTruthy();
  }));
});
