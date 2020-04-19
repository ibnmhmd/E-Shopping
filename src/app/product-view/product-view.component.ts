import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import {CategoryListingServiceService} from '../services/category-listing-service.service';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Categories } from '../enum/categories.enum';
import { ShoppingCategoryServiceService } from '../services/shopping-categories.service';
import { CartManagementService } from '../services/cart-management.service';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

declare var require: any;
const cartModule = require('../add-item-to-cart.module');
const usersModule = require('../manage-users-cart');

declare var $: any;

@Component({
  selector: 'app-product-view',
  templateUrl: './product-view.component.html',
  styleUrls: ['./product-view.component.scss'],
  providers: [ CategoryListingServiceService, ShoppingCategoryServiceService, CartManagementService ]
})
export class ProductViewComponent implements OnInit {
  recommendations: String[] = [];
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
  noItems: Boolean = false;

  constructor(private categoryListingService: CategoryListingServiceService,
    private route: ActivatedRoute,
    private router: Router,
    private shoppingCategories: ShoppingCategoryServiceService,
    private cartManagementService: CartManagementService,
  private meta: Meta, private title:Title,  @Inject(PLATFORM_ID) private platformId: Object) {

     // Sets the <title></title>
      title.setTitle('Shopping-Cart: Products View');

     // Sets the <meta> tag for the page
     meta.addTags([
       { name: 'author', content: 'Shopping Cart' },
       { name: 'description', content: 'Shopping Cart: quickly view our products and navigate them.' },
     ]);
   }

    /*******************get most popular *************/
    loadRecommendations() {
      this.categoryListingService.getRecommendations().subscribe(data => {
          if ( data ) {
            this. recommendations = data;
          }
        }
          , err => console.log('error')
        );
    }
    /************************end *********************/
    quickView(product, qty) {
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
    /************* add to cart ***********/
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
        let data, users;
        if ( isPlatformBrowser(this.platformId) ) {
          data =  usersModule.getUserData(localStorage.getItem('user_data'));
          users =  usersModule.getAllRegisteredUsers(localStorage.getItem('users')) ;
         }
        let currentUser ;
    /*********** extract the old values in the storage and append the new ones  ****/
    let _extract_data = [];
    if (!usersModule.isRegisteredUser(data)) {
        _extract_data = data.guest_cart ;
        _extract_data = _extract_data.filter (object => object.guid !== this.fetchedData.guid );
       this.fetchedData['quantity'] = this.selectedQty;
       _extract_data.unshift(this.fetchedData);
       data.guest_cart = _extract_data ;
       if (isPlatformBrowser(this.platformId)) { 
        localStorage.setItem('guest_cart', JSON.stringify(_extract_data ));
        localStorage.setItem('user_data', JSON.stringify(data));
       }
      
       this.itemAddedToCart();
    
    }else {
        this.fetchedData['quantity'] = this.selectedQty;
        let token = "";
        if ( isPlatformBrowser(this.platformId) ) {
          token = localStorage.getItem('user_token');
        }
        let body = {'item': {} , 'token': ''};
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
          }else 
              if(data.data[0].cart[0] === null) {
                 this.cartManagementService.expandCustomerCart(body).subscribe(data => {
                 this.itemAddedToCart();
                 }, err => {
                 console.log(err);
                 this.detach();
               }); 
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
               });
             }
          }
        }, err => {
          console.log(err);
          this.detach();
         })
      }
    }
  }

    /*************** filter cart ****/

    /****************** ends ********/
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
  ngOnInit() {
    this.loadRecommendations();
    this.products = [];
    $('#loading').show();
    /*************on route change ********/
    this.route.params.forEach(params => {
      window.scroll(0, 0 );
          if(this.route.snapshot.params ['category'])
          {
            this.categoryName = this.route.snapshot.params ['category'];
          }else{
            this.categoryName = ' Not Available ';
          }
          /***********map routing request and fetch corresponding data ****/
          let category = this.categoryName.toLowerCase();
          if (category)
          {
             this.shoppingCategories.getShoppingCategories(category).subscribe(data => {
               if(data.length > 0)
               {
                 this.products = data;
                 this.noItems = false ;
               }else {
                this.noItems = true ;
                this.products = [];
               }
               $('#loading').hide();
             }, err => {
               console.log('Error fetching men\'s categories !!!!');
             })
          }
    
    });
  }

   /************ unload ****/
   detach() {
    $('#loading').hide();
  }
  attach() {
    $('#loading').show();
  }
}
