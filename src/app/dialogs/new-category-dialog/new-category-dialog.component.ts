import { NewCurrencyComponent } from './../new-currency/new-currency.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from './../../services/category.service';
import { CurrencyService } from './../../services/currency.service';
import { Currency } from './../../models/currency';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-category-dialog',
  templateUrl: './new-category-dialog.component.html',
  styleUrls: ['./new-category-dialog.component.css']
})
export class NewCategoryDialogComponent implements OnInit {

  constructor(
    private currencyService: CurrencyService,
    private categoryService: CategoryService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<NewCategoryDialogComponent>,
    private dialog: MatDialog,
  ) { }

  newCategory: any = {
    name: '',
    description: '',
    priority: 50,
    isTransference: false,
    isDebitRequired: false,
    currencyId: undefined,
  };
  currencies: Currency[] = []

  async ngOnInit() {
    await this.loadCurrencies();
    this.newCategory.currencyId = this.currencies[0].id;
  }

  async loadCurrencies() {
    this.currencies = await this.currencyService.getMyCurrencies().toPromise()
  }

  add() {
    this.categoryService.create(this.newCategory).toPromise().then(() => {
      this.dialogRef.close(true);
    })
      .catch(reason => {
        this.snack.open(reason.error.msg, undefined, { duration: 3500 });
      })
  }

  openNewCurrencyDialog() {
    var newCurrenyDiag = this.dialog.open(NewCurrencyComponent, {
      data: this.currencies
    })
    newCurrenyDiag.afterClosed().subscribe(result => {
      if (result) {
        this.loadCurrencies();
      }
    })
  }

}
