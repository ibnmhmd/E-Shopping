import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrls: ['./about-us.component.scss']
})
export class AboutUsComponent implements OnInit {
  categoryName: String = 'About Us';

  constructor( private route: ActivatedRoute,
    private router: Router, private title:Title, private meta:Meta) {
        // Sets the <title></title>
        title.setTitle('Shopping-Cart: About Us');

        // Sets the <meta> tag for the page
        meta.addTags([
          { name: 'author', content: 'Shopping Cart' },
          { name: 'description', content: 'Shopping Cart: about us, helps you to know more about who we\'re.' },
        ]);

     }

  ngOnInit() {
    this.route.params.forEach(params => {
      window.scroll(0, 0 );
          if(this.route.snapshot.params ['category'])
          {
            this.categoryName = this.route.snapshot.params ['category'];
          }})
  }

}
