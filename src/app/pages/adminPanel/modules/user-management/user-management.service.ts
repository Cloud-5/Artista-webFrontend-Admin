import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../../../environments/environment";

@Injectable({
  providedIn: "root"
})
export class UserManagementService {

  private apiUrl: string = environment.apiUrl + '/user-management';

  constructor(private http: HttpClient) { }

  getAllUserData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }

  getUserDetails(userId: string, role:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}/${role}`);
  }

  deleteAccount(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }

  banAccount(userId: string, banDetails: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/ban/${userId}`, banDetails);
  }

  removeBan(userId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/remove-ban/${userId}`, {});
  }
}
