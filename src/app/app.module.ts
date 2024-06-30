import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { HTTP_INTERCEPTORS, HttpClientModule,provideHttpClient, withFetch } from '@angular/common/http';
import { AuthInterceptor } from './shared/services/auth.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { HighchartsChartModule } from 'highcharts-angular';

import { DefaultLayoutModule } from './pages/adminPanel/default-layout/default-layout.module';
import { FormsModule } from '@angular/forms';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { ForgotPwdComponent } from './pages/forgot-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './pages/reset-pwd/reset-pwd.component';

//import { AlertComponent } from './shared/components/alert/alert.component';
import { AlertModule } from './shared/components/alert/alert.module';

@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    ForgotPwdComponent,
    ResetPwdComponent,
    //AlertComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    DefaultLayoutModule,
    HighchartsChartModule,
    FormsModule,
    AlertModule
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
