import { Component, OnInit } from '@angular/core';
import {CategoryListingServiceService} from '../../services/category-listing-service.service';
declare var $: any;
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss'],
  providers: [ CategoryListingServiceService ]
})


export class ProductCategoryComponent implements OnInit {
  categories: any = [];
  most_popular: any = [];
 
  constructor(private categoryListingService: CategoryListingServiceService) { }

  /*************get categories from mock data  ********/
  loadCategories() {
    this.categoryListingService.getCategories().subscribe(data =>
      {
        if(data)
        { 
          this.categories = data;
        }
      }
        , err => console.log('error')
      );
  }
  /********************* ends **********************/

  /*******************get most popular *************/
  loadMostPopular() {
    this.categoryListingService.getMostPopular().subscribe(data =>
      {
        if(data)
        { 
          this. most_popular = data;
        }
      }
        , err => console.log('error')
      );
  }
  /************************end *********************/
  ngOnInit() {
    this.loadCategories();
    this.loadMostPopular();
  }

}
