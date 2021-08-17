import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }

  getAveragesByCategory() {
    return this.http.get<any[]>(`${environment.apiHost}/transaction/averages-by-categories`, this.sharedService.getDefaultApiOptions())
  }

  getTransactions() {
    return this.http.get<any[]>(`${environment.apiHost}/transaction`, this.sharedService.getDefaultApiOptions())
  }

  getBalancesBySourceUntilDate(createdAt?: string) {
    return this.http.get<any[]>(`${environment.apiHost}/transaction/balances-by-sources-until-date/${createdAt}`, this.sharedService.getDefaultApiOptions())
  }

  getMigrations() {
    return this.http.get<any>(`${environment.apiHost}/transaction/migrations`, this.sharedService.getDefaultApiOptions())
  }

  finishMigration() {
    return this.http.post<any>(`${environment.apiHost}/transaction/finish-migration`, undefined, this.sharedService.getDefaultApiOptions())
  }
}
