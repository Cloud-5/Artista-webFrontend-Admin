import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})

export class ArtCategoriesService {

  private apiUrl: string = environment.apiUrl + '/art-categories';
  private categoryDataSubject: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

  constructor(private http: HttpClient) { }


  getAllCategories(): Observable<any[]> {
    this.loadCategories().subscribe((data: any[]) => {
      this.categoryDataSubject.next(data);
    }); // Add closing parenthesis here
    if (this.categoryDataSubject.value.length === 0) {
      this.loadCategories().subscribe((data: any[]) => {
        this.categoryDataSubject.next(data);
      });
    }
    return this.categoryDataSubject.asObservable();
  }

  loadCategories(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/`);
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

  deleteFormats(categoryId: String): Observable<any> {
    return this.http.delete(`${this.apiUrl}/formats/${categoryId}`);
  }
}
