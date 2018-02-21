import { TestBed, inject } from '@angular/core/testing';

import { CartManagementService } from './cart-management.service';

describe('CartManagementService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartManagementService]
    });
  });

  it('should be created', inject([CartManagementService], (service: CartManagementService) => {
    expect(service).toBeTruthy();
  }));
});
