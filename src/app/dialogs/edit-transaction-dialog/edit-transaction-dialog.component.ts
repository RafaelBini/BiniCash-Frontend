import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private transactionService: TransactionService
  ) { }

  editedTransaction = {
    id: '',
    description: '',
    category_id: 0,
  }

  ngOnInit(): void {
    this.editedTransaction.description = this.data.transaction.description;
    this.editedTransaction.category_id = this.data.transaction.category_id;
    this.editedTransaction.id = this.data.transaction.id;

  }

  async save() {
    try {
      await this.transactionService.update(this.editedTransaction).toPromise()
      this.snack.open('Transaction updated successfully!', undefined, { duration: 3500 })
      this.dialogRef.close(true)
    }
    catch (ex) {

      this.snack.open('Failed to save the change', undefined, { duration: 3500 })
    }

  }

}
