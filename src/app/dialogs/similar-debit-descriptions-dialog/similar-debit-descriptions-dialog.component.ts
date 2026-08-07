import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TransactionService } from 'src/app/services/transaction.service';

export interface SimilarDebitDescriptionsDialogData {
  stagedDebit: any;
}

@Component({
  selector: 'app-similar-debit-descriptions-dialog',
  templateUrl: './similar-debit-descriptions-dialog.component.html',
  styleUrls: ['./similar-debit-descriptions-dialog.component.css']
})
export class SimilarDebitDescriptionsDialogComponent implements OnInit {

  matches: any[] = [];
  isLoading = true;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SimilarDebitDescriptionsDialogData,
    private dialogRef: MatDialogRef<SimilarDebitDescriptionsDialogComponent>,
    private transactionService: TransactionService,
  ) { }

  async ngOnInit() {
    const debit = this.data.stagedDebit;
    try {
      this.matches = await this.transactionService.getSimilarDebits(
        debit.description,
        debit.sourceDescription,
      ).toPromise() || [];
    } finally {
      this.isLoading = false;
    }
  }

  select(match: any) {
    this.dialogRef.close(match.description);
  }
}
