import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { PartialsComponent } from './partials/partials.component';
import { ProductViewComponent } from './product-view/product-view.component';
import { ProductCategoryComponent } from './partials/product-category/product-category.component';
import { HttpModule } from '@angular/http';
import { ProductFullViewComponent } from './product-full-view/product-full-view.component';
import { BreadcrumbsComponent } from './partials/breadcrumbs/breadcrumbs.component';
import { FormsModule , ReactiveFormsModule  } from '@angular/forms';
import { CartItemsComponent } from './cart-items/cart-items.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AdminPageComponent } from './admin-page/admin-page.component';
import { AdminPanelComponent } from './partials/admin-panel/admin-panel.component';
import { OrderHistoryComponent } from './order-history/order-history.component';
import { NotFound404Component } from './not-found-404/not-found-404.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PartialsComponent,
    ProductViewComponent,
    ProductCategoryComponent,
    ProductFullViewComponent,
    BreadcrumbsComponent,
    CartItemsComponent,
    CheckoutComponent,
    ThankyouComponent,
    SignUpComponent,
    AboutUsComponent,
    ContactUsComponent,
    AdminPageComponent,
    AdminPanelComponent,
    OrderHistoryComponent,
    NotFound404Component
  ],
  imports: [
    BrowserModule.withServerTransition({appId: 'shopping-cart-master'}),
    AppRoutingModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
