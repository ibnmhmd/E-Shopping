import { Component, OnInit, Input  } from '@angular/core';
import { ActivatedRoute, Router, NavigationStart, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styleUrls: ['./breadcrumbs.component.scss']
})
export class BreadcrumbsComponent implements OnInit {

  @Input()
  path: String = '';
  categoryName: String = '';
  defaultPath: String = '';
  newPath: String = '';
  constructor( private route: ActivatedRoute,
    private router: Router) {this.defaultPath = route.url['value'][0].path; }

  ngOnInit() {
    this.route.params.forEach(params => {
      if(this.route.snapshot.params ['category'])
      {
        this.categoryName = this.route.snapshot.params ['category'];
      }else{
        this.categoryName = '';
      }
      if(this.categoryName === '') {
       this.newPath = this.defaultPath;
      }
    })
  }

}
