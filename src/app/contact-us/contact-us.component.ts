import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
declare var $: any;
@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  name: String = '';
  email: String = '';
  message: String = '';
  nameFlag: Boolean = false ;
  emailFlag: Boolean = false ;
  messageFlag: Boolean = false ;
  created: Boolean = false;
  constructor(private meta: Meta, private title:Title) {
      // Sets the <title></title>
      title.setTitle('Shopping-Cart: Contact Us');

     // Sets the <meta> tag for the page
     meta.addTags([
       { name: 'author', content: 'Shopping Cart' },
       { name: 'description', content: 'Shopping Cart: use the following forms to be in touch with us .' },
     ]);

   }


  sendMessage() {
    this.validateInputs();
    if (this.nameFlag && this.messageFlag && this.emailFlag) {
      this.email = '';
      this.message = '';
      this.name = '';
      this.created = true;
      setTimeout(() => {
        this.created = false;
        window.scroll(0 , 0);
      }, 7000);
    }
  }
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
  
      if (this.message === '' || this.message.length < 10) {
        $('#message').addClass('danger');
        this.messageFlag = false;
      }else {
        $('#message').removeClass('danger');
        this.messageFlag = true;
      }
    }
    /**************end ***********/

    validateEmail(email) {
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email.toLowerCase());
  }

  ngOnInit() {

    window.scroll(0, 0 );
  }

}
