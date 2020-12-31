import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { HomeComponent } from './home/home.component';
import { MatGridListModule} from '@angular/material/grid-list';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { FAQComponent } from './faq/faq.component';
import { FooterComponent } from './footer/footer.component';
import { SareeComponent } from './saree/saree.component';
import { ZoompageComponent } from './zoompage/zoompage.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { ProductDetailsComponent } from './product-details/product-details.component';
import { ProductListComponent } from './product-list/product-list.component';
import { MyposComponent } from './mypos/mypos.component';
import { DiscountModalComponent } from './modal-components/discount-modal.component';
import { DiscountFeesDialog } from './modal-components/discountFeesDialog';
import { CustomerDialog } from './modal-components/customerDialog';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    HomeComponent,
    ContactUsComponent,
    AboutUsComponent,
    FAQComponent,
    FooterComponent,
    SareeComponent,
    ZoompageComponent,
    LoginComponent,
    AdminComponent,
    ProductDetailsComponent,
    ProductListComponent,
    MyposComponent,
    DiscountModalComponent,
    DiscountFeesDialog,
    CustomerDialog,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    FormsModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatAutocompleteModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DiscountFeesDialog, CustomerDialog],
})
export class AppModule { }
