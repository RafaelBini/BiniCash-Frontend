import { StagedTransactionService } from './../../services/staged-transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-new-manual-debits-dialog',
  templateUrl: './new-manual-debits-dialog.component.html',
  styleUrls: ['./new-manual-debits-dialog.component.css']
})
export class NewManualDebitsDialogComponent implements OnInit, AfterViewInit {

  constructor(
    public dialogRef: MatDialogRef<NewManualDebitsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public source: any,
    private snack: MatSnackBar,
    private stagedTransactionService: StagedTransactionService,
    public userService: UserService,
  ) { }

  newTransaction = {
    transactionDate: '',
    sourceDescription: '',
    value: 0,
  }
  @ViewChild('newBalanceInput') newBalanceInput: any;
  @ViewChild('newTransactionValueInput') newTransactionValueInput: any;
  transactions: any[] = []
  newBalance = 0;
  lastBalance = 0;

  ngOnInit(): void {

  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.updateNewBalance();
    })

  }


  add(type: 'debit' | 'credit') {
    if (!this.newTransaction.sourceDescription) {
      this.snack.open('Please input a description', undefined, { duration: 3000 });
      return;
    }
    else if (!this.newTransaction.value) {
      this.snack.open('Please input a value', undefined, { duration: 3000 });
      return;
    }
    else if (!this.newTransaction.transactionDate || new Date(this.newTransaction.transactionDate).getTime() > (new Date().getTime()) + (1000 * 60 * 60 * 10)) {
      this.snack.open('Please input a valid date', undefined, { duration: 3000 });
      return;
    }
    var transactionToInsert = {
      ...this.newTransaction,
      value: this.newTransaction.value * (type == 'debit' ? -1 : 1),
      sourceId: this.source.id
    }
    this.transactions.push(transactionToInsert)
    this.newTransaction.value = 0;
    this.updateNewBalance();
  }

  remove(index: number) {
    this.transactions.splice(index, 1);
    this.updateNewBalance();
  }

  async finish() {
    await this.stagedTransactionService.insertArray(this.transactions).toPromise();
    this.dialogRef.close();
  }

  updateNewBalance() {
    var instanceBalance = this.transactions.reduce((c, p) => {
      return c + p.value
    }, 0);
    this.newBalance = this.source.balance + this.source.stagedBalance + instanceBalance
    this.newBalanceInput.nativeElement.value = (this.newBalance).toLocaleString(this.userService.me.Configs['LANGUAGE']);

  }

  updateNewTransactionValue(targetBalanceString: string) {
    if (this.userService.me.Configs['LANGUAGE'] == 'pt-BR') {
      targetBalanceString = targetBalanceString.replace('.', '').replace(',', '.')
    }
    var targetBalance = Number.parseFloat(targetBalanceString);
    this.newTransaction.value = Math.abs(this.newBalance - targetBalance);
    this.newTransactionValueInput.nativeElement.value = Math.abs(this.newTransaction.value).toLocaleString(this.userService.me.Configs['LANGUAGE']);
  }

  setNewTransactionValue(value: string) {
    if (this.userService.me.Configs['LANGUAGE'] == 'pt-BR') {
      value = value.replace('.', '').replace(',', '.')
    }
    this.newTransaction.value = Number.parseFloat(value);
  }

}
