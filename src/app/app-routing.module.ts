import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './pages/adminPanel/default-layout/default-layout.component';
import { DashboardComponent } from './pages/adminPanel/modules/dashboard/dashboard.component';
import { ArtCategoriesComponent } from './pages/adminPanel/modules/art-categories/art-categories.component';
import { UserManagementComponent } from './pages/adminPanel/modules/user-management/user-management.component';
import { ArtistRequestsComponent } from './pages/adminPanel/modules/artist-requests/artist-requests.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';
import { ForgotPwdComponent } from './pages/forgot-pwd/forgot-pwd.component';
import { ResetPwdComponent } from './pages/reset-pwd/reset-pwd.component'
import { AuthGuard } from './shared/services/authGuard.service';

const routes: Routes = [
  { path: '', component: SignInComponent},
  { path: 'forgot-password', component: ForgotPwdComponent},
  { path: 'reset-password', component: ResetPwdComponent},
  { path: 'admin',component: DefaultLayoutComponent, canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard' ,pathMatch: 'full'},
      { path: 'dashboard', component: DashboardComponent },
      { path: 'art-categories', component: ArtCategoriesComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'artist-requests', component: ArtistRequestsComponent },
    ],
  },
  { path: '**', redirectTo: '/admin/dashboard' }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
