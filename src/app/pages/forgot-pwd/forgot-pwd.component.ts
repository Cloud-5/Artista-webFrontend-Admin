import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ForgotPwdService } from '../forgot-pwd/forgot-pwd.service'

@Component({
  selector: 'app-forgot-pwd',
  templateUrl: './forgot-pwd.component.html',
  styleUrl: './forgot-pwd.component.css'
})
export class ForgotPwdComponent implements OnInit {

  resetForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private forgotPwdService: ForgotPwdService) {}

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  submitForm(): void { // Defined submitForm method
    if (this.resetForm && this.resetForm.valid) {
      // Send password reset instructions or process the form data
      const email = this.resetForm.value.email;
      this.forgotPwdService.forgotPassword(email).subscribe(
        response => {
          console.log(response); // Handle response from the backend
        },
        error => {
          console.error(error); // Handle error
        }
      );
    }
  }

}
