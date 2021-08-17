import { StagedTransactionService } from './../../services/staged-transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-new-manual-debits-dialog',
  templateUrl: './new-manual-debits-dialog.component.html',
  styleUrls: ['./new-manual-debits-dialog.component.css']
})
export class NewManualDebitsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<NewManualDebitsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public source: any,
    private snack: MatSnackBar,
    private stagedTransactionService: StagedTransactionService
  ) { }

  newTransaction = {
    transactionDate: '',
    sourceDescription: '',
    value: 0,
  }

  transactions: any[] = []

  ngOnInit(): void {
  }

  add() {
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
    this.transactions.push({ ...this.newTransaction, sourceId: this.source.id })
    this.newTransaction.value = 0;
  }

  async finish() {
    await this.stagedTransactionService.insertArray(this.transactions).toPromise();
    this.dialogRef.close();
  }

}
