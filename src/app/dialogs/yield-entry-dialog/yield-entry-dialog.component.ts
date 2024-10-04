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
    if (this.currentBalance)
      this.dialogRef.close(this.currentBalance - this.data.newBalance);
  }


}
