import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResetPwdService {

  private apiUrl: string = environment.apiUrl + '/admin';
  
  constructor(private http: HttpClient) { }

  resetPassword(email: string, newPassword: string, confirmNewPassword: string): Observable<any> {
    console.log('service email password got===', email, newPassword, confirmNewPassword)
    return this.http.post(`${this.apiUrl}/resetPassword`, { email, newPassword, confirmNewPassword });
  }

}
