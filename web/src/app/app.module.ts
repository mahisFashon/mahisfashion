import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
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
import { DiscountFeesDialog } from './modal-components/discountFeesDialog';
import { CustomerDialog } from './modal-components/customerDialog';
import { BusinessObjDialog } from './modal-components/BusinessObjDialog';
import { PayNowDialog } from './modal-components/payNowDialog';
import { PrintReceiptDialog } from './modal-components/printReceiptDialog';
import { ListPageComponent } from './list-page/list-page.component';
import { ShowroomComponent } from './showroom/showroom.component';
import { OrderDialog } from './modal-components/orderDialog';
import { AlertDialog } from './modal-components/alertDialog';
import { DashboardComponent } from './dashboard/dashboard.component';

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
    DiscountFeesDialog,
    CustomerDialog,
    PayNowDialog,
    PrintReceiptDialog,
    ListPageComponent,
    BusinessObjDialog,
    OrderDialog,
    ShowroomComponent,
    AlertDialog,
    DashboardComponent,
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
    MatTableModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule, 
    MatRippleModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [DiscountFeesDialog, CustomerDialog, PayNowDialog, 
    PrintReceiptDialog, BusinessObjDialog, OrderDialog, AlertDialog],
})
export class AppModule { }
