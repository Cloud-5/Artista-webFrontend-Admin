import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ArtCategoriesService {

  private apiUrl: string = environment.apiUrl + '/art-categories';

  constructor(private http: HttpClient) { }

  getAllCategories(): Observable<any> {
    return this.http.get(`${this.apiUrl}/`);
  }

  createCategory(categoryData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/`, categoryData);
  }

  updateCategory(categoryId: String, updatedCategoryData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${categoryId}`, updatedCategoryData);
  }

  deleteCategory(categoryId: String): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${categoryId}`);
  }
}
