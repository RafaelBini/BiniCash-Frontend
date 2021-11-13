import { CategoryService } from './../../services/category.service';
import { CurrencyService } from './../../services/currency.service';
import { TransactionService } from './../../services/transaction.service';
import { Transaction } from './../../models/transaction';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Currency } from 'src/app/models/currency';
import { SourceService } from 'src/app/services/source.service';


@Component({
  selector: 'app-my-transactions-page',
  templateUrl: './my-transactions-page.component.html',
  styleUrls: ['./my-transactions-page.component.css']
})
export class MyTransactionsPageComponent implements AfterViewInit, OnInit {

  displayedColumns: string[] = ['id', 'transactionDate', 'value', 'description',
    'category', 'sourceDescription', 'source', 'sourceReference', 'inputMethod']
  dataSource: any;
  filter: TransactionFilter = {
    term: '',
    categories: [],
    sources: [],
    types: ['Credits', 'Debits'],
    includeTransferences: true,
    searchOn: {
      description: true,
      sourceDescription: true,
      sourceReference: true,
    }
  };
  total: Total = {
    sum: [],
    count: 0
  }
  currencies: Currency[] = [];
  categories: string[] = [];
  sources: string[] = [];

  @ViewChild(MatPaginator) paginator: any;
  @ViewChild(MatSort) sort: any;

  constructor(
    private transactionService: TransactionService,
    private currencyService: CurrencyService,
    private categoryService: CategoryService,
    private sourceService: SourceService
  ) {

  }

  ngAfterViewInit() {
    this.transactionService.getTransactions().subscribe(transactions => {
      this.dataSource = new MatTableDataSource(transactions.sort());
      this.updateTotal();
      this.dataSource.paginator = this.paginator;
      this.dataSource.sortingDataAccessor = (item: any, property: string) => {
        switch (property) {
          case 'category': return item.Category.name;
          case 'source': return item.Source ? item.Source.name : '--';
          default: return item[property];
        }
      };
      this.dataSource.filterPredicate = (data: Transaction, filter: TransactionFilter) => {
        const term = filter.term.toNormalized();

        if (!filter.includeTransferences && data.Category.isTransference)
          return false;

        if (!filter.types.includes('Credits') && data.value > 0)
          return false;

        if (!filter.types.includes('Debits') && data.value < 0)
          return false;

        if (!filter.categories.includes(data.Category.name))
          return false;

        if (data.Source != null && (!filter.sources.includes('All') || !filter.sources.includes(data.Source?.name))) {
          console.log(data)
          return false;
        }

        if (!term)
          return true;

        if (filter.searchOn.description && data.description && data.description.toNormalized().includes(term))
          return true;

        if (filter.searchOn.sourceDescription && data.sourceDescription && data.sourceDescription.toNormalized().includes(term))
          return true;

        if (filter.searchOn.sourceReference && data.sourceReference && data.sourceReference.toNormalized().includes(term))
          return true;

        return false;

      };
      this.dataSource.sort = this.sort;
    });
  }

  async ngOnInit() {
    this.currencies = await this.currencyService.getMyCurrencies().toPromise();
    for (let currency of this.currencies)
      this.total.sum.push({ symbol: currency.symbol, value: 0 });
    this.categories = [...(await this.categoryService.getMyCategories().toPromise()).map(c => c.name)];
    this.filter.categories = ['All', ...this.categories]
    this.sources = [...(await this.sourceService.getMySources().toPromise()).map(s => s.name)];
    this.filter.sources = ['All', ...this.sources]
  }

  toggleAllCategoriesSelection() {
    if (this.filter.categories.length != this.categories.length)
      this.filter.categories = ['All', ...this.categories]
    else
      this.filter.categories = []
    this.applyFilter();
  }
  updateCategoriesAllOption() {

    //console.log(`TEM ALL: ${this.filter.sources.includes('All')} FILTER: ${this.filter.sources.length} SOURCES: ${this.sources.length}`)
    if (this.filter.categories.includes('All') && this.filter.categories.length != this.categories.length + 1) {
      this.filter.categories = this.filter.categories.filter(c => c != 'All')
    }
    if (!this.filter.categories.includes('All') && this.filter.categories.length == this.categories.length) {
      this.filter.categories.push('All')
    }
    this.applyFilter();
  }


  toggleAllSourcesSelection() {
    // console.log(`${this.filter.sources.length} != ${this.sources.length}`)
    if (this.filter.sources.length != this.sources.length)
      this.filter.sources = ['All', ...this.sources]
    else
      this.filter.sources = []
    this.applyFilter();
  }
  updateSourcesAllOption() {

    //console.log(`TEM ALL: ${this.filter.sources.includes('All')} FILTER: ${this.filter.sources.length} SOURCES: ${this.sources.length}`)
    if (this.filter.sources.includes('All') && this.filter.sources.length != this.sources.length + 1) {
      this.filter.sources = this.filter.sources.filter(s => s != 'All')
    }
    if (!this.filter.sources.includes('All') && this.filter.sources.length == this.sources.length) {
      this.filter.sources.push('All')
    }
    this.applyFilter();
  }

  applyFilter() {
    this.dataSource.filter = this.filter;
    this.updateTotal();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  updateTotal() {
    this.total.count = 0;
    for (let item of this.total.sum) {
      item.value = 0;
    }
    this.total = this.dataSource.filteredData.reduce((p: Total, c: Transaction) => {

      var newTotal = { ...p };
      newTotal.count++;

      const sumIndex = p.sum.findIndex(s => s.symbol == c.Category.Currency.symbol);

      if (sumIndex >= 0)
        newTotal.sum[sumIndex].value += c.value;
      else
        console.log("Transação bugada", c)
      return newTotal;
    }, this.total)
  }



}

interface TransactionFilter {
  term: string,
  categories: string[],
  sources: string[],
  types: string[],
  includeTransferences: boolean,
  searchOn: {
    description: boolean,
    sourceDescription: boolean,
    sourceReference: boolean,
  }
}

interface Total {
  sum: Array<{ symbol: string, value: number }>,
  count: number
}