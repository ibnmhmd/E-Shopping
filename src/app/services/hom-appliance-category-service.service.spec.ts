import { TestBed, inject } from '@angular/core/testing';

import { HomApplianceCategoryServiceService } from './hom-appliance-category-service.service';

describe('HomApplianceCategoryServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HomApplianceCategoryServiceService]
    });
  });

  it('should be created', inject([HomApplianceCategoryServiceService], (service: HomApplianceCategoryServiceService) => {
    expect(service).toBeTruthy();
  }));
});
