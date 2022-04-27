import { DebitDetailsDialogComponent } from './../../dialogs/debit-details-dialog/debit-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from './../../services/category.service';
import { TransactionService } from './../../services/transaction.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-analytics-debits-page',
  templateUrl: './analytics-debits-page.component.html',
  styleUrls: ['./analytics-debits-page.component.css']
})
export class AnalyticsDebitsPageComponent implements OnInit {

  constructor(
    private transactionService: TransactionService,
    private categoryService: CategoryService,
    private dialog: MatDialog
  ) { }

  chart = new Chart()

  startDate = new Date(`${new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 30 * 14)).toISOString().substring(0, 7)}-15`)
  endDate = new Date(`${new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 30 * 1)).toISOString().substring(0, 7)}-15`)
  debits: any[] = []
  chartCategories: any[] = []

  async ngOnInit() {

    this.loadChartData()

  }

  async loadChartData() {
    this.chart = new Chart({
      chart: {
        type: 'column'
      },
      title: {
        text: undefined
      },
      plotOptions: {
        column: {
          dataLabels: {
            enabled: false
          }
        },
        series: {
          stacking: 'normal'
        }
      },
      credits: {
        enabled: false
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
      legend: {
        enabled: false
      },
      series: []
    });

    this.getChartCategories()

    this.debits = await this.transactionService.getDebits().toPromise()
    var categories = await this.categoryService.getMyCategories().toPromise()

    // Create series
    for (let category of categories) {
      //console.log(category.name)
      this.chart.addSeries({
        name: category.name,
        type: 'column',
        data: [],
        tooltip: {
          valueDecimals: 2,
          valuePrefix: category.Currency.symbol,
          pointFormat: `{point.description}`,
          headerFormat: `<div style='font-size: 10px;'>${category.Currency.symbol} {point.y}</div><br/>`
        },
        events: {
          click: (event: any) => this.showDebitDetails(event),
        }
      }, false, true)

      this.chart.ref.series[this.chart.ref.series.length - 1].setData(this.getChartData(category.name));
    }

    this.chart.ref.xAxis[0].setCategories(this.chartCategories);
  }

  showDebitDetails(event: any) {

    this.dialog.open(DebitDetailsDialogComponent, {
      data: {
        categoryName: event.point.description,
        month: event.point.category
      }
    })

  }

  getChartCategories() {
    var currentDate = new Date(this.startDate.getTime());
    var chartCategories = []
    while (currentDate <= this.endDate) {
      var month = currentDate.toISOString().substring(0, 7)

      chartCategories.push(month)
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1))
      //console.log(currentDate.toISOString())
    }
    //console.log(chartCategories)
    this.chartCategories = chartCategories
  }

  getChartData(category: string) {

    var chartData = []
    for (let chartCategory of this.chartCategories) {
      var value = this.debits.find(d => d.month == chartCategory && d.category == category)?.value || 0
      chartData.push({
        y: value, description: `${category}`
      })
    }
    return chartData
  }

  goNextMonth(type: 'start' | 'end') {
    if (type == 'start') this.startDate = new Date(this.startDate.setMonth(this.startDate.getMonth() + 1))
    else if (type == 'end') this.endDate = new Date(this.endDate.setMonth(this.endDate.getMonth() + 1))
    this.loadChartData()
  }

  goPreviousMonth(type: 'start' | 'end') {
    if (type == 'start') this.startDate = new Date(this.startDate.setMonth(this.startDate.getMonth() - 1))
    else if (type == 'end') this.endDate = new Date(this.endDate.setMonth(this.endDate.getMonth() - 1))
    this.loadChartData()
  }

}
