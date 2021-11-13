import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient
  ) { }

  getMyCategories() {
    return this.http.get<any[]>(`${environment.apiHost}/category`)
  }

  updateCategory(id: number, category: any) {
    return this.http.put<any>(`${environment.apiHost}/category/${id}`, { ...category })
  }

  create(category: any) {
    return this.http.post<any>(`${environment.apiHost}/category/create`, { ...category })
  }

  inactivate(categoryId: string) {
    return this.http.delete<any>(`${environment.apiHost}/category/${categoryId}`)
  }

  activate(categoryId: string) {
    return this.http.put<any>(`${environment.apiHost}/category/active/${categoryId}`, {})
  }

}
