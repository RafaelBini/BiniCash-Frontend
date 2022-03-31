import { ConfirmDialogComponent } from './../../dialogs/confirm-dialog/confirm-dialog.component';
import { NewCurrencyComponent } from './../../dialogs/new-currency/new-currency.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TransactionService } from './../../services/transaction.service';
import { CurrencyService } from './../../services/currency.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-currencies-page',
  templateUrl: './currencies-page.component.html',
  styleUrls: ['./currencies-page.component.css']
})
export class CurrenciesPageComponent implements OnInit {
  displayedColumns: string[] = [
    'name', 'balance'
  ]
  dataSource: any;
  @ViewChild(MatSort) sort: any;
  selectedCurrency: any;
  chart = new Chart({
    chart: {
      type: 'column'
    },
    title: {
      text: undefined
    },
    plotOptions: {
      column: {
        stacking: 'normal',
        dataLabels: {
          enabled: true
        }
      }
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
  saved?: boolean | null = undefined;

  constructor(
    private currencyService: CurrencyService,
    private transactionService: TransactionService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
  }

  async ngAfterViewInit() {
    this.loadData();

  }

  async loadData() {
    var currencies = await this.currencyService.getMyCurrencies().toPromise();
    var balances = await this.transactionService.getBalancesByCurrencies().toPromise();

    currencies = currencies.map(c => {
      var relatedBalance = balances.find(b => b.id == c.id);
      return {
        ...c,
        balance: relatedBalance ? relatedBalance.balance : 0
      }
    })

    this.dataSource = new MatTableDataSource(currencies.sort((a, b) => a.name > b.name ? 1 : -1));
    this.dataSource.sort = this.sort;

    this.selectCurrency(currencies[0]);
  }

  async loadChartData() {
    var transactions = (await this.transactionService.getTransactionsByCurrency(this.selectedCurrency.id).toPromise()).sort((a, b) => a.transactionDate > b.transactionDate ? 1 : -1);

    while (this.chart.ref.series.length > 0)
      this.chart.ref.series[0].remove(true);

    this.chart.addSeries({
      name: 'Credit',
      type: 'column',
      data: [],
      tooltip: {
        valueDecimals: 2,
        valuePrefix: this.selectedCurrency.symbol,
        pointFormat: `{point.description}`,
        headerFormat: `<div style='font-size: 10px;'>${this.selectedCurrency.symbol} {point.y}</div><br/>`
      },
      stack: 'Credit'
    }, false, true)

    this.chart.addSeries({
      name: 'Debit',
      type: 'column',
      data: [],
      tooltip: {
        valueDecimals: 2,
        valuePrefix: this.selectedCurrency.symbol,
        pointFormat: `{point.description}`,
        headerFormat: `<div style='font-size: 10px;'>${this.selectedCurrency.symbol} {point.y}</div><br/>`
      },
      stack: 'Debit'
    }, false, true)



    var months = [];
    var credits = [];
    var debits = [];
    for (let i = 7; i >= 0; i--) {

      const month = new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 30 * i)).toISOString().substr(0, 7);
      months.push(month);

      var monthDebit = transactions.filter(t => t.value < 0 && t.transactionDate.includes(month))
        .reduce((p, c) => {
          return {
            ...p,
            description: `${p.description}<br />${c.description}`,
            y: p.y + Math.abs(c.value),
          }
        }, { description: '', y: 0, color: 'var(--danger)', name: '' });
      debits.push(monthDebit);

      var creditAmount = transactions.filter(t => t.value > 0 && t.transactionDate.includes(month)).reduce((p, c) => p + c.value, 0);
      credits.push({ y: creditAmount, description: 'Credit Amount', color: 'var(--primary)', name: '' })
    }
    this.chart.ref.xAxis[0].setCategories(months);
    this.chart.ref.series[0].setData(credits);
    this.chart.ref.series[1].setData(debits);
  }

  selectCurrency(currency: any) {
    this.selectedCurrency = currency;
    this.loadChartData();
  }

  addCurrency() {
    var diagRef = this.dialog.open(NewCurrencyComponent);
    diagRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    })
  }

  async activate() {
    try {
      await this.currencyService.activate(this.selectedCurrency.id).toPromise();
      this.snack.open('Activated', undefined, { duration: 1500 });
      this.loadData();
    }
    catch (reason: any) {
      this.snack.open(reason.error.msg, undefined, { duration: 2500 });
    }
  }

  inactivate() {
    var ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        isDanger: true,
        title: 'Inactivate currency?',
        content: 'You will not be able to see this currency anymore'
      }
    })
    ref.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.currencyService.inactivate(this.selectedCurrency.id).toPromise();
          this.snack.open('Inactivated', undefined, { duration: 1500 });
          this.loadData();
        }
        catch (reason: any) {
          this.snack.open(reason.error.msg, undefined, { duration: 2500 });
        }
      }
    })

  }

  async updateCurrency(property: string) {
    this.saved = false;
    try {
      await this.currencyService.updateCurrency(this.selectedCurrency.id, { [`${property}`]: this.selectedCurrency[property] }).toPromise()
      this.saved = true;
    }
    catch (error: any) {
      console.log(error);
      this.saved = undefined;
      this.snack.open(error.error.msg, undefined, { duration: 2500 });
    }

  }

}
