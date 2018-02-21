import { Injectable } from '@angular/core';
import {GlobalPaths} from '../global';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Categories } from '../enum/categories.enum';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class ShoppingCategoryServiceService {
  private  CATEGORY_PATH = GlobalPaths.MEN_PATH;
  private ELECTRONICS_PATH = GlobalPaths.ELEC_PATH;
  private NO_DATA_PATH = GlobalPaths.NO_DATA_PATH;
  constructor(private http: Http) { }

  /************get shopping categories *********/
  getShoppingCategories(type) {
    switch(type) {
      case Categories.men:
      return this.getMenCategories();

      case Categories.electronics:
      return this.getElectronicsCategories();

      case Categories.recommendations:
      return this.getElectronicsCategories();

      default: 
      return this.noData();
     
    }
    
  }
  /******************* ends ********************/

  /*************** get men's ******/
  getMenCategories(): Observable<any[]> {
    return this.http
    .get(this.CATEGORY_PATH)
    .map(resp => resp.json().men)
    .catch((error: any) => Observable.throw(error.json()));
  }

  /*************** get electronics ********/
  getElectronicsCategories():  Observable<any[]> {
    return this.http
    .get(this.ELECTRONICS_PATH)
    .map(resp => resp.json().electronics)
    .catch((error: any) => Observable.throw(error.json()));
  }

    /*************** get electronics ********/
    noData():  Observable<any[]> {
      return this.http
      .get(this.NO_DATA_PATH)
      .map(resp => resp.json().no_data)
      .catch((error: any) => Observable.throw(error.json()));
    }
  /******************* get users ******/
  getUsers()
  {
    return this.http.get('/getUsers').map(data => data.json()).catch((error: any) => Observable.throw(error.json()));
  }
}
