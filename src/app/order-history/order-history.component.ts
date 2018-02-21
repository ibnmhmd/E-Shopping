import { Component, OnInit } from '@angular/core';
import { CartManagementService } from '../services/cart-management.service';
import { Meta, Title } from '@angular/platform-browser';
declare var require: any;
declare var $:any;
const usersModule = require ('../manage-users-cart');

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
  providers: [CartManagementService]
})
export class OrderHistoryComponent implements OnInit {
  hasLoggedIn: Boolean = false;
  ordersInHistory: String[] = [];
  noOrder: Boolean = false;
  constructor(private cartManagementService: CartManagementService, private meta: Meta, private title:Title) {

    // Sets the <title></title>
    title.setTitle('Orders history');

    // Sets the <meta> tag for the page
    meta.addTags([
      { name: 'author', content: 'Shopping Cart' },
      { name: 'description', content: 'Shopping Cart: view your orders history.' },
    ]);
   }

  getHistory() {
    this.attach();
    let token = '';
           if(localStorage.getItem('user_token')) {
              token = localStorage.getItem('user_token');
           }
       
            /****************** get user cart first ******/
             this.cartManagementService.getCustomerHistory(token).subscribe(data => {
             if(data && data.hasOwnProperty('data') && data.data.length !== 0 && data.data[0].cart[0] !== null) {
                 this.ordersInHistory = data.data[0].cart;
                 this.noOrder = false ;
                 this.detach();
               }else {
                 this.noOrder = true;
                 this.detach();
               }
           }, err => {
             console.log(err);
             this.detach();
           });
  }
  ngOnInit() {
    const data = usersModule.getUserData();
    if(data.mode === 'registered' && data.session === 'loggedIn') {
      this.hasLoggedIn = true ;
      this.getHistory() ;
    }else {
      this.hasLoggedIn = false;
    }
   
  }

   /************** load/unload screen ****/
   attach() {
      $('#loading').show();
    }
  detach() {
    $('#loading').hide();
   }
}
