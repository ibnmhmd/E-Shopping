import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {Router } from '@angular/router';
declare var require: any ;
const userModule = require ('./manage-users-cart');

@Injectable()
export class AuthGuardGuard implements CanActivate {

  constructor(private router: Router) {
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
     if ( userModule.isAdmin() ) {
       return userModule.isAdmin();
     }else {
       this.router.navigate(['404']);
     }
  }
}
