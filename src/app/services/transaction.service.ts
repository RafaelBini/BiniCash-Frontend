import { Transaction } from './../models/transaction';

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Credit } from '../models/credit';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private http: HttpClient
  ) { }

  getAveragesByCategory() {
    return this.http.get<any[]>(`${environment.apiHost}/transaction/averages-by-categories`)
  }

  getBalancesByCategories() {
    return this.http.get<any[]>(`${environment.apiHost}/transaction/balances-by-categories`)
  }

  getTransactions() {
    return this.http.get<Transaction[]>(`${environment.apiHost}/transaction`)
  }

  getTransactionsByCategory(categoryId: number) {
    return this.http.get<Transaction[]>(`${environment.apiHost}/transaction?categoryId=${categoryId}`)
  }

  getTransactionsFrom(startDate: Date, endDate: Date) {
    const startDateStr = startDate.toISOString().substr(0, 10);
    const endDateStr = endDate.toISOString().substr(0, 10);
    return this.http.get<Transaction[]>(`${environment.apiHost}/transaction?startDate=${startDateStr}&endDate=${endDateStr}`)
  }

  getCreditsFrom(startDate: Date, endDate: Date) {
    const startDateStr = startDate.toISOString().substr(0, 10);
    const endDateStr = endDate.toISOString().substr(0, 10);
    return this.http.get<Credit[]>(`${environment.apiHost}/credit?startDate=${startDateStr}&endDate=${endDateStr}`)
  }

  getAmountUntil(date: string) {
    return this.http.get<any[]>(`${environment.apiHost}/transaction/amount-until/${date}`)
  }
  getSurvivingMonths() {
    return this.http.get<any[]>(`${environment.apiHost}/transaction/surviving-months`)
  }

  getBalancesBySourceUntilDate(createdAt?: string) {
    return this.http.get<any[]>(`${environment.apiHost}/transaction/balances-by-sources-until-date/${createdAt}`)
  }

  getBalancesBySources() {
    return this.http.get<any[]>(`${environment.apiHost}/transaction/balances-by-sources`)
  }

  getMigrations() {
    return this.http.get<any>(`${environment.apiHost}/transaction/migrations`)
  }

  transferCategory(fromCategoryId: number, toCategoryId: number, value: number) {
    return this.http.post<any>(`${environment.apiHost}/transaction/transfer-category`, { fromCategoryId, toCategoryId, value })
  }

  finishMigration() {
    return this.http.post<any>(`${environment.apiHost}/transaction/finish-migration`, undefined)
  }
}
