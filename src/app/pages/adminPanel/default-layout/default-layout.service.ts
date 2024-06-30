import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class defaultLayoutService{

    private apiUrl: string = environment.apiUrl + '/admin';

    constructor(private http: HttpClient) { }

    getAdminDetails(adminId: string): Observable<any>{
      return this.http.get<any>(`${this.apiUrl}/admin-details/${adminId}`);
    }

    updateAdminDetails(adminId: string, updatedAdminData: any): Observable<any>{
      return this.http.put<any>(`${this.apiUrl}/admin-details/${adminId}`, updatedAdminData);
    }

    updateAdminPassword(adminId: string, newPassword: string ): Observable<any>{
      return this.http.put<any>(`${this.apiUrl}/admin-password/${adminId}`, { password: newPassword });
    }

}