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

}
