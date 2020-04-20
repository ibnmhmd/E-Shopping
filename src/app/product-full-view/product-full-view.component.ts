import { Component, OnInit, AfterViewInit , PLATFORM_ID , Inject } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Categories } from '../enum/categories.enum';
import { ShoppingCategoryServiceService } from '../services/shopping-categories.service';
import { CartManagementService } from '../services/cart-management.service';
import $ from 'jquery/dist/jquery';
import { FormsModule } from '@angular/forms';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

declare var require: any;

const cartModule = require('../add-item-to-cart.module');
const usersModule = require('../manage-users-cart');

@Component({
  selector: 'app-product-full-view',
  templateUrl: './product-full-view.component.html',
  styleUrls: ['./product-full-view.component.scss'],
  providers: [ShoppingCategoryServiceService, CartManagementService]
})
export class ProductFullViewComponent implements OnInit, AfterViewInit {

category: String = '';
guid: String = '';
fetchedData: String[] = [];
slicedObject: any;
quantities: Number[] = [];
quantity: any;
selectedValue: any = 0;
qtyNotSelected: Boolean = false;
cartItem: any ;
itemAdded: Boolean = false ;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private shoppingCategories: ShoppingCategoryServiceService,
    private cartManagementService :CartManagementService,
  private meta: Meta, private title: Title, @Inject(PLATFORM_ID) private platformId: Object) {

    // Sets the <title></title>
    title.setTitle('Shopping Cart: Product full view');

    // Sets the <meta> tag for the page
    meta.addTags([
      { name: 'author', content: 'Shopping Cart' },
      { name: 'description', content: 'Shopping Cart: view a product in full view mode.' },
    ]);

   }

    ngAfterViewInit(): void {
    
    }


/**************get men's categories **********/
loadShoppingCategories(guid, category) {
  this.shoppingCategories.getShoppingCategories(category).subscribe(data => {
    if (data) {
      this.extractProductFromObject(guid, data);
    }
  }, err =>
   console.log('Error occured !!!!'));
}
/**************** ends *********************/

/*************extract clicked product detailes */
extractProductFromObject(guid, object)
{
  this.quantities = [];
  this.slicedObject = object.find((sliced) => {
    return sliced.guid === guid ;
  });
    
  if( this.slicedObject ) {
    for( let i = 1 ; i <= this.slicedObject.quantity; i++)
    {
       this.quantities.push( i );
    }
  }
}

/************** add item to cart *******/
addToCart() {
  console.log("Attaching loader :: ");
    this.attach();
    debugger;
   /***************** set error message if quantity not set *****/
   if (0 === this.selectedValue || '0' === this.selectedValue ) {
     this.qtyNotSelected = true ;
     this.itemAdded = false ;
     window.scroll(0, 0 );
     setTimeout(() => {
      this.qtyNotSelected = false ;
      window.scrollTo(0, document.body.scrollHeight);
     }, 2000);
     this.detach();
   }else {
      /******************** starts ******/
      let data;
      if ( isPlatformBrowser(this.platformId) ) {
          data = usersModule.getUserData(localStorage.getItem('user_data'));
       }
     /*********** extract the old values in the storage and append the new ones  ****/
     let _extract_data = [];
      if(!usersModule.isRegisteredUser(data)) {
        _extract_data = data.guest_cart ? data.guest_cart : new Array();
        _extract_data = _extract_data.filter (object => object.guid !== this.slicedObject.guid );
        this.slicedObject['quantity'] = this.selectedValue;
        _extract_data.unshift(this.slicedObject);
        data.guest_cart = _extract_data ;
        if ( isPlatformBrowser(this.platformId) ) {
          localStorage.setItem('guest_cart', JSON.stringify(_extract_data ));
          localStorage.setItem('user_data', JSON.stringify(data));
         }
        
        this.itemAddedToCart();
     }else {
         this.slicedObject['quantity'] = this.selectedValue;
         let token = localStorage.getItem('user_token'), body = {'item': {} , 'token': ''};
         body.item = this.slicedObject;
         body.token = token;
         /****************** get user cart first ******/
         this.cartManagementService.getCustomerCart(token).subscribe(data => {
           /********** post new item if cart is empty ****/
           if(data && data.hasOwnProperty('data') && data.data.length === 0 ) {
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
               }else
                {
                /*********** if the item is already there, then update it otherwise add it ****/
              if (!usersModule.isItemPresent(data.data[0].cart, this.slicedObject)) {
                this.cartManagementService.expandCustomerCart(body).subscribe(data => {
                  this.itemAddedToCart();
                }, err => {
                  console.log(err);
                  this.detach();
                });
              }else {
                /******** if item is already in cart, then update it with the new one ***/
                let userItems = usersModule.cleanUserCart(data.data[0].cart, this.slicedObject);
                userItems.unshift(this.slicedObject);
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
/*************** ends *****************/

setQty()
{

}
  ngOnInit() {

    /****************check the category through url and load it's corresponding data ***/
    this.category = this.route.snapshot.params['category'];
    this.guid = this.route.snapshot.params['guid'];
    let category = this.category.toLowerCase();
    if(this.category)
    {
        this.loadShoppingCategories(this.guid,category);
    }
    console.log("category selected : " +this.route.snapshot.params['category']);
  }

   /**************** success ******/
   itemAddedToCart() {
    this.qtyNotSelected = false ;
    this.itemAdded = true ;
    window.scroll(0, 0 );
    setTimeout(() => {
     this.itemAdded = false ;
    }, 2000);
    $('.trigger').click();
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
