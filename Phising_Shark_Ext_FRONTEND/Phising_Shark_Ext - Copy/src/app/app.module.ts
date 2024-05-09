///<reference types="chrome"/>
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GetBrowserUrlComponent } from './Components/get-browser-url/get-browser-url.component';
import { GetUrlStatusService } from './Services/get-url-status.service';
import { HttpClientModule } from '@angular/common/http';
import { GetReportComponent } from './Components/get-browser-url/get-report/get-report.component';
import { CommonModule } from '@angular/common';
import { NgForOf } from '@angular/common';
import { ManualCheckComponent } from './Components/get-browser-url/manual-check/manual-check.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HowToPreventComponent } from './Components/get-browser-url/how-to-prevent/how-to-prevent.component';
import { jsPDF } from 'jspdf';
import { EmailReportComponent } from './Components/get-browser-url/email-report/email-report.component';

const appRoutes: Routes = [
  // set the default routing component
  { path: '', redirectTo: '/getcurrenturl', pathMatch: 'full' },

  // add all the created components for routing
  { path: 'getcurrenturl', component: GetBrowserUrlComponent },
  { path: 'see-report', component: GetReportComponent },
  { path: 'manual-check', component: ManualCheckComponent },
  { path: 'how-to-prevent', component: HowToPreventComponent },
  { path: 'email-report', component: EmailReportComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    GetBrowserUrlComponent,
    GetReportComponent,
    ManualCheckComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    CommonModule,
    NgForOf,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    GetUrlStatusService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
