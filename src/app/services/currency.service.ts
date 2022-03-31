import { Currency } from './../models/currency';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(
    private http: HttpClient
  ) { }

  getMyCurrencies() {
    return this.http.get<Currency[]>(`${environment.apiHost}/currency`)
  }

  updateCurrency(id: number, currency: any) {
    return this.http.put<any>(`${environment.apiHost}/currency/${id}`, { ...currency })
  }

  createCurrency(currency: any) {
    return this.http.post<Currency[]>(`${environment.apiHost}/currency`, currency)
  }

  inactivate(currencyId: string) {
    return this.http.delete<any>(`${environment.apiHost}/currency/${currencyId}`)
  }

  activate(currencyId: string) {
    return this.http.put<any>(`${environment.apiHost}/currency/active/${currencyId}`, {})
  }

}
