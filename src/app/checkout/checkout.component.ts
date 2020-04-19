import { Component, OnInit, AfterViewInit , PLATFORM_ID , Inject} from '@angular/core';
import $ from 'jquery/dist/jquery';
import { Address } from '../interfaces/address.interface';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { CartManagementService } from '../services/cart-management.service';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

var moment = require('moment');
declare var require: any;
const usersModule = require ('../manage-users-cart');

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  providers: [CartManagementService]
})
export class CheckoutComponent implements OnInit, AfterViewInit {


  orderError: Boolean = false;
  disable: Boolean = true;
  firstName :String = '';
  lastName: String = '';
  phone: String = '';
  city: String = '0';
  address: String = '';
  addressInterface: Address = {firstName: '', lastName: '', phoneNumber: 0, city: '', address: '', delivery: ''};
  addressSet: Boolean = false;
  showAddressSet : Boolean = false;
  storedAddress: any ;
  addressMessage: String = '';
  items: String;
  VAT: String;
  grandTotal: String;
  qty: String;
  cardNumber: String = '';
  month: String = '';
  year : String = '';
  cvv: String = '';
  card:Boolean = false;
  cvvB:Boolean = false;
  monthB :Boolean = false;
  yearB : Boolean = false;
  date: any ;
  constructor(private route: ActivatedRoute,
    private router: Router, private cartManagementService: CartManagementService,
     @Inject(PLATFORM_ID) private platformId: Object) { }

  ngAfterViewInit(): void {

    this.showError("phone", 'errmsg');
    this.showError("cardNumber", 'cardmsg');
    this.showError("cvv", 'cvvmsg');
    this.showError("cvv", 'cvvmsg');
    this.showError("month", 'monthmsg');
    this.showError("year", 'yearmsg');
  }

  showError(id, span)
  {
    $("#"+id).keypress(function (e) {
      //if the letter is not digit then display error and don't type anything
      if (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) {
         //display error message
         $("#"+span).html("Digits Only").show().fadeOut(1000);
          return false;
     }
    });

  }

  placeOrder() {
    console.log("placing ....")
      this.attach();
     /*********validate input ****/
         if (this.cardNumber === ''|| this.cardNumber.length < 12) {
          $('#cardNumber').addClass('danger');
          this.card = false;
          this.detach();
        }else{
          $('#cardNumber').removeClass('danger');
          this.card = true;
        }
        if (this.month === ''|| this.month.length <2) {
          $('#month').addClass('danger');
          this.monthB = false;
          this.detach();
        }else {
          $('#month').removeClass('danger');
          this.monthB = true;
        }
        if (this.year === ''|| this.year.length < 4) {
          $('#year').addClass('danger');
          this.yearB = false;
          this.detach();
        }else {
          $('#year').removeClass('danger');
          this.yearB = true;
        }
        if(this.cvv ===  ''|| this.cvv.length <3) {
          $('#cvv').addClass('danger');
          this.cvvB = false;
          this.detach();
        }else
        {
          $('#cvv').removeClass('danger');
          this.cvvB = true;
        }

        /***************place order ******/
      if (this.card && this.cvvB && this.monthB && this.yearB) {
        let data ;
        if ( isPlatformBrowser(this.platformId) ) {
          data = usersModule.getUserData(localStorage.getItem('user_data'));
        }
        if (!usersModule.isRegisteredUser(data)) {
           data.guest_cart = [];
           if ( isPlatformBrowser(this.platformId) ) {     
             localStorage.setItem('guest_cart',JSON.stringify(data.guest_cart));
             localStorage.setItem('user_data', JSON.stringify(data));
           }
           this.detach();
             $('.trigger').click();
              this.router.navigate(['/thank-you']);
        }else {
           let body = {'item': [], 'token': ''}, historyBody = {'item':{}, 'token': ''}, token = '';
           if (isPlatformBrowser(this.platformId)){
            if(localStorage.getItem('user_token')) {
              token = localStorage.getItem('user_token');
            }
           }
             body.item = [];
             body.token = token;
             historyBody.token = token;
             /************* set current date and time ******/
             this.date = '';
             this.date = moment().format('MMM Do YYYY');
              /****************** get user cart first ******/
             this.cartManagementService.getCustomerCart(token).subscribe(data => {
             if(data && data.hasOwnProperty('data') && data.data.length !== 0 && data.data[0].cart[0] !== null) {
              
                Object.keys(data.data[0].cart).map((key, val) => {
                  if(!(data.data[0].cart[val].hasOwnProperty('time'))) {
                    data.data[0].cart[val].time = this.date;
                  }                 
                });
               historyBody.item = data.data[0].cart;
               /************* clear customer cart ******/
               this.cartManagementService.updateCustomerCart(body).subscribe(data => {
                   this.manageOrderHistory(historyBody);
               }, err => {
                 console.log(err);
                 this.detach();
               });
               /************* clearing ends **********/
             }
           }, err => {
             console.log(err);
             this.detach();
           });
        }
      }  
  /*****************ends  **************/
  }

  /*************** update cart *****/
  manageOrderHistory(body) {
    this.cartManagementService.getCustomerHistory(body.token).subscribe(data => {
      /********* if no history found ***/
      if(data && data.hasOwnProperty('data') && data.data.length === 0) {
         this.insertToOrderHistory(body);
      }else
         if(data.data[0].cart[0] === null) {
              this.insertToOrderHistory(body);           
         } else
          {
              Object.keys(data.data[0].cart).map((key, value) => {
                if(!(data.data[0].cart[value].hasOwnProperty('time'))) {
                  data.data[0].cart[value].time = this.date;
                  body.item.push(data.data[0].cart[value]);
                }            
             });
            this.cartManagementService.expandHistory(body).subscribe(data => {
              this.detach();
              $('.trigger').click();
              this.router.navigate(['/thank-you']);
            }, err => {
              console.log(err);
              this.detach();
            });
          }
     }, err => {
       console.log(err);
       this.detach();
     });
  }
  /**************** ends **********/
  setOrder()
  {

  }
  /****************set info ********* */
  changeEvent()
  {
    
  }

/**************** set history ********/
insertToOrderHistory( body ) {
  this.cartManagementService.postItemToCustomerHistory(body).subscribe(data => {
    this.detach();
    $('.trigger').click();
    this.router.navigate(['/thank-you']);
  }, err => {
    console.log(err);
    this.detach();
  });
}
/**************** ends *************/
  setInformation() {
   this.attach();
    /*********validate input ****/
   if (this.firstName === '') {
      $('#firstName').addClass('danger');
    }else{
      $('#firstName').removeClass('danger');
    }
    if (this.lastName === '') {
      $('#lastName').addClass('danger');
    }else {
      $('#lastName').removeClass('danger');
    }
    if (this.phone === '') {
      $('#phone').addClass('danger');
    }else {
      $('#phone').removeClass('danger');
    }
 
    if(this.city === '0') {
      $('#city').addClass('danger');
    }else
    {
      $('#city').removeClass('danger');
    }

    if (this.address === '') {
      $('#address').addClass('danger');
    }else {
      $('#address').removeClass('danger');
    }
   
    /*****************ends  **************/
    /***************set info ***********/
    if(this.firstName !== ''&& this.lastName !== ''
    && this.phone !== '' && this.city !== '0' && this.address !== '') {
      const radio =  $("input[name='address']:checked").val();
      this.addressInterface.firstName = this.firstName;
      this.addressInterface.lastName = this.lastName;
      this.addressInterface.phoneNumber =(Number)(this.phone);
      this.addressInterface.city = this.city;
      this.addressInterface.address = this.address;
      this.addressInterface.delivery = radio;
      this.addressSet = true;
      this.showAddressSet = true ;
      const addressObject = this.addressInterface;
      localStorage.setItem('address', null);
      this.addressMessage = 'Address has been successfully set.';
      setTimeout(() => {
        this.addressSet = false;
        this.firstName = '';
        this.lastName = '';
        this.city = '0';
        this.phone = '';
        this.address = '';
        this.addressMessage = '';
      }, 2000);
      if ( isPlatformBrowser(this.platformId) ){
      localStorage.setItem('address', JSON.stringify(addressObject));
      if (localStorage.getItem('address')) {
        this.storedAddress = JSON.parse(localStorage.getItem('address'));
      }
      this.items = localStorage.getItem('items');
      this.VAT = localStorage.getItem('VAT');
      this.grandTotal = localStorage.getItem('grandTotal');
     }
    }
    $('#loading').hide();
  }

  /****************edit address ************/
  editAddress() {
    this.firstName = this.storedAddress.firstName;
    this.lastName = this.storedAddress.lastName;
    this.city = this.storedAddress.city;
    this.phone = (String)(this.storedAddress.phoneNumber);
    this.address = this.storedAddress.address;
    window.scroll(0, 0);
  }
  removeAddress() {
    localStorage.setItem('address', null);
    this.showAddressSet = false ;
    this.addressMessage = 'Address has been successfully removed.';
    this.addressSet = true;
    setTimeout(() => {
      this.addressSet = false;
      this.addressMessage = '';
    }, 2000);
  }
  ngOnInit() {
     this.showAddressSet = false ;
     if ( isPlatformBrowser(this.platformId) ){
        if(null !== localStorage.getItem('address') && 'null' !== localStorage.getItem('address')) {
            this.storedAddress = JSON.parse(localStorage.getItem('address'));
            this.showAddressSet = true ;
            this.items = localStorage.getItem('items');
            this.VAT = localStorage.getItem('VAT');
            this.grandTotal = localStorage.getItem('grandTotal');
          }else {
            this.showAddressSet = false ;
          }
        }
  }

  attach() {
    $('#loading').show();
  }

  detach() {
    $('#loading').hide();
  }
}
