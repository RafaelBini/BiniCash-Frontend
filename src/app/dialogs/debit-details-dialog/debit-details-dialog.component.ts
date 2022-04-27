import { TransactionService } from 'src/app/services/transaction.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-debit-details-dialog',
  templateUrl: './debit-details-dialog.component.html',
  styleUrls: ['./debit-details-dialog.component.css']
})
export class DebitDetailsDialogComponent implements OnInit {

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private transactionService: TransactionService
  ) { }

  debits: any[] = []

  async ngOnInit() {
    this.debits = await this.transactionService.getDebitsFrom(this.data.categoryName, this.data.month).toPromise();
    console.log(this.debits)
  }

}
