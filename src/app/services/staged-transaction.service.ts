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

  insertCsv(rawContent: any, source: any) {
    return this.http.post<any>(`${environment.apiHost}/staged-transaction/insert-csv`, { rawContent, source }, this.sharedService.getDefaultApiOptions())
  }

  insertArray(array: any[]) {
    return this.http.post<any>(`${environment.apiHost}/staged-transaction/insert-array`, { array }, this.sharedService.getDefaultApiOptions())
  }

  insertChildrenArray(childrenArray: any[], parentTransactionId: number) {
    return this.http.post<any>(`${environment.apiHost}/staged-transaction/insert-children-array`, { childrenArray, parentTransactionId }, this.sharedService.getDefaultApiOptions())
  }


  distributeCreditToCategory(value: number, categoryId: any) {
    return this.http.post<any>(`${environment.apiHost}/staged-transaction/distribute-credits-to-category`, { value, categoryId }, this.sharedService.getDefaultApiOptions())
  }


  deleteBySource(sourceId: any) {
    return this.http.delete<any>(`${environment.apiHost}/staged-transaction/source-id/${sourceId}`, this.sharedService.getDefaultApiOptions())
  }

  cancelMigration() {
    return this.http.delete<any>(`${environment.apiHost}/staged-transaction/cancel-migration`, this.sharedService.getDefaultApiOptions())
  }

  deleteCreditsByCategory(categoryId: any) {
    return this.http.delete<any>(`${environment.apiHost}/staged-transaction/credits-from-category/${categoryId}`, this.sharedService.getDefaultApiOptions())
  }

  getDebits() {
    return this.http.get<any[]>(`${environment.apiHost}/staged-transaction/debits`, this.sharedService.getDefaultApiOptions())
  }
  get() {
    return this.http.get<any[]>(`${environment.apiHost}/staged-transaction`, this.sharedService.getDefaultApiOptions())
  }
  getCreditsToDistribute() {
    return this.http.get<any[]>(`${environment.apiHost}/staged-transaction/credits-to-distribute`, this.sharedService.getDefaultApiOptions())
  }

  update(debit: any) {
    return this.http.put<any>(`${environment.apiHost}/staged-transaction/${debit.id}`, debit, this.sharedService.getDefaultApiOptions())
  }
}
