import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getMyCategories() {
    return this.http.get<any[]>(`${environment.apiHost}/category`, this.sharedService.getDefaultApiOptions())
  }
}
