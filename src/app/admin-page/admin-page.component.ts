import { Component, OnInit } from '@angular/core';
declare var require: any ;
const usersModule = require ('../manage-users-cart');

@Component({
  selector: 'app-admin-page',
  templateUrl: './admin-page.component.html',
  styleUrls: ['./admin-page.component.scss']
})
export class AdminPageComponent implements OnInit {
 adminName: String = '';
 isAdmin: Boolean = false;
  constructor() { }

  /************* get admin name by email ****/
  getAdminName() {
    const data = usersModule.getUserData();
    let array= [];
   if(data) {
     if(usersModule.isAdmin()) {
        this.adminName = data.name;
     }
   }

  }
  ngOnInit() {
    this.getAdminName();
    // const data = usersModule.getUserData();
    // if(data.email === 'amine.admin@mail.com') {
    //   this.isAdmin = true ;
    // }
  }

}
