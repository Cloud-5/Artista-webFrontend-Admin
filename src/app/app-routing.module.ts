import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultLayoutComponent } from './pages/adminPanel/default-layout/default-layout.component';
import { DashboardComponent } from './pages/adminPanel/modules/dashboard/dashboard.component';
import { ArtCategoriesComponent } from './pages/adminPanel/modules/art-categories/art-categories.component';
import { UserManagementComponent } from './pages/adminPanel/modules/user-management/user-management.component';
import { ArtistRequestsComponent } from './pages/adminPanel/modules/artist-requests/artist-requests.component';
import { SignInComponent } from './pages/sign-in/sign-in.component';

const routes: Routes = [
  { path: '', component: SignInComponent},
  { path: 'admin',component: DefaultLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      { path: 'dashboard', component: DashboardComponent },
      { path: 'art-categories', component: ArtCategoriesComponent },
      { path: 'user-management', component: UserManagementComponent },
      { path: 'artist-requests', component: ArtistRequestsComponent },
    ],
  },
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' }, // Redirect to artwork-preview by default
  { path: '**', redirectTo: '/dashboard' }, // Redirect to artwork-preview for any other unknown routes
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
