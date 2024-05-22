import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ResetPwdService } from './reset-pwd.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-reset-pwd',
  templateUrl: './reset-pwd.component.html',
  styleUrl: './reset-pwd.component.css'
})
export class ResetPwdComponent {

  newPasswordForm: FormGroup;
  

  constructor(private fb: FormBuilder, private resetPwdService: ResetPwdService, private router: Router) {
    this.newPasswordForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.validateUpperCase,
        this.validateLowerCase, 
        this.validateNumber,  
        this.validateSpecial 
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.matchPasswords });
  }

  validateUpperCase(control: { value: string; }) {
    const upperCaseCharacters = /[A-Z]/;
    if (!upperCaseCharacters.test(control.value)) {
      return { uppercase: true };
    }
    return null;
  }

  validateLowerCase(control: { value: string; }) {
    const lowerCaseCharacters = /[a-z]/;
    if (!lowerCaseCharacters.test(control.value)) {
      return { lowercase: true };
    }
    return null;
  }

  validateNumber(control: { value: string; }) {
    const numbers = /[0-9]/;
    if (!numbers.test(control.value)) {
      return { number: true };
    }
    return null;
  }

  validateSpecial(control: { value: string; }) {
    const specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharacters.test(control.value)) {
      return { special: true };
    }
    return null;
  }

  // Custom validator to match passwords
  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  email: string = 'buddhigayanmaleesha2000@gmail.com';

  submitForm(): void {
    if (this.newPasswordForm.valid) {
      const { password, confirmPassword } = this.newPasswordForm.value;
      console.log('Password reset form data', password, confirmPassword)
      this.resetPwdService.resetPassword(this.email, password, confirmPassword).subscribe({
        next: (response) => {
          console.log('Password reset successful', response);
          this.router.navigate(['']);
        },
        error: (error) => {
          console.error('Error resetting password', error);
        }
      });
    }
  }

}
