import { Component, OnInit } from '@angular/core';
declare var $: any ;
import { Console } from '@angular/core/src/console';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { EventEmiter } from '../interfaces/eventEmitter.interface';
import { CartManagementService } from '../services/cart-management.service';
import { Meta, Title } from '@angular/platform-browser';

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
  private title:Title, private meta:Meta) {

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
    this.calculateTotalCost();
    this.noOfItems = this.itemsInCart.length;
  }
  /*********** ends *********/
  /********** get items in cart ***/
  extractItems() {
    localStorage.setItem('items', null);
    const data = usersModule.getUserData();
    const currentUser = usersModule.getCurrentUserByEmail(data.email);
    const users = usersModule.getAllRegisteredUsers() ;
    /********** guest users ******/
    if (!usersModule.isRegisteredUser()) {
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
            this.token = localStorage.getItem('user_token');
            /************* get customer cart ***********/
            this.cartManagementService.getCustomerCart(this.token).subscribe(data => {
              if(data && data.hasOwnProperty('data') && data.data.length > 0 && data.data[0].cart[0] !== null) {
                this.itemsInCart = data.data[0].cart;
                this.setCalculation();
                localStorage.setItem('items', (String)(this.noOfItems));
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
    const data = usersModule.getUserData();
    const currentUser = usersModule.getCurrentUserByEmail(data.email);
    if (this.itemsInCart) {
       this.itemsInCart = this.itemsInCart.filter ( item =>  item.guid !== guid );
       if (!usersModule.isRegisteredUser()) {
           data.guest_cart = this.itemsInCart ;
           localStorage.setItem('guest_cart', JSON.stringify(this.itemsInCart));
           localStorage.setItem('user_data', JSON.stringify(data));
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
    window.scroll(0, 0 );
    this.itemRemoved = true ;
    this.noItems = false ;
    setTimeout(() => {
     this.itemRemoved = false ;
    }, 2000);
    this.calculateTotalCost();
    $('.trigger').click();
    this.detach();
  }
  /******************* ends ************/
  /********************** calculate cost *****/
  calculateTotalCost() {
    localStorage.setItem('grandTotal', null);
    localStorage.setItem('VAT', null);
    this.cost = 0;
    if (this.itemsInCart && this.itemsInCart.length !== 0) {
        Object.keys(this.itemsInCart).map((key, value) => {
        this.cost += (this.itemsInCart[value].price * this.itemsInCart[value].quantity);
      });
      this.calculatedVAT = usersModule.calculateVAT(this.cost);
      this.grandTotal = this.cost + this.calculatedVAT;
      localStorage.setItem('grandTotal', (String)(this.grandTotal));
      localStorage.setItem('VAT', (String)(this.calculatedVAT));
    }else {
     setTimeout(() => {
      this.noItems = true;
     }, 2000);
    }
    this.noOfItems = this.itemsInCart.length;
    localStorage.setItem('items', (String)(this.noOfItems));
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
    window.scroll(0, 0);
    this.extractItems();
    this.defaultEvent.userMode = '';
  }

  /******************** check out options ******/
  checkOutOptions() {
    if(!usersModule.isRegisteredUser()) {
      $('#checkOutOption').modal('show');
    }else {
      this.router.navigate(['/secure-checkout']);
    }
   
  }
  //******************* ends **************/

  //*************** sign in **************/
  signIn() {
    window.scroll(0, 0);
    localStorage.setItem('userMode', 'Returning');
    $('.userPanel').click();
    $('#checkOutOption').modal('hide');
  }

  /**************** close pop up ******/
  shutPop() {
    $('#checkOutOption').modal('hide');
  }

    /************ load/unload ****/
    detach() {
      $('#loading').hide();
    }
    attach() {
      $('#loading').show();
    }
   /**************** ends ******/
}
