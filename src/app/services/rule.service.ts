import { Injectable } from '@angular/core';
import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getMyRules() {
    return this.http.get<any[]>(`${environment.apiHost}/rule`, this.sharedService.getDefaultApiOptions())
  }

  addRule(rule: any) {
    return this.http.post<any>(`${environment.apiHost}/rule`, rule, this.sharedService.getDefaultApiOptions())
  }

  runRules() {
    return this.http.post<any>(`${environment.apiHost}/rule/run`, {}, this.sharedService.getDefaultApiOptions())
  }

  updateRule(rule: any, ruleId: any) {
    return this.http.put<any>(`${environment.apiHost}/rule/${ruleId}`, rule, this.sharedService.getDefaultApiOptions())
  }

  updateConditional(conditional: any, conditionalId: any) {
    return this.http.put<any>(`${environment.apiHost}/rule/conditional/${conditionalId}`, conditional, this.sharedService.getDefaultApiOptions())
  }

  saveRulesChanges(rules: any[]) {
    return this.http.put<any>(`${environment.apiHost}/rule/save`, rules, this.sharedService.getDefaultApiOptions())
  }

}
