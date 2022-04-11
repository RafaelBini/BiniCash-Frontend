import { TranslateService } from '@ngx-translate/core';
import { CustomDatePipe } from './../../pipes/custom-date.pipe';
import { Transaction } from './../../models/transaction';
import { TransactionService } from './../../services/transaction.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { Point, PointOptionsType } from 'highcharts';
import { CurrencyService } from 'src/app/services/currency.service';
import { AsyncSubject } from 'rxjs';

@Component({
  selector: 'app-user-page',
  templateUrl: './user-page.component.html',
  styleUrls: ['./user-page.component.css']
})
export class UserPageComponent implements OnInit, AfterViewInit {

  constructor(
    private transactionService: TransactionService,
    private currencyService: CurrencyService,
    private customDatePipe: CustomDatePipe,
    private translate: TranslateService
  ) { }

  IS_SIDE_BAR_HIDDEN = false;
  chartYear = new Date().getFullYear();
  chartMonth = new Date().getMonth() - 1;
  balancesByCategories: any[] = [];
  accumulatedChart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: undefined
    },
    yAxis: {
      title: {
        text: null
      }
    },
    xAxis: {
      categories: [],
      title: {
        text: null
      }
    },
    series: []
  });
  budgetChart = new Chart({
    chart: {
      type: 'line'
    },
    title: {
      text: `Budget vs Debits`
    },
    yAxis: {
      title: {
        text: null
      }
    },
    xAxis: {
      categories: [],
      title: {
        text: null
      },

    },
    series: []
  });
  public selectedCurrency = "R$";
  public currencies: any[] = [];
  survivingMonths = 0;
  savingBalances: any = {
    short: 0,
    long: 0
  };

  async ngOnInit() {
    this.transactionService.getBalancesByCategories().subscribe(balances => {
      this.balancesByCategories = balances;
    });
    this.currencies = await this.currencyService.getMyCurrencies().toPromise();
    this.loadData();
  }

  async ngAfterViewInit() {
    this.accumulatedChart.ref.setTitle({ text: await this.translate.get('USER_PAGE.CHART_ACCUMULATED').toPromise() })
    this.budgetChart.ref.setTitle({ text: await this.translate.get('USER_PAGE.CHART_BUDGET').toPromise() })
  }

  async loadSurvivingMonths() {
    this.survivingMonths = await (await this.transactionService.getSurvivingMonths().toPromise()).find(s => s.symbol == this.selectedCurrency).survivingMonths;
  }

  goChartMonth(increment: number) {
    const newDate = new Date(new Date(this.chartYear, this.chartMonth, 5).getTime() + (1000 * 60 * 60 * 24 * 30 * increment));
    this.chartYear = newDate.getFullYear();
    this.chartMonth = newDate.getMonth();
    this.loadData();
  }

  async loadBudgetChartData() {
    const previousMonth = { start: new Date(this.chartYear, (this.chartMonth - 1), 1), end: new Date(this.chartYear, (this.chartMonth), 0) }
    const currentMonth = { start: new Date(this.chartYear, (this.chartMonth), 1), end: new Date(this.chartYear, (this.chartMonth + 1), 0) }

    const previousMonthTotalCredits = (await this.transactionService.getCreditsFrom(previousMonth.start, previousMonth.end).toPromise())
      .filter(c => c.value > 0 && c.Source.Currency.symbol == this.selectedCurrency)
      .reduce((p, c) => p + c.value, 0);
    const previousMonthTotalTransferenceDebits = (await this.transactionService.getTransactionsFrom(previousMonth.start, previousMonth.end).toPromise())
      .filter(t => t.value < 0 && t.Category.Currency.symbol == this.selectedCurrency && t.Category.isTransference)
      .reduce((p, c) => p + c.value, 0);
    const monthBudget = previousMonthTotalCredits + previousMonthTotalTransferenceDebits;

    const monthDebits = (await this.transactionService.getTransactionsFrom(currentMonth.start, currentMonth.end).toPromise())
      .filter(t => t.value < 0 && t.Category.Currency.symbol == this.selectedCurrency && !t.Category.isTransference)
      .sort((a, b) => (a.transactionDate > b.transactionDate ? 1 : -1));

    while (this.budgetChart.ref.series.length > 0)
      this.budgetChart.ref.series[0].remove(true);

    this.budgetChart.addSeries({
      name: `Budget (${previousMonth.start.toISOString().substr(0, 7).replace('-', '/')})`,
      type: 'line',
      color: 'blue',
      data: [],
      tooltip: {
        valueDecimals: 2,
        valuePrefix: this.selectedCurrency,
        pointFormat: `{point.description}`,
        headerFormat: ''
      },
    }, false, true);

    this.budgetChart.addSeries({
      name: `Debits (${currentMonth.start.toISOString().substr(0, 7).replace('-', '/')})`,
      type: 'line',
      color: 'red',
      data: [],
      tooltip: {
        valueDecimals: 2,
        valuePrefix: this.selectedCurrency,
        pointFormat: `{point.description}`,
        headerFormat: `<div style='font-size: 10px;'><b>{point.x}</b> --> ${this.selectedCurrency} {point.y}</div><br/>`
      },
    }, false, true);

    var debitAmount = 0;
    var debits: Array<PointOptionsType> = [];
    var credits: Array<PointOptionsType> = [];
    for (let [debitIndex, debit] of monthDebits.entries()) {
      this.budgetChart.ref.xAxis[0].categories[debitIndex] = this.customDatePipe.transform(debit.transactionDate, 'shortDate');
      debitAmount += debit.value
      debits.push({
        y: Math.abs(Math.round(debitAmount * 1e2) / 1e2),
        description: `<b>${debit.Category.Currency.symbol} ${Math.abs(debit.value)}</b> ${debit.description}`
      })
      credits.push({
        y: monthBudget,
        description: `Budget based on ${previousMonth.start.toISOString().substr(0, 7).replace('-', '/')} credits:
        <br/>
        <b>${this.selectedCurrency} ${monthBudget}</b>`
      })
    }
    this.budgetChart.ref.series[0].setData(credits);
    this.budgetChart.ref.series[1].setData(debits);
  }

  async loadAccumulatedChartData() {
    const previousMonth = { start: new Date(this.chartYear, (this.chartMonth - 1), 1), end: new Date(this.chartYear, (this.chartMonth), 0) }
    const currentMonth = { start: new Date(this.chartYear, (this.chartMonth), 1), end: new Date(this.chartYear, (this.chartMonth + 1), 0) }
    this.transactionService.getTransactionsFrom(currentMonth.start, currentMonth.end).subscribe(async transactions => {

      transactions = transactions.filter(t => !t.Category.isTransference)

      while (this.accumulatedChart.ref.series.length > 0)
        this.accumulatedChart.ref.series[0].remove(true);

      this.accumulatedChart.addSeries({
        name: `Accumulated Budget (${previousMonth.start.toISOString().substr(0, 7).replace('-', '/')})`,
        type: 'line',
        color: 'blue',
        data: [],
        tooltip: {
          valueDecimals: 2,
          valuePrefix: this.selectedCurrency,
          pointFormat: `{point.description}`,
          headerFormat: ''
        },
      }, false, true);

      this.accumulatedChart.addSeries({
        name: `Debits (${currentMonth.start.toISOString().substr(0, 7).replace('-', '/')})`,
        type: 'line',
        color: 'red',
        data: [],
        tooltip: {
          valueDecimals: 2,
          valuePrefix: this.selectedCurrency,
          pointFormat: `{point.description}`,
          headerFormat: `<div style='font-size: 10px;'><b>{point.x}</b> --> ${this.selectedCurrency} {point.y}</div><br/>`
        },
      }, false, true);

      const previousAmount = await this.transactionService.getAmountUntil(previousMonth.end.toISOString().substr(0, 10)).toPromise();
      const previousCurrencyAmount = previousAmount.find(p => p.symbol == this.selectedCurrency)
      const debits = transactions.filter(t => t.value < 0 && t.Category.Currency.symbol == this.selectedCurrency)
        .sort((a, b) => a.transactionDate > b.transactionDate ? 1 : -1);

      var debitsAmount = Math.abs(previousCurrencyAmount.debitsAmount);
      var creditsAmount = Math.abs(previousCurrencyAmount.creditsAmount);
      var chartDebits: Array<PointOptionsType> = [];
      var chartCredits: Array<PointOptionsType> = [];
      var chartCategories: string[] = [];
      for (let debit of debits) {

        chartCategories.push(this.customDatePipe.transform(debit.transactionDate, 'shortDate'));

        debitsAmount += Math.abs(debit.value);
        chartDebits.push({
          y: Math.round(debitsAmount * 1e2) / 1e2,
          description: `<b>${debit.Category.Currency.symbol} ${Math.abs(debit.value)}</b> ${debit.description}`
        })

        chartCredits.push({
          y: creditsAmount,
          description: `Budget based on all times until ${previousMonth.end.toISOString().substr(0, 7).replace('-', '/')} credits:
          <br/>
          <b>${this.selectedCurrency} ${creditsAmount}</b>`
        })
      }

      this.accumulatedChart.ref.xAxis[0].setCategories(chartCategories);
      this.accumulatedChart.ref.series[0].setData(chartCredits);
      this.accumulatedChart.ref.series[1].setData(chartDebits);

    });
  }

  async loadSavings() {
    var currencyId = this.currencies.find(c => c.symbol == this.selectedCurrency).id;
    this.savingBalances = await this.transactionService.getSavings(currencyId).toPromise();
  }

  loadData() {
    this.loadSurvivingMonths();
    this.loadAccumulatedChartData();
    this.loadBudgetChartData();
    this.loadSavings();
  }

  toggleSideBar() {
    this.IS_SIDE_BAR_HIDDEN = !this.IS_SIDE_BAR_HIDDEN;
  }

}
