import { Credit } from './../models/credit';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  constructor(
    private http: HttpClient
  ) { }

  getMyCredits() {
    return this.http.get<Credit[]>(`${environment.apiHost}/credit`)
  }

}
