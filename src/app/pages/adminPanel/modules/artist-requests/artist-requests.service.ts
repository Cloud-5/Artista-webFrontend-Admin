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

  // Get artist requests
  getAllArtistData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/`);
  }
  
  // Approve an artist
  approveArtist(userId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/approve`, {});
  }

  // Reject an artist
  rejectArtist(userId: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${userId}/reject`, {});
  }

  // Get artist details by user ID
  getArtistDetails(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${userId}`);
  }

  // Delete an artist account
  deleteArtist(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${userId}`);
  }
}
