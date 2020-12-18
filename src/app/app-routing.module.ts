import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ContactUsComponent } from './contact-us/contact-us.component';
import { HomeComponent } from './home/home.component';
import {AboutUsComponent } from './about-us/about-us.component';
import {FAQComponent } from './faq/faq.component';
import {SareeComponent }from './saree/saree.component';
import {ZoompageComponent }from './zoompage/zoompage.component';
import { LoginComponent } from './login/login.component';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'contactus', component: ContactUsComponent}, 
    {path: 'aboutus', component: AboutUsComponent}, 
    {path: 'faq', component: FAQComponent}, 
    {path: 'saree', component: SareeComponent},
    {path: 'zoompage', component: ZoompageComponent},
    {path: 'Login', component: LoginComponent},
    {path: 'Admin', component: AdminComponent},
    {path:'authguard', pathMatch: 'full', redirectTo: 'login'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
