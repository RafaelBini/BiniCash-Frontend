import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { StagedTransactionService } from './../services/staged-transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { NewManualDebitsDialogComponent } from '../dialogs/new-manual-debits-dialog/new-manual-debits-dialog.component';

@Component({
  selector: 'app-edit-staged-transactions-dialog',
  templateUrl: './edit-staged-transactions-dialog.component.html',
  styleUrls: ['./edit-staged-transactions-dialog.component.css']
})
export class EditStagedTransactionsDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditStagedTransactionsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public source: any,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private stagedTransactionService: StagedTransactionService,
    public userService: UserService,
  ) { }

  stagedTransactions: any[] = []

  async ngOnInit() {
    this.loadStagedTransactions();
  }

  async loadStagedTransactions() {
    this.stagedTransactions = await this.stagedTransactionService.getStagedTransactionsBySourceId(this.source.id).toPromise();
    this.stagedTransactions.sort((a, b) => a.transactionDate > b.transactionDate ? -1 : 1)
  }

  getBalance() {
    return this.source.balance + this.stagedTransactions.reduce((p, c) => p + c.value, 0)
  }

  async uploadFile(event: any, source: any, input: any) {

    if (source.type == 'OFX') {
      var files = event.target.files as File[];
      for (let file of files) {
        var reader = new FileReader();
        reader.onload = async (e: any) => {
          const rawContent = e.target.result;
          console.log(rawContent)
          input.value = "";
          this.stagedTransactionService.insertOfx(rawContent, source).subscribe(result => {
            this.loadStagedTransactions();
          },
            error => {
              this.snack.open(error.error.msg, undefined, { duration: 3500 });
            })
        }
        reader.readAsText(file, 'us-ascii');

      }
    }
    else if (source.type == 'CSV') {
      var files = event.target.files as File[];
      for (let file of files) {
        const rawContent = await file.text();
        input.value = "";
        this.stagedTransactionService.insertCsv(rawContent, source).subscribe(result => {
          this.loadStagedTransactions();
        },
          error => {
            this.snack.open(error.error.msg, undefined, { duration: 3500 });
          })
      }
    }
  }

  async undo(source: any) {
    var ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        isDanger: true,
        title: 'Undo all changes?',
        content: 'You will remove all staged transactions'
      }
    })
    ref.afterClosed().subscribe(proceed => {
      if (!proceed) return;

      this.stagedTransactionService.deleteBySource(source.id).subscribe(result => {
        console.log(result)
        this.loadStagedTransactions();
      },
        error => {
          this.snack.open(error.error.msg, undefined, { duration: 3500 });
        })

    })

  }

  openManualDebitDialog(source: any) {
    var diagRef = this.dialog.open(NewManualDebitsDialogComponent, {
      data: source
    });
    diagRef.afterClosed().subscribe(() => {
      this.loadStagedTransactions();
    })
  }

  async delete(stagedTransactionId: number) {
    await this.stagedTransactionService.deleteById(stagedTransactionId).toPromise()
    this.loadStagedTransactions();
  }

}
