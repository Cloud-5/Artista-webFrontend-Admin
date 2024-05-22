import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ForgotPwdService {

  private apiUrl: string = environment.apiUrl + '/admin';

  constructor(private http: HttpClient) { }

  forgotPassword(email:string):Observable<any>{
    return this.http.post(`${this.apiUrl}/forgotPasword`,{ email });
   }
}
