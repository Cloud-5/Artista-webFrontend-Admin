import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignInService } from '../sign-in/sign-in.service';
import { Router } from '@angular/router';
import { AlertService } from '../../shared/services/alert.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.css'
})
export class SignInComponent{

  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private signInService: SignInService, private router: Router, private alertService: AlertService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  signIn() {
    if (this.loginForm?.valid) {
      const email = this.loginForm.get('email')?.value;
      const password = this.loginForm.get('password')?.value;
      if (email && password) {
        this.signInService.login(email, password).subscribe(
          (response: any) => {
            if(typeof window !== undefined){
              localStorage.setItem('accessToken', response.accessToken);
              localStorage.setItem('admin_id', response.admin_id);
            }
            this.router.navigate(['/dashboard'])
          },
          (error: any) => {
            if (error.status === 401) {
              this.errorMessage = 'Email or password is incorrect';
            } else {
              this.errorMessage = 'An error occurred during login';
            }
          }
        );
      } else {
        this.errorMessage = 'Email or password is Null';
      }
    } 
  }



}
