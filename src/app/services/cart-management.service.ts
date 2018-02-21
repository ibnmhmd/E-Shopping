import { Injectable } from '@angular/core';
import { Http,  Response, Headers, URLSearchParams, RequestOptions, QueryEncoder } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class CartManagementService {

  constructor(private http: Http) { }

/******************** post item to customer cart *****/
postItemToCustomerCart(requestBody) {
  if(requestBody)
  {  
    let headers = new Headers({});
    let options = new RequestOptions({ headers: headers});
    let body = new URLSearchParams();
    if(requestBody.hasOwnProperty('item')) {
      body.set('item',JSON.stringify(requestBody.item));
    }
  
    if(requestBody.hasOwnProperty('token')) {
      body.set('token', requestBody.token);
    }

    return this.http.post('/postItem', body, options).map(data => data.json()).catch(this.catch);
  } 
}
/*********************** ends ***************/

/******************** post item to customer cart *****/
expandCustomerCart(requestBody) {
  if(requestBody)
  {  
    let headers = new Headers({});
    let options = new RequestOptions({ headers: headers});
    let body = new URLSearchParams();
    if(requestBody.hasOwnProperty('item')) {
      body.set('item',JSON.stringify(requestBody.item));
    }
  
    if(requestBody.hasOwnProperty('token')) {
      body.set('token', requestBody.token);
    }
    return this.http.put('/expandUserCart', body, options).map(data => data.json()).catch(this.catch);
  } 
}
/*********************** ends ***************/

/******************** post item to customer cart *****/
updateCustomerCart(requestBody) {
  if(requestBody)
  {  
    let headers = new Headers({});
    let options = new RequestOptions({ headers: headers});
    let body = new URLSearchParams();
    if(requestBody.hasOwnProperty('item')) {
      body.set('item',JSON.stringify(requestBody.item));
    }
  
    if(requestBody.hasOwnProperty('token')) {
      body.set('token', requestBody.token);
    }
    return this.http.put('/updateUserCart', body, options).map(data => data.json()).catch(this.catch);
  } 
}
/*********************** ends ***************/

/******************** post item to customer cart *****/
getCustomerCart(token) {
  if(token)
  {  
    return this.http.get('/getUserCart?token='+token).map(data => data.json()).catch(this.catch);
  } 
}
/***************** ends **********************/

/******************** post item to customer cart *****/
postItemToCustomerHistory(requestBody) {
  if(requestBody)
  {  
    let headers = new Headers({});
    let options = new RequestOptions({ headers: headers});
    let body = new URLSearchParams();
    if(requestBody.hasOwnProperty('item')) {
      body.set('item',JSON.stringify(requestBody.item));
    }
  
    if(requestBody.hasOwnProperty('token')) {
      body.set('token', requestBody.token);
    }

    return this.http.post('/postItemInHistory', body, options).map(data => data.json()).catch(this.catch);
  } 
}
/*********************** ends ***************/

/******************** post item to customer cart *****/
expandHistory(requestBody) {
  if(requestBody)
  {  
    let headers = new Headers({});
    let options = new RequestOptions({ headers: headers});
    let body = new URLSearchParams();
    if(requestBody.hasOwnProperty('item')) {
      body.set('item',JSON.stringify(requestBody.item));
    }
  
    if(requestBody.hasOwnProperty('token')) {
      body.set('token', requestBody.token);
    }
    return this.http.put('/expandUserOrderHistory', body, options).map(data => data.json()).catch(this.catch);
  } 
}
/*********************** ends ***************/
/******************** post item to customer cart *****/
getCustomerHistory(token) {
  if(token)
  {  
    return this.http.get('/getUserOrderHistory?token='+token).map(data => data.json()).catch(this.catch);
  } 
}
/***************** ends **********************/


    /***************** catch error *****/
    catch(error) {
      return Observable.throw(error.json() || 'Error processing cart, please try again.');
    }
}
