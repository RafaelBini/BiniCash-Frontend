import { Source } from './../../models/source';
import { Component, OnInit } from '@angular/core';
import { Credit } from 'src/app/models/credit';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-tithe-page',
  templateUrl: './tithe-page.component.html',
  styleUrls: ['./tithe-page.component.css']
})
export class TithePageComponent implements OnInit {

  credits: Array<any> = [];
  tday = new Date();
  startDate: string = `${this.tday.getFullYear()}-${this.tday.getMonth().toString().padStart(2, '0')}-01`;
  endDate: string = `${this.tday.getFullYear()}-${(this.tday.getMonth() + 1).toString().padStart(2, '0')}-01`;

  constructor(
    private transactionService: TransactionService
  ) { }

  async ngOnInit() {
    this.loadData()

  }

  async loadData() {
    var startDate = new Date(this.startDate);
    var endDate = new Date(new Date(this.endDate).getTime() - 1)
    this.credits = await this.transactionService.getCreditsFrom(startDate, endDate).toPromise()
    this.credits = this.credits.filter(c => !c.isTransference && c.Source.Currency.symbol == 'R$').map(c => ({ ...c, consider: true })).sort((a, b) => a.creditDate > b.creditDate ? 1 : -1)
  }

  getFormula() {
    return '=' + this.credits.filter(c => c.consider).map(c => c.value).join(' + ').replace(/\,/g, '').replace(/\./g, ',');
  }

  getTotal() {
    return this.credits.filter(c => c.consider).reduce((p, c) => p + c.value, 0)
  }

}
