import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

interface PluggyBill {
  id: string | number;
  totalAmount: number;
  date: string | null;
  dueDate: string | null;
  closingDate: string | null;
}

interface SelectPluggyBillDialogData {
  bills: PluggyBill[];
  currencySymbol: string;
}

@Component({
  selector: 'app-select-pluggy-bill-dialog',
  templateUrl: './select-pluggy-bill-dialog.component.html',
  styleUrls: ['./select-pluggy-bill-dialog.component.css']
})
export class SelectPluggyBillDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<SelectPluggyBillDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SelectPluggyBillDialogData
  ) { }

  select(bill: PluggyBill) {
    this.dialogRef.close(bill);
  }

  billDate(bill: PluggyBill): string {
    return bill.date || bill.dueDate || bill.closingDate || '';
  }
}
