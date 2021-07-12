import { SharedService } from './shared.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StagedTransactionService {

  constructor(
    private http: HttpClient,
    private sharedService: SharedService
  ) { }


  getStagedBlancesBySource() {
    return this.http.get<any>(`${environment.apiHost}/staged-transaction/balances-by-source`, this.sharedService.getDefaultApiOptions())
  }

  getStagedBlancesByCategory() {
    return this.http.get<any[]>(`${environment.apiHost}/staged-transaction/balances-by-category`, this.sharedService.getDefaultApiOptions())
  }

  insertOfx(rawContent: any, source: any) {
    return this.http.post<any>(`${environment.apiHost}/staged-transaction/insert-ofx`, { rawContent, source }, this.sharedService.getDefaultApiOptions())
  }

  deleteBySource(sourceId: any) {
    return this.http.delete<any>(`${environment.apiHost}/staged-transaction/source-id/${sourceId}`, this.sharedService.getDefaultApiOptions())
  }

  getDebits() {
    return this.http.get<any[]>(`${environment.apiHost}/staged-transaction/debits`, this.sharedService.getDefaultApiOptions())
  }
  get() {
    return this.http.get<any[]>(`${environment.apiHost}/staged-transaction`, this.sharedService.getDefaultApiOptions())
  }

  update(debit: any) {
    return this.http.put<any>(`${environment.apiHost}/staged-transaction/${debit.id}`, debit, this.sharedService.getDefaultApiOptions())
  }
}
