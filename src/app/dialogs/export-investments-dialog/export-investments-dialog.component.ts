import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, Inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UserService } from 'src/app/services/user.service';
import { StagedTransactionService } from 'src/app/services/staged-transaction.service';
import { YieldEntryDialogComponent } from '../yield-entry-dialog/yield-entry-dialog.component';

@Component({
  selector: 'app-export-investments-dialog',
  templateUrl: './export-investments-dialog.component.html',
  styleUrls: ['./export-investments-dialog.component.css']
})
export class ExportInvestmentsDialogComponent implements OnInit {


  constructor(
    public dialogRef: MatDialogRef<ExportInvestmentsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private stagedTransactionService: StagedTransactionService,
    public userService: UserService,
  ) { }

  stagedTransactions: any[] = []
  selectedSourceToIndex: any;
  searchTerm: string = '';

  async ngOnInit() {
    this.loadStagedTransactions();
  }

  async loadStagedTransactions() {
    this.stagedTransactions = await this.stagedTransactionService.getStagedTransactionsBySourceId(this.data.selectedSource.id).toPromise();
    this.stagedTransactions.sort((a, b) => a.transactionDate > b.transactionDate ? -1 : 1)
  }

  select(stagedTransaction: any) {
    stagedTransaction.selected = !stagedTransaction.selected;
  }

  getBalance() {
    const newBalance = this.stagedTransactions.filter(st => st.selected).reduce((p, c) => p + (c.value * -1), 0)
    if (this.selectedSourceToIndex) return this.data.sources[this.selectedSourceToIndex].balance + this.data.sources[this.selectedSourceToIndex].stagedBalance + newBalance
    else return undefined
  }

  isFiltered(description: string) {
    return description.toUpperCase().includes(this.searchTerm.toUpperCase());
  }

  selectAll() {
    var didSomething = false;
    for (let st of this.stagedTransactions) {
      if (this.isFiltered(st.sourceDescription) && !st.selected) {
        st.selected = true;
        didSomething = true;
      }
    }
    if (!didSomething) {
      for (let st of this.stagedTransactions) {
        if (this.isFiltered(st.sourceDescription) && st.selected) {
          st.selected = false;
        }
      }
    }
  }


  canFinish() {
    return this.selectedSourceToIndex && this.stagedTransactions.find(st => st.selected)
  }

  async finish() {
    if (!this.canFinish()) return;

    var insertArray = this.stagedTransactions.filter(st => st.selected).map(st => {
      return {
        sourceId: this.data.sources[this.selectedSourceToIndex].id,
        transactionDate: st.transactionDate,
        value: (st.value * -1),
        sourceDescription: st.sourceDescription
      }
    })

    var diagRef = this.dialog.open(YieldEntryDialogComponent, {
      data: {
        receiverSource: this.data.sources[this.selectedSourceToIndex],
        newBalance: this.getBalance()
      }
    })
    diagRef.afterClosed().subscribe(async value => {

      if (value != null && value != undefined && value != 'go') {
        insertArray.push({
          sourceId: this.data.sources[this.selectedSourceToIndex].id,
          transactionDate: new Date().toISOString(),
          value,
          sourceDescription: 'Rendimento'
        })

      }

      if (value == 'go' || (value != null && value != undefined)) {
        await this.stagedTransactionService.insertArray(insertArray).toPromise();
        this.dialogRef.close();
      }


    })



  }

  onKeyUp(event: any) {
    if (event.key == 'Enter') {
      this.selectAll()
    }
  }
}
