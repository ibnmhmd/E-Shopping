import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFullViewComponent } from './product-full-view.component';

describe('ProductFullViewComponent', () => {
  let component: ProductFullViewComponent;
  let fixture: ComponentFixture<ProductFullViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductFullViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductFullViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
