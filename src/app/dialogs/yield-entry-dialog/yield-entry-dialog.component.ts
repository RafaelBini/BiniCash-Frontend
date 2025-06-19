import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-yield-entry-dialog',
  templateUrl: './yield-entry-dialog.component.html',
  styleUrls: ['./yield-entry-dialog.component.css']
})
export class YieldEntryDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<YieldEntryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }

  currentBalance: number | undefined = undefined;

  ngOnInit(): void {
  }

  enterYield() {
    if (this.currentBalance) {
      var percent = (((this.currentBalance - this.data.newBalance) / this.data.receiverSource.balance) * 100).toFixed(2)
      var value = this.currentBalance - this.data.newBalance;
      this.dialogRef.close({ value, percent });
    }

  }


}
