
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StagedTransactionService {

  constructor(
    private http: HttpClient
  ) { }

  deleteById(stagedTransactionId: number) {
    return this.http.delete<any>(`${environment.apiHost}/staged-transaction/${stagedTransactionId}`)
  }

  getStagedTransactionsBySourceId(sourceId: number) {
    return this.http.get<any>(`${environment.apiHost}/staged-transaction?sourceId=${sourceId}`)
  }

  getStagedBlancesBySource() {
    return this.http.get<any>(`${environment.apiHost}/staged-transaction/balances-by-source`)
  }

  getStagedSavings() {
    return this.http.get<any>(`${environment.apiHost}/staged-transaction/savings-by-currency`)
  }

  getStagedBlancesByCategory() {
    return this.http.get<any[]>(`${environment.apiHost}/staged-transaction/balances-by-category`)
  }

  insertOfx(rawContent: any, source: any) {
    return this.http.post<any>(`${environment.apiHost}/staged-transaction/insert-ofx`, { rawContent, source })
  }

  insertCsv(rawContent: any, source: any) {
    return this.http.post<any>(`${environment.apiHost}/staged-transaction/insert-csv`, { rawContent, source })
  }

  insertArray(array: any[]) {
    return this.http.post<any>(`${environment.apiHost}/staged-transaction/insert-array`, { array })
  }

  insertChildrenArray(childrenArray: any[], parentTransactionId: number) {
    return this.http.post<any>(`${environment.apiHost}/staged-transaction/insert-children-array`, { childrenArray, parentTransactionId })
  }


  distributeCreditToCategory(value: number, categoryId: any) {
    return this.http.post<any>(`${environment.apiHost}/staged-transaction/distribute-credits-to-category`, { value, categoryId })
  }


  deleteBySource(sourceId: any) {
    return this.http.delete<any>(`${environment.apiHost}/staged-transaction/source-id/${sourceId}`)
  }

  cancelMigration() {
    return this.http.delete<any>(`${environment.apiHost}/staged-transaction/cancel-migration`)
  }

  deleteCreditsByCategory(categoryId: any) {
    return this.http.delete<any>(`${environment.apiHost}/staged-transaction/credits-from-category/${categoryId}`)
  }

  getDebits() {
    return this.http.get<any[]>(`${environment.apiHost}/staged-transaction/debits`)
  }
  get() {
    return this.http.get<any[]>(`${environment.apiHost}/staged-transaction`)
  }
  getCreditsToDistribute() {
    return this.http.get<any[]>(`${environment.apiHost}/staged-transaction/credits-to-distribute`)
  }

  update(debit: any) {
    return this.http.put<any>(`${environment.apiHost}/staged-transaction/${debit.id}`, debit)
  }

  updateCredit(credit: any) {
    return this.http.put<any>(`${environment.apiHost}/staged-transaction/update-staged-credit/${credit.id}`, credit)
  }
}
