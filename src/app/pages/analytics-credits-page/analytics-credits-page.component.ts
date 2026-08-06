import { PassiveIncomeKeywordsDialogComponent } from './../../dialogs/passive-income-keywords-dialog/passive-income-keywords-dialog.component';
import { CreditDetailsDialogComponent } from './../../dialogs/credit-details-dialog/credit-details-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './../../services/user.service';
import { AnalyticsCreditRow, CreditService } from './../../services/credit.service';
import { Component, OnInit } from '@angular/core';
import { Chart } from 'angular-highcharts';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-analytics-credits-page',
  templateUrl: './analytics-credits-page.component.html',
  styleUrls: ['./analytics-credits-page.component.css']
})
export class AnalyticsCreditsPageComponent implements OnInit {

  constructor(
    private creditService: CreditService,
    private dialog: MatDialog,
    private userService: UserService,
    private decimalPipe: DecimalPipe,
  ) { }

  chart = new Chart();
  startDate = new Date(`${new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 30 * 14)).toISOString().substring(0, 7)}-15`);
  endDate = new Date(`${new Date(new Date().getTime() - (1000 * 60 * 60 * 24 * 30 * 1)).toISOString().substring(0, 7)}-15`);
  chartCategories: string[] = [];
  allCredits: AnalyticsCreditRow[] = [];
  filterActiveIncome = true;
  filterPassiveIncome = true;
  monthTotals: Record<string, string> = {};
  primarySymbol = 'R$';

  ngOnInit() {
    this.loadChartData(true);
  }

  get filteredCredits(): AnalyticsCreditRow[] {
    return this.allCredits.filter(c => {
      if (c.isPassive && !this.filterPassiveIncome) {
        return false;
      }
      if (!c.isPassive && !this.filterActiveIncome) {
        return false;
      }
      return true;
    });
  }

  formatMoney(symbol: string, value: number) {
    const locale = this.userService.me?.Configs?.['LANGUAGE'] || 'pt-BR';
    const n = this.decimalPipe.transform(value, '1.2-2', locale);
    return `${symbol} ${n}`;
  }

  getChartCategories() {
    var currentDate = new Date(this.startDate.getTime());
    var chartCategories = [];
    while (currentDate <= this.endDate) {
      chartCategories.push(currentDate.toISOString().substring(0, 7));
      currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
    }
    this.chartCategories = chartCategories;
  }

  buildMonthTotals() {
    this.monthTotals = {};
    for (const month of this.chartCategories) {
      const monthCredits = this.filteredCredits.filter(c => c.month === month);
      const symbol = monthCredits[0]?.symbol || this.primarySymbol;
      const total = monthCredits.reduce((p, c) => p + c.value, 0);
      this.monthTotals[month] = this.formatMoney(symbol, total);
    }
  }

  getChartPointData(symbol: string) {
    return this.chartCategories.map(month => {
      const monthCredits = this.filteredCredits.filter(c => c.month === month && c.symbol === symbol);
      const total = monthCredits.reduce((p, c) => p + c.value, 0);
      return {
        y: total,
        credits: monthCredits,
        month,
      };
    });
  }

  renderChart() {
    this.buildMonthTotals();
    const symbols = [...new Set(this.filteredCredits.map(c => c.symbol))];
    if (!symbols.length) {
      symbols.push(this.primarySymbol);
    }

    const component = this;
    this.chart = new Chart({
      chart: { type: 'column' },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: symbols.length > 1 },
      plotOptions: {
        column: {
          stacking: symbols.length > 1 ? 'normal' : undefined,
          dataLabels: { enabled: false },
          cursor: 'pointer',
        },
        series: {
          cursor: 'pointer',
          events: {
            click: (event: any) => this.showCreditDetails(event),
          },
        },
      },
      yAxis: { title: { text: null } },
      xAxis: {
        categories: this.chartCategories,
        labels: {
          useHTML: true,
          formatter: function () {
            const month = String(this.value);
            const total = component.monthTotals[month] || '';
            return `<div style="text-align:center"><div>${month}</div><div style="font-size:11px;color:#444">${total}</div></div>`;
          },
        },
      },
      tooltip: {
        valueDecimals: 2,
        pointFormat: '{series.name} {point.y:.2f}<br/><span style="font-size:11px">Clique na barra para ver detalhes</span>',
      },
      series: symbols.map(symbol => ({
        name: symbol,
        type: 'column',
        data: this.getChartPointData(symbol),
      })),
    });
  }

  showCreditDetails(event: any) {
    const point = event.point;
    const credits: AnalyticsCreditRow[] = point.credits || [];
    const month = point.month || this.chartCategories[point.index];
    const symbol = event.point.series.name;

    this.dialog.open(CreditDetailsDialogComponent, {
      width: '900px',
      maxWidth: '95vw',
      data: {
        month,
        symbol,
        credits,
      },
    }).afterClosed().subscribe(changed => {
      if (changed) {
        this.loadChartData(true);
      }
    });
  }

  async loadChartData(refetch = true) {
    this.getChartCategories();
    if (refetch) {
      const startMonth = this.startDate.toISOString().substring(0, 7);
      const endMonth = this.endDate.toISOString().substring(0, 7);
      const result = await this.creditService.getAnalyticsCredits(startMonth, endMonth).toPromise();
      this.allCredits = result?.credits || [];
      if (this.allCredits.length) {
        this.primarySymbol = this.allCredits[0].symbol;
      }
    }
    this.renderChart();
  }

  onFilterChange() {
    this.renderChart();
  }

  openKeywordsDialog() {
    const ref = this.dialog.open(PassiveIncomeKeywordsDialogComponent, { width: '520px' });
    ref.afterClosed().subscribe(reload => {
      if (reload) {
        this.loadChartData(true);
      }
    });
  }

  goNextMonth(type: 'start' | 'end') {
    if (type == 'start') this.startDate = new Date(this.startDate.setMonth(this.startDate.getMonth() + 1));
    else if (type == 'end') this.endDate = new Date(this.endDate.setMonth(this.endDate.getMonth() + 1));
    this.loadChartData(true);
  }

  goPreviousMonth(type: 'start' | 'end') {
    if (type == 'start') this.startDate = new Date(this.startDate.setMonth(this.startDate.getMonth() - 1));
    else if (type == 'end') this.endDate = new Date(this.endDate.setMonth(this.endDate.getMonth() - 1));
    this.loadChartData(true);
  }
}
