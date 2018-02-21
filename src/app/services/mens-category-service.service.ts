import { Injectable } from '@angular/core';
import {GlobalPaths} from '../global';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class MensCategoryServiceService {
  private  CATEGORY_PATH = GlobalPaths.MEN_PATH;
  constructor(private http: Http) { }

  /************get men's categories *********/
  getMensCategories(): Observable<any[]> {
    return this.http
      .get(this.CATEGORY_PATH)
      .map(resp => resp.json().men)
      .catch((error: any) => Observable.throw(error.json()));
  }
  /******************* ends ********************/
}
