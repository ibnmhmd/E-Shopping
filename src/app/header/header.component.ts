import { Component, OnInit , Inject, PLATFORM_ID} from '@angular/core';
import { Form } from '@angular/forms/src/directives/form_interface';
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { EventEmiter } from '../interfaces/eventEmitter.interface';
import { SignUpService } from '../services/sign-up.service';
import { CartManagementService } from '../services/cart-management.service';
import SimpleCryptoJS from 'simple-crypto-js';
import { tokenKey } from '@angular/core/src/view/util';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

declare var require: any;
const usersModule = require('../manage-users-cart');
declare var $: any ;

const SECRET_KEY = 'XHER32985RTBDFMGNDKJS5643FAZQW';
const simpleCrypto = new SimpleCryptoJS(SECRET_KEY);

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [SignUpService, CartManagementService]
})
export class HeaderComponent implements OnInit {
  counter: Number = 0 ;
  email: String = '';
  pass: String = '';
  loginForm: any;
  userError: Boolean = false;
  userLoggedOut: Boolean = true ;
  user: String = '';
  userMode: EventEmiter;
  admin: Boolean = false ;
  constructor(private fb: FormBuilder, private route: ActivatedRoute,
    private router: Router, private signUpService: SignUpService, @Inject(PLATFORM_ID) private platformId: Object, 
    private cartManagementService: CartManagementService) {
    this.loginForm = fb.group({
          password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
          email: ['', Validators.email]
      });
  }

  /********* wrong email or password ******/
  wrongEmailAndOrPassword() {
    this.userError = true;
        setTimeout(() => {
          this.userError = false;
        }, 2000);
  }
  /*********** get first name ******/
  getFirstName(fullName) {
    if (fullName) {
        let _name = [];
        if ( fullName.indexOf(' ') !== -1 ) {
          _name = fullName.split(' ');
          return _name[0];
        }else {
          return fullName;
        }
    }else {
           return fullName;
    }
  }
  /***************** sign in *****************/
  submitForm(form) {
    $('#loading').show();
   if ( form.valid) {
      let  users;
      if ( isPlatformBrowser(this.platformId) ) {
           users =  usersModule.getAllRegisteredUsers(localStorage.getItem('users')) ;
       } 
      const user =  usersModule.getCurrentUserByEmail(form.value.email);
      let guestCart ;
      if (isPlatformBrowser(this.platformId)) {
        guestCart =  localStorage.getItem('guest_cart');
        }
           /************** passwords don't match ********/
             let object = {
               'email': form.value.email,
               'password': form.value.password
             }, userName = '', userToken = '', userEmail = '';
            this.signUpService.validateUserPassword(object).subscribe(user => {
            
              if(user && user.message === 'password mismatched') {
                this.detach();
                this.wrongEmailAndOrPassword();            
              }else {                
                if(user.status === 200 && user.data.length > 0 ) {
                  userName =  user.data[0].name;
                  userToken = user.data[0].token;
                  userEmail = user.data[0].email;
                  if (isPlatformBrowser(this.platformId))
                  {localStorage.setItem('user_token', userToken);}

                  this.user = this.getFirstName(userName);
                  /************** if registered but not returning user ***/
                  let userMode = "";
                  if (isPlatformBrowser(this.platformId)) {
                     userMode = localStorage.getItem('userMode');
                  }
                  if('Returning' !== userMode ) {
                    const user_data = {
                       'session' : 'loggedIn',
                       'mode': 'registered',
                       'name' : this.user,
                       'email': userEmail
                    };
                    if (isPlatformBrowser(this.platformId)) {
                      localStorage.setItem('user_data', JSON.stringify(user_data));
                    }
                    
                    this.userLoggedOut = !this.userLoggedOut;
                    this.setCartCount();
                    this.detach();
                    this.isAdmin();
                    this.router.navigate(['/']);
                  }else {
                       /*************** returning user for checkout ****/
                    let cartItems  = [], userCart= [];
                    if(guestCart) {
                      cartItems = JSON.parse(guestCart);
                      if (isPlatformBrowser(this.platformId)) {
                        localStorage.setItem('guest_cart', JSON.stringify([]));
                      }
                    }
                        const user_data = {
                           'session' : 'loggedIn',
                           'mode': 'registered',
                           'name' : this.user,
                           'email': userEmail
                        };
                        this.isAdmin();
                    /*********** get previous items in customer cart ***/
                      this.cartManagementService.getCustomerCart(userToken).subscribe(data => {
                        
                        /************* extend old cart items if found  ******/
                        if(data && data.hasOwnProperty('data') && data.data.length >0) {
                           userCart = data.data[0].cart;
                          if(userCart) {
                            Object.keys(cartItems).map((key, value) => {
                              userCart.push(cartItems[value])
                            });
                           }
                          }else {
                            userCart = cartItems;
                          }
                       /************** replace user cart *********/
                       let body = {'item': {}, 'token': ''};
                       body.item = userCart;
                       body.token = userToken;

                       this.cartManagementService.updateCustomerCart(body).subscribe(data => {
                        
                        if (isPlatformBrowser(this.platformId)) {
                          localStorage.setItem('user_data', JSON.stringify(user_data));
                          this.userLoggedOut = !this.userLoggedOut;
                          localStorage.setItem('items', '');
                        }
                        this.cartManagementService.getCustomerCart(userToken).subscribe(data => {
                        
                          if( data && data.hasOwnProperty('data') && data.data.length > 0 ) {  
                            if (isPlatformBrowser(this.platformId)) {
                              localStorage.setItem('items', (String)(data.data[0].cart.length));
                            }                   
                             
                              /************** update VAT and no of Items***/
                              let cost = 0, VAT = 0, grandTotal = 0 ;
                              Object.keys(data.data[0].cart).map((key, value) => {
                                 cost += data.data[0].cart[value].price;
                              });
                              /****************** ends ******************/
                              VAT = usersModule.calculateVAT(cost);
                              grandTotal = cost + VAT ;
                              if (isPlatformBrowser(this.platformId))  {
                                localStorage.setItem('VAT', (String)(VAT))
                                localStorage.setItem('grandTotal', (String)(grandTotal));
                              }
                              this.detach();
                              this.setCartCount();
                              this.router.navigate(['/secure-checkout']); 
                           }

                        }, err => {
                          this.detach();
                          console.log(err);
                        });
                       }, err => {
                         this.detach();
                         console.log(err);
                       });                                         
                    }, err => {
                      console.log(err);
                      this.detach();
                    });
                  }
                }
              }
            }, err => {
              console.log(err)
              this.detach();
            }); 
    }else {
      this.wrongEmailAndOrPassword();
      this.userLoggedOut = true;
    }
   }
/*************log out  ********/
logoutUser() {
  this.guestUserData();
  this.userLoggedOut = true;
  this.admin = false;
  this.setCartCount();
}
  openPanel() {
    setTimeout(() => {
      $('.slideInRight').addClass('open');
      $('.dropdown-toggle').attr('aria-expanded',' true'); 
    }, 1000);
  }
  /*************** cart count for guest and registered users************/
  setCartCount() {
   let  data ;
   if ( isPlatformBrowser(this.platformId) ) {
    data =  usersModule.getUserData(localStorage.getItem('user_data'));
   }
    setTimeout(() => {
      /*********** guest cart count *****/
      if ( isPlatformBrowser(this.platformId) ){
         
        if (!usersModule.isRegisteredUser(data)) {
          if (data.guest_cart ) {
             this.counter = data.guest_cart.length;
           }else {
             this.counter = 0;
           }
          }else {
            let token ;
            if (isPlatformBrowser(this.platformId)) {
               token = localStorage.getItem('user_token');
            }
            this.cartManagementService.getCustomerCart(token).subscribe( payLoad => {
              console.log("user cart :::"+ payLoad.data[0].cart[0])
              if ( payLoad && payLoad.hasOwnProperty('data') && payLoad.data.length > 0) {
                if ( payLoad.data[0].cart.length > 0 && payLoad.data[0].cart[0] !== null) {
                  this.counter = payLoad.data[0].cart.length;
                }else {
                  this.counter = 0;
                }
                }else {
                this.counter = 0;
                }
                this.detach();
               }, err => {
               console.log(err);
               this.detach();
             });
            }
      }
     }, 1000);
  }
/******************** ends  *************/
  ngOnInit() {
    this.setCartCount();
    this.admin = false;
    this.isAdmin();
    if (isPlatformBrowser(this.platformId)) {
      // Client only code.

       }
   if (isPlatformServer(this.platformId)) {
     // Server only code.
     }

     /******* check if client side ****/
     if (isPlatformBrowser(this.platformId)) {
          // Client only code.
          let user_data ; 
          if (localStorage.getItem('user_data')) {
             user_data = JSON.parse(localStorage.getItem('user_data'));
            if (user_data.session === 'loggedIn') {
              this.userLoggedOut = !this.userLoggedOut;
              this.user = user_data.name;
            }
          }else {
            this.guestUserData();
          }
       }
  }

  /************** set guest user info ****/
  guestUserData() {
    let cart ;
    if (isPlatformBrowser(this.platformId)) {
      if (localStorage.getItem('guest_cart')) {
        cart = JSON.parse(localStorage.getItem('guest_cart'));
      }else {
         cart = [];
       }
    }

    const user_data = {
      'session' : 'loggedOut',
      'mode': 'guest',
      'name' : '',
      'email': '',
      'guest_cart': cart
    };
    if (isPlatformBrowser(this.platformId))  {
      localStorage.setItem('user_token', '');
      localStorage.setItem('user_data', JSON.stringify(user_data));
      localStorage.setItem('userMode', 'Guest');
      this.router.navigate(['/']);
    }
  }
  /*************** ends  ********/
  isAdmin(){
    const data = usersModule.getUserData();
    if(data) {
      if(data.session === 'loggedIn' && data.mode === 'registered'&& data.email === 'amine.admin@mail.com') {
           this.admin = true;
       }
    }
  }
  /**************** ends ***********/

  /**************** get user by email **/
  validatePassword(object) {
    let userByEmail: Number = 0;
        this.signUpService.validateUserPassword(object).subscribe(user => {
          if(user && user.hasOwnProperty('data') && user.message === 'password matched') {
            userByEmail = user.data;
          }
            if(userByEmail >= 1) {
              this.detach();         
            }else {
            }
        }, err => {
          console.log(err)
          this.detach();
        }); 
/********************* checking ends **********/
  }

   /************ unload ****/
   detach() {
    $('#loading').hide();
  }
  attach() {
    $('#loading').show();
  }
  /********** ends ********/

  /********** redirect ***/
  redirect() {
    $('.log').removeClass('open');
  }
}
