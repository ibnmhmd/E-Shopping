import { Component, OnInit, AfterViewInit, Inject, PLATFORM_ID } from '@angular/core';
import {CategoryListingServiceService} from '../services/category-listing-service.service';
import { CartManagementService } from '../services/cart-management.service';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
declare var require: any;
declare var $: any;
const cartModule = require('../add-item-to-cart.module');
const usersModule = require('../manage-users-cart');
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ CategoryListingServiceService, CartManagementService ]
})
export class HomeComponent implements OnInit, AfterViewInit {
 
  recommendations: any = [];
  categoryName: String = '';
  products: String[] = [];
  img: String = '';
  name: String = '';
  price: Number = 0;
  selectedQty = '0';
  qty: Number = 0;
  model: String = '';
  quantity: any [] = [];
  qtyNotSelected: Boolean = false;
  itemAdded: Boolean = false;
  fetchedData: any = {};
  constructor(@Inject(PLATFORM_ID) private platformId: Object, 
  private categoryListingService: CategoryListingServiceService,
  private cartManagementService: CartManagementService,
  meta: Meta, title: Title) {
     // Sets the <title></title>
     title.setTitle('Shopping-Cart');

     // Sets the <meta> tag for the page
     meta.addTags([
       { name: 'author', content: 'Shopping Cart' },
       { name: 'description', content: 'Shopping Cart: helps you quickly shop our products.' },
     ]);
   }

   get() {
     this.categoryListingService.getDummy().subscribe(data =>
      {
        console.log(data)
      }
        , err => console.log('error')
      );
   }
  ngAfterViewInit(): void {
  //  $('#zoom').elevateZoom();
  }

    /*******************get most popular *************/
    loadRecommendations() {
      this.categoryListingService.getRecommendations().subscribe(data =>
        {
          if(data)
          { 
            this. recommendations = data;
          }
        }
          , err => console.log('error')
        );
    }
    /************************end *********************/
    quickView(product) {
      if ( product) {
        this.fetchedData  = [], this.quantity = [];
        this.img = product.img;
        this.name = product.cat_title;
        this.price = product.price;
        this.model = product.guid;
        for ( let i = 1; i <= product.quantity; i++) {
          this.quantity.push(i);
        }
        $('#quickView').modal('show');
        this.fetchedData = product ;
      }
    }

  ngOnInit() {
    // if ( isPlatformBrowser ( this.platformId ) ) {
    //   window.scroll(0 , 0);
    // }
    this.loadRecommendations();
    this.categoryName = 'recommendations';
  
  }


  addToCart() {
    this.attach();
    if ( this.selectedQty === '0') {
      this.qtyNotSelected = true;
      this.itemAdded = false;
      setTimeout(() => {
        this.qtyNotSelected = false;
      }, 3000);
      this.detach();
    }else {
        /******************** starts ******/
        let data ;
        if ( isPlatformBrowser(this.platformId) ) {
           data = usersModule.getUserData(localStorage.getItem('user_data'));
         }
    /*********** extract the old values in the storage and append the new ones  ****/
    let _extract_data = [];
    if (!usersModule.isRegisteredUser(data)) {
       _extract_data = data.guest_cart ? data.guest_cart : [] ;
       _extract_data = _extract_data.filter (object => object.guid !== this.fetchedData.guid );
       this.fetchedData['quantity'] = this.selectedQty;
       _extract_data.unshift(this.fetchedData);
       data.guest_cart = _extract_data ;
       if ( isPlatformBrowser(this.platformId) ) {
        localStorage.setItem('guest_cart', JSON.stringify(_extract_data ));
        localStorage.setItem('user_data', JSON.stringify(data));
       }
       this.itemAddedToCart();
    
    }else {
        this.fetchedData['quantity'] = this.selectedQty;
        let token , body = {'item': {} , 'token': ''};
        if ( isPlatformBrowser(this.platformId) ) {
            token = localStorage.getItem('user_token');
        }
        body.item = this.fetchedData;
        body.token = token;
        /****************** get user cart first ******/
        this.cartManagementService.getCustomerCart(token).subscribe(data => {
          /********** post new item if cart is empty ****/
          if(data && data.hasOwnProperty('data') && data.data.length === 0) {
             this.cartManagementService.postItemToCustomerCart(body).subscribe(data => {
              this.itemAddedToCart();
            }, err => {
              console.log(err);
              this.detach();
            })
          }else {
            /*********** if the item is already there, then update it otherwise add it ****/
             if (!usersModule.isItemPresent(data.data[0].cart, this.fetchedData)) {
               this.cartManagementService.expandCustomerCart(body).subscribe(data => {
                 this.itemAddedToCart();
               }, err => {
                 console.log(err);
                 this.detach();
               })
             }else {
               /******** if item is already in cart, then update it with the new one ***/
               let userItems =  usersModule.cleanUserCart(data.data[0].cart, this.fetchedData);
               userItems.unshift(this.fetchedData);
               body.item = userItems ;
               this.cartManagementService.updateCustomerCart(body).subscribe(data => {
                this.itemAddedToCart();
               }, err => {
                 console.log(err);
                 this.detach();
               })
             }
          }
        }, err => {
          console.log(err);
          this.detach();
         })
      }
   
    }
  }

    /**************** success ******/
    itemAddedToCart() {
      this.itemAdded = true;
      this.qtyNotSelected = false;
      setTimeout(() => {
        this.itemAdded = false ;
        $('#quickView').modal('hide');
      }, 2000);
      $('.trigger').click();
      this.selectedQty = '0';
      this.detach();
    }
    /******************ends *********/
  /************ unload ****/
   detach() {
    $('#loading').hide();
  }
  attach() {
    $('#loading').show();
  }
}
