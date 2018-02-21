import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { ProductFullViewComponent } from './product-full-view/product-full-view.component';
import { CartItemsComponent } from './cart-items/cart-items.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { AuthGuardGuard } from './auth-guard.guard';
import { NotFound404Component } from './not-found-404/not-found-404.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'view-product',
    component: ProductViewComponent
  },
  {
    path: 'view-product/:category',
    component: ProductViewComponent
  },
  {
    path: 'full-view/:category/:guid',
    component: ProductFullViewComponent
  },
  {
    path: 'cart-view',
    component: CartItemsComponent
  },
  {
    path: 'secure-checkout',
    component: CheckoutComponent
  },{
    path: 'thank-you',
    component: ThankyouComponent
  },
  {
    path: 'sign-up',
    component: SignUpComponent
  },
  {
    path: 'about-us',
    component: AboutUsComponent
  },{
    path: 'contact-us',
    component: ContactUsComponent
  },
  {
    path: 'admin-panel',
    canActivate: [AuthGuardGuard],
    component: AdminPageComponent
  },
  {
    path: 'order-history',
    component: OrderHistoryComponent
  },
  {
    path: '404',
    component: NotFound404Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuardGuard]
})
export class AppRoutingModule { }
