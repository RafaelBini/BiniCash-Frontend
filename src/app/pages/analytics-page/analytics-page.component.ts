import { TransactionService } from 'src/app/services/transaction.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-analytics-page',
  templateUrl: './analytics-page.component.html',
  styleUrls: ['./analytics-page.component.css']
})
export class AnalyticsPageComponent implements OnInit {

  constructor(
    private transactionService: TransactionService
  ) { }

  analytics: any
  months: number = 6

  async ngOnInit() {
    this.loadAnalytics()
  }

  async loadAnalytics() {
    this.analytics = await this.transactionService.getAnalytics(this.months).toPromise()
  }

}
