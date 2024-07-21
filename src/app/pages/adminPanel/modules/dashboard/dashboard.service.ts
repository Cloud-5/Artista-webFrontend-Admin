import { Injectable } from '@angular/core';
import { environment } from "../../../../../environments/environment";
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private apiUrl: string = environment.apiUrl + '/dashboard';

  constructor(private http: HttpClient) { }

  getDashboardData(year:number): Observable<any> {
    console.log(year,'year');
    return this.http.get<any>(`${this.apiUrl}/${year}`);
  }

}
