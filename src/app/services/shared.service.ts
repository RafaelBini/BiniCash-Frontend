import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  getDefaultApiOptions() {
    return {
      headers: new HttpHeaders({
        'x-access-token': (localStorage.getItem('api_token') || 'NO TOKEN'),
      })
    }
  }

}
