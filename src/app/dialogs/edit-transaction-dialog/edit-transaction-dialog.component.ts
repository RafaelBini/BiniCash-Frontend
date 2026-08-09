import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreditService } from 'src/app/services/credit.service';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-edit-transaction-dialog',
  templateUrl: './edit-transaction-dialog.component.html',
  styleUrls: ['./edit-transaction-dialog.component.css']
})
export class EditTransactionDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditTransactionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snack: MatSnackBar,
    private transactionService: TransactionService,
    private creditService: CreditService
  ) { }

  editedTransaction = {
    id: '',
    description: '',
    category_id: 0,
  }

  editedCredit = {
    id: 0,
    description: '',
    isTransference: false,
  }

  get isCredit(): boolean {
    return this.data?.transaction?.value > 0;
  }

  get isDebit(): boolean {
    return this.data?.transaction?.value < 0;
  }

  ngOnInit(): void {
    if (this.isDebit) {
      this.editedTransaction.description = this.data.transaction.description;
      this.editedTransaction.category_id = this.data.transaction.category_id;
      this.editedTransaction.id = this.data.transaction.id;
      return;
    }

    if (this.isCredit) {
      this.editedCredit.id = this.data.transaction.id;
      this.editedCredit.description = this.data.transaction.description || '';
      this.editedCredit.isTransference = !!(
        this.data.transaction.is_transference ?? this.data.transaction.isTransference
      );
    }
  }

  async save() {
    try {
      if (this.isCredit) {
        await this.creditService.updateCredit(this.editedCredit.id, {
          description: this.editedCredit.description,
          isTransference: this.editedCredit.isTransference,
        }).toPromise();
      } else {
        await this.transactionService.update(this.editedTransaction).toPromise();
      }
      this.snack.open('Transaction updated successfully!', undefined, { duration: 3500 });
      this.dialogRef.close(true);
    }
    catch (ex) {
      this.snack.open('Failed to save the change', undefined, { duration: 3500 });
    }
  }

}
