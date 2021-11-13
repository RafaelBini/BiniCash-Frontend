
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) { }

  me: any;

  authenticate(username: string, password: string) {
    return this.http.post<any>(`${environment.apiHost}/user/auth`, {
      username,
      password
    })
  }

  getMyUserInfo() {
    return this.http.get<any>(`${environment.apiHost}/user`)
  }

  async updateMe() {
    this.me = await this.http.get<any>(`${environment.apiHost}/user`).toPromise()
    this.translate.use(this.me.Configs['LANGUAGE'] || 'en-US');
  }

  updateInfo(userInfo: any) {
    return this.http.put(`${environment.apiHost}/user`, userInfo)
  }

  updateConfig(name: string, value: string) {
    return this.http.put(`${environment.apiHost}/config`, { name, value })
  }

  goToStep(step: number) {
    return this.http.put(`${environment.apiHost}/user/routine-step`, { step: step })
  }

}
