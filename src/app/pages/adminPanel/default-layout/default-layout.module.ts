import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { DefaultLayoutComponent } from './default-layout.component';

import { DashboardComponent } from '../modules/dashboard/dashboard.component';
import { ArtCategoriesComponent } from '../modules/art-categories/art-categories.component';
import { UserManagementComponent } from '../modules/user-management/user-management.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { ArtistRequestsComponent } from '../modules/artist-requests/artist-requests.component';
//import { AlertComponent } from '../../../shared/components/alert/alert.component';
import { AlertModule } from '../../../shared/components/alert/alert.module';

import {FormsModule} from "@angular/forms";

import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DefaultLayoutComponent,
    DashboardComponent,
    ArtCategoriesComponent,
    UserManagementComponent,
    ModalComponent,
    ArtistRequestsComponent,
    // AlertComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule
  ],
  exports: [
    DefaultLayoutComponent
  ],
  providers: [
  ]
})
export class DefaultLayoutModule { }
