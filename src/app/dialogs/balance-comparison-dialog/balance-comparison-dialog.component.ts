import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-balance-comparison-dialog',
  templateUrl: './balance-comparison-dialog.component.html',
  styleUrls: ['./balance-comparison-dialog.component.css']
})
export class BalanceComparisonDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<BalanceComparisonDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
