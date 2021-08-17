import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  me: any;

  authenticate(username: string, password: string) {
    return this.http.post<any>(`${environment.apiHost}/user/auth`, {
      username,
      password
    })
  }

  isTokenValid() {
    return this.http.get<any>(`${environment.apiHost}/user/is-token-valid`, this.sharedService.getDefaultApiOptions())
  }

  getMyUserInfo() {
    return this.http.get<any>(`${environment.apiHost}/user`, this.sharedService.getDefaultApiOptions())
  }

  async updateMe() {
    this.me = await this.http.get<any>(`${environment.apiHost}/user`, this.sharedService.getDefaultApiOptions()).toPromise()
  }

  goToStep(step: number) {
    return this.http.put(`${environment.apiHost}/user/routine-step`, { step: step }, this.sharedService.getDefaultApiOptions())
  }

}
