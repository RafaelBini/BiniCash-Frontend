import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StagedTransactionService } from 'src/app/services/staged-transaction.service';

@Component({
  selector: 'app-create-transaction-children-dialog',
  templateUrl: './create-transaction-children-dialog.component.html',
  styleUrls: ['./create-transaction-children-dialog.component.css']
})
export class CreateTransactionChildrenDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<CreateTransactionChildrenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public transaction: any,
    private snack: MatSnackBar,
    private stagedTransactionService: StagedTransactionService
  ) { }

  newChildTransaction = {
    description: '',
    value: 0,
  }

  children: any[] = []

  ngOnInit(): void {
  }

  onKeyUp(event: any) {
    if (event.key == 'Enter') {
      this.add('-');
    }
  }

  substring(text: string) {
    return text.substring(0, 20) + '...'
  }

  add(type: '-' | '+') {

    if (!this.newChildTransaction.description) {
      this.snack.open('A description is required', undefined, { duration: 3500 })
      return;
    }
    else if (!this.newChildTransaction.value) {
      this.snack.open('A value is required', undefined, { duration: 3500 })
      return;
    }

    var newTransaction = {
      description: this.newChildTransaction.description,
      value: Math.abs(this.newChildTransaction.value) * (type == '-' ? -1 : 1)
    };

    this.children.push(newTransaction)
    this.newChildTransaction = {
      description: '', value: 0
    }
  }

  getChildrenSum() {
    return Math.round(this.children.reduce((p, c) => {
      return p + c.value
    }, 0) * 1e2) / 1e2
  }


  async finish() {

    try {
      await this.stagedTransactionService.insertChildrenArray(this.children, this.transaction.id).toPromise();
      this.dialogRef.close()
    }
    catch (error: any) {
      this.snack.open(error.error.msg, undefined, { duration: 3500 })
      return;
    }

  }

  remove(childIndex: number) {
    this.children.splice(childIndex, 1);
  }

  async uploadFile(event: any, input: any) {
    var files = event.target.files as File[];
    for (let file of files) {
      const rawContent = await file.text();
      var transactions = rawContent.split('\n').splice(1).map(row => {
        var obj = row.split(';')
        return {
          description: `${obj[0].substring(2, 10)} ${obj[1]}`,
          value: +obj[2]
        }
      })
      this.children = [...this.children, ...transactions]
    }
    input.value = "";
  }
}
