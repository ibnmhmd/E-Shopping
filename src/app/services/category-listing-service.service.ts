import { Injectable } from '@angular/core';
import {GlobalPaths} from '../global';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

@Injectable()
export class CategoryListingServiceService {
  private  CATEGORY_PATH = GlobalPaths.CAT_PATH;
  private  MOST_POPULAR_PATH = GlobalPaths.POP_PATH;
  private  RECOM_POPULAR_PATH = GlobalPaths.REC_PATH;

  constructor(private http: Http) { }

  getDummy() {
    return this.http
    .get('//api.jsonbin.io/b/5a894061a121bc097fe6c31b')
    .map(resp => resp.json())
    .catch((error: any) => Observable.throw(error.json()));
  }
  /***********get categories  **************/
  getCategories(): Observable<any[]> {
    return this.http
      .get(this.CATEGORY_PATH)
      .map(resp => resp.json().categories)
      .catch((error: any) => Observable.throw(error.json()));
  }
  /******************* ends ********************/

   /***********get categories  **************/
   getMostPopular(): Observable<any[]> {
    return this.http
      .get(this.MOST_POPULAR_PATH)
      .map(resp => resp.json().most_popular)
      .catch((error: any) => Observable.throw(error.json()));
  }
  /******************** ends  ***************/

     /***********get recommendations  **************/
     getRecommendations(): Observable<any[]> {
      return this.http
        .get(this.RECOM_POPULAR_PATH)
        .map(resp => resp.json().recommendations)
        .catch((error: any) => Observable.throw(error.json()));
    }
    /******************** ends  ***************/

}
