import { CategoryService } from 'src/app/services/category.service';
import { UserService } from 'src/app/services/user.service';
import { TransactionService } from 'src/app/services/transaction.service';
import { Component, OnInit } from '@angular/core';
import { DateAdapter, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatDateFormats } from '@angular/material/core';
import { CurrencyService } from 'src/app/services/currency.service';
import { SourceService } from 'src/app/services/source.service';
import { MatDialog } from '@angular/material/dialog';
import { EditTransactionDialogComponent } from 'src/app/dialogs/edit-transaction-dialog/edit-transaction-dialog.component';

export const GRI_DATE_FORMATS: MatDateFormats = {
  ...MAT_NATIVE_DATE_FORMATS,
  display: {
    ...MAT_NATIVE_DATE_FORMATS.display,
    dateInput: {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    } as Intl.DateTimeFormatOptions,
  }
};

@Component({
  selector: 'app-all-transactions-page',
  templateUrl: './all-transactions-page.component.html',
  styleUrls: ['./all-transactions-page.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: GRI_DATE_FORMATS },
  ]
})


export class AllTransactionsPageComponent implements OnInit {

  constructor(
    public transactionService: TransactionService,
    private userService: UserService,
    private categoryService: CategoryService,
    private sourceService: SourceService,
    private currencyService: CurrencyService,
    private readonly adapter: DateAdapter<Date>,
    private dialog: MatDialog
  ) {
    this.adapter.setLocale(this.userService.me.Configs['LANGUAGE'] || 'en-US');

  }

  searchingTextFieldsOptions = [
    { name: 'TRANSACTION.DESCRIPTION', value: 'DESCRIPTION' },
    { name: 'TRANSACTION.SOURCE_DESCRIPTION', value: 'SOURCE_DESCRIPTION' },
    { name: 'TRANSACTION.SOURCE_REFERENCE', value: 'SOURCE_REFERENCE' },
    { name: 'TRANSACTION.INPUT_METHOD', value: 'INPUT_METHOD' },
  ];
  categories: any[] = [];
  sources: any[] = [];
  currencies: any[] = [];

  isLoading = false;
  transactions: any[] = []
  sums: any[] = []


  filter: Filter = {
    term: '',
    searchingTextFields: ['DESCRIPTION', 'SOURCE_DESCRIPTION', 'SOURCE_REFERENCE', 'INPUT_METHOD'],
    orderBy: 'TRANSACTION_DATE DESC',
    categoriesIds: ['ALL'],
    sourcesIds: ['ALL'],
    currenciesIds: ['All'],
    valueTypes: ['CREDITS', 'DEBITS'],
    dateRange: { start: new Date(new Date().getTime() - (10 * 12 * 30 * 24 * 60 * 60 * 1000)).toISOString(), end: new Date().toISOString() },
    includeTransferences: true
  }

  async ngOnInit() {
    this.isLoading = true;
    await this.loadInfo();
    await this.fetchData();
    this.isLoading = false;
  }

  async loadInfo() {
    this.categories = [...(await this.categoryService.getMyCategories().toPromise())];
    this.filter.categoriesIds = ['All', ...this.categories.map(c => c.id)]
    this.sources = [...(await this.sourceService.getMySources().toPromise())];
    this.filter.sourcesIds = ['All', ...this.sources.map(s => s.id)]
    this.currencies = [...(await this.currencyService.getMyCurrencies().toPromise())];
    this.filter.currenciesIds = ['All', ...this.currencies.map(c => c.id)]
  }

  categoryById(id: any) {
    return this.categories.find(c => c.id == id) || { name: '' };
  }
  currencyById(id: any) {
    return this.currencies.find(c => c.id == id) || { name: '' };
  }
  sourceById(id: any) {
    return this.sources.find(s => s.id == id) || { name: '' };
  }

  toggleAllSelection(type: 'categories' | 'sources' | 'currencies') {
    if ((this.filter[`${type}Ids` as keyof Filter] as string[]).length != (this[type as keyof AllTransactionsPageComponent] as any[]).length)
      (this.filter[`${type}Ids` as keyof Filter] as string[]) = ['All', ...(this[type as keyof AllTransactionsPageComponent] as any[]).map(c => c.id)]
    else
      (this.filter[`${type}Ids` as keyof Filter] as string[]) = []
  }
  updateAllOption(type: 'categories' | 'sources' | 'currencies') {
    if ((this.filter[`${type}Ids` as keyof Filter] as string[]).includes('All') && (this.filter[`${type}Ids` as keyof Filter] as string[]).length != (this[type as keyof AllTransactionsPageComponent] as any[]).length + 1) {
      (this.filter[`${type}Ids` as keyof Filter] as string[]) = (this.filter[`${type}Ids` as keyof Filter] as string[]).filter(c => c != 'All')
    }
    if (!(this.filter[`${type}Ids` as keyof Filter] as string[]).includes('All') && (this.filter[`${type}Ids` as keyof Filter] as string[]).length == (this[type as keyof AllTransactionsPageComponent] as any[]).length) {
      (this.filter[`${type}Ids` as keyof Filter] as string[]).push('All')
    }
  }

  async fetchData() {
    this.isLoading = true;
    const result = await this.transactionService.getAllTransactions(this.filter).toPromise();
    this.transactions = result.transactions;
    this.sums = result.sums;
    this.isLoading = false;
  }

  editTransaction(transaction: any) {
    var diagRef = this.dialog.open(EditTransactionDialogComponent, {
      data: { transaction, categories: this.categories }
    });
    diagRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchData();
      }
    })
  }

}

interface Filter {
  term: string,
  searchingTextFields: string[],
  orderBy: string,
  categoriesIds: string[],
  sourcesIds: string[],
  currenciesIds: string[],
  valueTypes: string[],
  dateRange: {
    start: string
    end: string
  },
  includeTransferences: boolean
}
