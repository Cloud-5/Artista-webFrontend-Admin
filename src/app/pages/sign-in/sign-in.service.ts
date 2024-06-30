import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  private apiUrl: String = environment.apiUrl +'/admin'

  constructor(private http: HttpClient) {} 

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`,{ email, password });
  }
}
