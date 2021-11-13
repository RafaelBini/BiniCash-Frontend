import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RuleService {

  constructor(
    private http: HttpClient
  ) { }

  getMyRules() {
    return this.http.get<any[]>(`${environment.apiHost}/rule`)
  }

  addRule(rule: any) {
    return this.http.post<any>(`${environment.apiHost}/rule`, rule)
  }

  deleteRule(ruleId: number) {
    return this.http.delete<any>(`${environment.apiHost}/rule/${ruleId}`)
  }

  updateRulesOrder(orderedRules: any[]) {
    return this.http.put<any>(`${environment.apiHost}/rule/update-order`, orderedRules)
  }

  runRules() {
    return this.http.post<any>(`${environment.apiHost}/rule/run`, {})
  }

  updateRule(rule: any, ruleId: any) {
    return this.http.put<any>(`${environment.apiHost}/rule/${ruleId}`, rule)
  }

  addConditional(ruleId: number) {
    return this.http.post<any>(`${environment.apiHost}/rule/${ruleId}/conditional`, {})
  }

  deleteConditional(conditionalId: number) {
    return this.http.delete<any>(`${environment.apiHost}/rule/conditional/${conditionalId}`, {})
  }

  updateConditional(conditional: any, conditionalId: any) {
    return this.http.put<any>(`${environment.apiHost}/rule/conditional/${conditionalId}`, conditional)
  }


}
