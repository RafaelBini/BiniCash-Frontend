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

  add(type: '-' | '+') {

    if ((this.transaction.value - this.getChildrenSum() + this.newChildTransaction.value) > 0) {
      this.snack.open('Not enough money to split', undefined, { duration: 3500 })
      return;
    }
    else if (!this.newChildTransaction.description) {
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
    return this.children.reduce((p, c) => {
      return p + c.value
    }, 0)
  }


  async finish() {
    try {
      await this.stagedTransactionService.insertChildrenArray(this.children, this.transaction.id).toPromise();
      this.dialogRef.close()
    }
    catch (error) {
      this.snack.open('Problem when trying to finish', undefined, { duration: 3500 })
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
          description: obj[1],
          value: +obj[2]
        }
      })
      this.children = [...this.children, ...transactions]
    }
    input.value = "";
  }
}
