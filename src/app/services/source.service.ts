import { Source } from './../models/source';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  constructor(
    private http: HttpClient
  ) { }

  getMySources() {
    return this.http.get<Source[]>(`${environment.apiHost}/source`)
  }

}
