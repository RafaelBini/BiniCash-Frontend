import { CurrencyService } from 'src/app/services/currency.service';
import { Currency } from 'src/app/models/currency';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-currency',
  templateUrl: './new-currency.component.html',
  styleUrls: ['./new-currency.component.css']
})
export class NewCurrencyComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewCurrencyComponent>,
    @Inject(MAT_DIALOG_DATA) public currencies: any,
    private currencyService: CurrencyService
  ) { }

  newCurrency: any = {
    name: '',
    symbol: '',
    description: ''
  };

  ngOnInit(): void {
  }

  async create() {
    await this.currencyService.createCurrency(this.newCurrency).toPromise()
    this.dialogRef.close(true);
  }

}
