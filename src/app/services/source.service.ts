import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SourceService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getMySources() {
    return this.http.get<any>(`${environment.apiHost}/source`, this.sharedService.getDefaultApiOptions())
  }

}
