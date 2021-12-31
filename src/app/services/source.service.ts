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

  getMyActiveSources() {
    return this.http.get<Source[]>(`${environment.apiHost}/source?active=true`)
  }

  getSource(sourceId: number) {
    return this.http.get<Source[]>(`${environment.apiHost}/source?id=${sourceId}`)
  }

  updateSource(source: any) {
    return this.http.put(`${environment.apiHost}/source`, source)
  }

  inativate(sourceId: number) {
    return this.http.delete(`${environment.apiHost}/source/${sourceId}`)
  }

  create(source: any) {
    return this.http.post(`${environment.apiHost}/source`, source)
  }

}
