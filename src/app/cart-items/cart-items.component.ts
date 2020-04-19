import { Component, OnInit , PLATFORM_ID, Inject} from '@angular/core';
declare var $: any ;
import { Console } from '@angular/core/src/console';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { EventEmiter } from '../interfaces/eventEmitter.interface';
import { CartManagementService } from '../services/cart-management.service';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

declare var require: any;
const usersModule = require ('../manage-users-cart');
@Component({
  selector: 'app-cart-items',
  templateUrl: './cart-items.component.html',
  styleUrls: ['./cart-items.component.scss'],
  providers: [CartManagementService]
})
export class CartItemsComponent implements OnInit {
  defaultEvent: EventEmiter =new EventEmiter();
  noItems: Boolean = false;
  itemRemoved: Boolean = false;
  itemsInCart: any = [];
  noOfItems: Number = 0;
  grandTotal: Number = 0;
  cost: any = 0 ;
  token: string = '';
  /*** VAT cost is 5% */
  private VAT = .05 ;
  calculatedVAT: Number = 0 ;
  constructor( private route: ActivatedRoute,
    private router: Router, private cartManagementService: CartManagementService,
  private title:Title, private meta: Meta,  @Inject(PLATFORM_ID) private platformId: Object) {

    // Sets the <title></title>
    title.setTitle('Shopping-Cart: products in cart');

    // Sets the <meta> tag for the page
    meta.addTags([
      { name: 'author', content: 'Shopping Cart' },
      { name: 'description', content: 'Shopping Cart: see the products you added them to the cart.' },
    ]);
   }

  /************ setv value ******/
  setCalculation() {
    debugger
    this.calculateTotalCost();
    console.log('set cal', this.itemsInCart)
    this.noOfItems = this.itemsInCart.length;
  }
  /*********** ends *********/
  /********** get items in cart ***/
  extractItems() {
    let data, users, currentUser;
    if ( isPlatformBrowser(this.platformId) ) {
      localStorage.setItem('items', null);
      data =  usersModule.getUserData(localStorage.getItem('user_data'));
      users =  usersModule.getAllRegisteredUsers(localStorage.getItem('users')) ;
      currentUser = usersModule.getCurrentUserByEmail(data.email);
     }
    /********** guest users ******/
    if (!usersModule.isRegisteredUser(data)) {
      if (data) {
          this.itemsInCart = [];
          this.itemsInCart = data.guest_cart;
          this.setCalculation();
      }else {
           this.noItems = true ;
           this.detach();
      }
    }else {
            this.itemsInCart = [];
            if ( isPlatformBrowser(this.platformId) ) { 
            this.token = localStorage.getItem('user_token');
            }
            console.log("user token :: "+ this.token);
            /************* get customer cart ***********/
            this.cartManagementService.getCustomerCart(this.token).subscribe(data => {
              if(data && data.hasOwnProperty('data') && data.data.length > 0 && data.data[0].cart[0] !== null) {
                console.log("user cart :: "+ data.data[0]);
                this.itemsInCart = data.data[0].cart;
                this.setCalculation();
                if ( isPlatformBrowser(this.platformId) ) {
                   localStorage.setItem('items', (String)(this.noOfItems));
                }
              }else {
                this.noItems = true ;
                this.detach();
              }
            }, err => {
              this.detach();
              console.log(err)
            })
     }
  }
  /************* ends *************/
  removeItem(guid) {
    this.attach();
    let data, users, currentUser;
    if ( isPlatformBrowser(this.platformId) ) {
      localStorage.setItem('items', null);
      data =  usersModule.getUserData(localStorage.getItem('user_data'));
      users =  usersModule.getAllRegisteredUsers(localStorage.getItem('users')) ;
      currentUser = usersModule.getCurrentUserByEmail(data.email);
     }
    if (this.itemsInCart) {
       this.itemsInCart = this.itemsInCart.filter ( item =>  item.guid !== guid );
       if (!usersModule.isRegisteredUser(data)) {
           data.guest_cart = this.itemsInCart ;
           if ( isPlatformBrowser(this.platformId) ) {
           localStorage.setItem('guest_cart', JSON.stringify(this.itemsInCart));
           localStorage.setItem('user_data', JSON.stringify(data));
           }
           this.cartUpdated();
       }else {
              let body = {'item': {}, 'token': ''};
              body.item = this.itemsInCart;
              body.token = this.token;
            
              /*********** update user cart ****/
              this.cartManagementService.updateCustomerCart(body).subscribe(data => {
                this.cartUpdated();
               }, err => {
                 console.log(err);
                 this.detach();
               });
       }
    }
  }
  /****************** cart updated ********/
  cartUpdated() {
    if ( isPlatformBrowser(this.platformId) ) {
    window.scroll(0, 0 ); }
    this.itemRemoved = true ;
    this.noItems = false ;
    setTimeout(() => {
     this.itemRemoved = false ;
    }, 2000);
    this.calculateTotalCost();
    if ( isPlatformBrowser(this.platformId) ) { $('.trigger').click();}
    this.detach();
  }
  /******************* ends ************/
  /********************** calculate cost *****/
  calculateTotalCost() {
    if ( isPlatformBrowser(this.platformId) ) { 
        localStorage.setItem('grandTotal', null);
        localStorage.setItem('VAT', null);
    }
    this.cost = 0;
    if (this.itemsInCart && this.itemsInCart.length !== 0) {
        Object.keys(this.itemsInCart).map((key, value) => {
        this.cost += (this.itemsInCart[value].price * this.itemsInCart[value].quantity);
      });
      this.calculatedVAT = usersModule.calculateVAT(this.cost);
      this.grandTotal = this.cost + this.calculatedVAT;
      if ( isPlatformBrowser(this.platformId) ) { 
      localStorage.setItem('grandTotal', (String)(this.grandTotal));
      localStorage.setItem('VAT', (String)(this.calculatedVAT)); }
      this.noOfItems = this.itemsInCart.length;
    }else {
     setTimeout(() => {
      this.noItems = true;
     }, 2000);
    }
   console.log('cal tot cost', this.itemsInCart)
    if ( isPlatformBrowser(this.platformId) ) { 
    localStorage.setItem('items', (String)(this.noOfItems)); }
    this.detach();
  }
  /********************ends ***************/
  /****************** calculate vat ****/
  calculateVAT(cost)
  {
    if(cost)
     this.calculatedVAT = this.VAT*cost
     return this.calculatedVAT;
  }
  /***************ends ***************/
  ngOnInit() {
    this.attach();
    if ( isPlatformBrowser(this.platformId) ) {
    window.scroll(0, 0); }
    this.extractItems();
    this.defaultEvent.userMode = '';
  }

  /******************** check out options ******/
  checkOutOptions() {
    if ( isPlatformBrowser(this.platformId) ) {
      let data =  usersModule.getUserData(localStorage.getItem('user_data'));
    if(!usersModule.isRegisteredUser(data)) {
      $('#checkOutOption').modal('show');
     }else {
      this.router.navigate(['/secure-checkout']);
     }
   }
  }
  //******************* ends **************/

  //*************** sign in **************/
  signIn() {
    if ( isPlatformBrowser(this.platformId) ) {
    window.scroll(0, 0); }
    if ( isPlatformBrowser(this.platformId) ) { 
    localStorage.setItem('userMode', 'Returning'); }
    if ( isPlatformBrowser(this.platformId) ) { 
    $('.userPanel').click();
    $('#checkOutOption').modal('hide');
    }
  }

  /**************** close pop up ******/
  shutPop() {
    if ( isPlatformBrowser(this.platformId) ) { 
    $('#checkOutOption').modal('hide'); }
  }

    /************ load/unload ****/
    detach() {
      if ( isPlatformBrowser(this.platformId) ) { 
      $('#loading').hide(); }
    }
    attach() {
      if ( isPlatformBrowser(this.platformId) ) { 
      $('#loading').show(); }
    }
   /**************** ends ******/
}
