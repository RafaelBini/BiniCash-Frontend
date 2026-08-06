import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Credit } from '../models/credit';

export interface PassiveIncomeKeyword {
  id: number;
  keyword: string;
  userId?: number;
}

export interface AnalyticsCreditRow {
  id: number;
  description: string;
  sourceDescription: string;
  value: number;
  creditDate: string;
  symbol: string;
  month: string;
  isPassive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CreditService {

  constructor(private http: HttpClient) { }

  getAnalyticsCredits(startMonth: string, endMonth: string) {
    return this.http.get<{ credits: AnalyticsCreditRow[]; keywords: string[] }>(
      `${environment.apiHost}/credit/analytics?startMonth=${startMonth}&endMonth=${endMonth}`
    );
  }

  getPassiveIncomeKeywords() {
    return this.http.get<PassiveIncomeKeyword[]>(`${environment.apiHost}/credit/passive-income-keywords`);
  }

  createPassiveIncomeKeyword(keyword: string) {
    return this.http.post<PassiveIncomeKeyword>(`${environment.apiHost}/credit/passive-income-keywords`, { keyword });
  }

  updatePassiveIncomeKeyword(id: number, keyword: string) {
    return this.http.put<PassiveIncomeKeyword>(`${environment.apiHost}/credit/passive-income-keywords/${id}`, { keyword });
  }

  deletePassiveIncomeKeyword(id: number) {
    return this.http.delete(`${environment.apiHost}/credit/passive-income-keywords/${id}`);
  }

  markCreditAsTransference(id: number) {
    return this.http.put(`${environment.apiHost}/credit/${id}`, { isTransference: true });
  }

  getCreditsFrom(startDate: Date, endDate: Date) {
    const startDateStr = startDate.toISOString().substr(0, 10);
    const endDateStr = endDate.toISOString().substr(0, 10);
    return this.http.get<Credit[]>(`${environment.apiHost}/credit?startDate=${startDateStr}&endDate=${endDateStr}`);
  }
}
