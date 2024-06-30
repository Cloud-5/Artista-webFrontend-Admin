import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtHelperService } from './jwt-helper.service';
import { AlertService } from './alert.service';
import { error } from 'console';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router, private jwtHelper: JwtHelperService, private alertService: AlertService) {}

  canActivate(): boolean {
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('accessToken');
      if (token && !this.jwtHelper.isTokenExpired(token)) {
        return true;
      } else {
        this.router.navigate(['/']);
        return false;
      }
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}

