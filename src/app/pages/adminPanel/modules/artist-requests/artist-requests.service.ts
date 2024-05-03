import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ArtistRequestsService {

  private apiUrl: string = environment.apiUrl + '/artist-request';

  constructor(private http: HttpClient) { }

  getAllArtistData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }
  
  approveArtist(userId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/approve`, {});
  }

  rejectArtist(userId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/reject`, {});
  }

  getArtistDetails(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  deleteArtist(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }
}
