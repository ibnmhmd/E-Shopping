import { Injectable } from '@angular/core';
import { Http,  Response, Headers, URLSearchParams, RequestOptions, QueryEncoder } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class SignUpService {

  constructor(private http: Http) { }
  
  /*************** create new usere ******/
  createNewUser(requestParam) {

    if(requestParam) {
      let headers = new Headers({});
      let options = new RequestOptions({ headers: headers});

       let body = new URLSearchParams();
       body.set('name', requestParam.name);
       body.set('password', requestParam.password);
       body.set('email', requestParam.email);
       body.set('user_token', requestParam.user_token);
       
      return this.http.post('/createUser', body , options ).map(data => data.json()).catch(this.catch);
    }
  }
/********************* ends ***************/

/*************** get all users ************/
getRegisteredUserByEmail(email) {
  if(email)
  {
     return this.http.get('/getUserByEmail?email='+email).map(data => data.json()).catch(this.catch);
  } 
}
/******************* ends *****************/

/******************** validate password *****/
validateUserPassword(object) {
  if(object)
  {  
    let headers = new Headers({});
    let options = new RequestOptions({ headers: headers});
    let body = new URLSearchParams();
  
     if(object.hasOwnProperty('email')) {
        body.set('email', object.email);
     }

     if(object.hasOwnProperty('password')) {
      body.set('password', object.password);
     }
     return this.http.post('/validatePassword', body, options).map(data => data.json()).catch(this.catch);
  } 
}
  /***************** catch error *****/
  catch(error) {
    return Observable.throw(error.json() || 'Error creating user');
  }
}
