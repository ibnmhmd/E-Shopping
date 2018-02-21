import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import SimpleCryptoJS from 'simple-crypto-js';
import { SignUpService } from '../services/sign-up.service';
import { Meta, Title } from '@angular/platform-browser';

declare var $: any ;

const USER_TOKEN  = SimpleCryptoJS.generateRandom();
const SECRET_KEY = 'XHER32985RTBDFMGNDKJS5643FAZQW' ;
const simpleCrypto = new SimpleCryptoJS(SECRET_KEY);

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
  providers : [SignUpService]
})
export class SignUpComponent implements OnInit {
  name: String = '';
  email: String = '';
  pass: String = '';
  repass: String = '';
  nameFlag: Boolean = false ;
  emailFlag: Boolean = false ;
  passFlag: Boolean = false ;
  repassFlag: Boolean = false ;
  passwordError: Boolean = false;
  user: any = {};
  errorLog: String = '';
  created: Boolean = false;

  


  
  constructor(private route: ActivatedRoute,
    private router: Router, private signUpService: SignUpService,
  private title: Title, private meta:Meta) { 
      // Sets the <title></title>
      title.setTitle('Shopping-Cart: Sign Up');

     // Sets the <meta> tag for the page
     meta.addTags([
       { name: 'author', content: 'Shopping Cart' },
       { name: 'description', content: 'Shopping Cart: sign up to our shopping cart' },
     ]);

  }
    
  createAccount() {
  
    this.validateInputs();
    if (this.nameFlag && this.passFlag && this.repassFlag && this.emailFlag) {
      $('#loading').show();
      if (this.pass !== this.repass) {
        this.passwordError = true;
        this.errorLog = 'Error!  Password mismatched .';
        setTimeout(() => {
          this.passwordError = false;
          this.errorLog = '';
        }, 3000);
       this.detach();
      }else {
        $('#loading').show();
        this.user = {
          'name': this.name,
          'email': this.email,
          'password': this.pass.toString(),
          'user_token': USER_TOKEN,
          'items_in_cart': []
        };
        let userByEmail: Number = 0;
          /********* check for existing user  *****/
          this.signUpService.getRegisteredUserByEmail(this.email).subscribe(user => {
            if(user && user.hasOwnProperty('count')) {
              userByEmail = user.count;
            }
              if(userByEmail >= 1) {
                this.detach();
                this.emailIsInUse();           
              }else {
                this.insertAccountInfo();
              }
          }, err => {
            console.log(err)
            this.detach();
          }); 
          /********************* checking ends **********/
      }
    }
  }

  open() {
     this.router.navigate(['/']);
    $('.userPanel').click();
  }

  /*************** create account ******/
  insertAccountInfo() {
    this.signUpService.createNewUser( this.user ).subscribe(data =>
      {
        if(data.status === 200 && 'user created' === data.message) {
           this.detach();
           this.userCreated();
        } 
      }
       ,err => {
         this.userNotCreated();
         console.log(err);
         this.detach();
       });
  }
  /***************** ends **************/
  /***************** user created ****/
  userCreated() {
    this.created = true ;
    this.email = '';
    this.name = '';
    this.pass = '';
    this.repass = '';
    window.scroll( 0, 0);
    
    setTimeout(() => {
      this.created = false;
      this.router.navigate(['/']);
    }, 3000);

  }
  /***************** ends ****/

  /**************** check if new user is all registered ***/
  emailIsInUse() {
        this.errorLog = 'Sorry, (' + this.email + ') is already in use .';
        this.passwordError = true;
        setTimeout(() => {
          this.errorLog = '';
          this.passwordError = false ;
        }, 3000);   
  };
  /******************** ends ******************/
  /***************** user created ****/
  userNotCreated() {
    this.passwordError = true;
    this.errorLog = "Error creating account, please try again !";
    setTimeout(() => {
      this.errorLog = "";
      this.passwordError = false;
    }, 3000);

  }
  /***************** ends ****/
  /************validate*****/
  validateInputs() {
    if (this.name === '' || this.name.length < 5) {
      $('#name').addClass('danger');
      this.nameFlag = false;
    }else {
      $('#name').removeClass('danger');
      this.nameFlag = true;
    }

    if (this.email === '' || ! this.validateEmail(this.email)) {
      $('#email').addClass('danger');
      this.emailFlag = false;
    }else {
      $('#email').removeClass('danger');
      this.emailFlag = true;
    }

    if (this.pass === '' || this.pass.length < 5) {
      $('#pass').addClass('danger');
      this.passFlag = false;
    }else {
      $('#pass').removeClass('danger');
      this.passFlag = true;
    }

    if (this.repass === '' || this.repass.length < 5) {
      $('#re-pass').addClass('danger');
      this.repassFlag = false;
    }else {
      $('#re-pass').removeClass('danger');
      this.repassFlag = true;
    }
   
  }
  /**************end ***********/

   validateEmail(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
}
  ngOnInit() {
  }

  /************ unload ****/
  detach() {
    $('#loading').hide();
  }
}
