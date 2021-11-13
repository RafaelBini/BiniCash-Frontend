import { TransactionService } from './../../services/transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Currency } from './../../models/currency';
import { CategoryService } from './../../services/category.service';
import { Category } from './../../models/category';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-transfer-category-dialog',
  templateUrl: './transfer-category-dialog.component.html',
  styleUrls: ['./transfer-category-dialog.component.css']
})
export class TransferCategoryDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<TransferCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public category: any,
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private snack: MatSnackBar
  ) { }

  toCategoryId: number = 0;
  transferValue: number = 0;
  categories: Category[] = [];

  async ngOnInit() {
    this.categories = (await this.categoryService.getMyCategories().toPromise()).filter(c => c.id != this.category.id && c.Currency.symbol == this.category.Currency.symbol && c.active).sort((a, b) => a.name > b.name ? 1 : -1);
    this.toCategoryId = this.categories[0].id
  }

  async transfer() {
    if (this.transferValue > this.category.balance) {
      this.snack.open("Not enough balance to transfer this value", undefined, { duration: 2500 })
      return;
    }
    try {
      await this.transactionService.transferCategory(this.category.id, this.toCategoryId, this.transferValue).toPromise()
      this.dialogRef.close(true);
    }
    catch (reason) {
      this.snack.open("Failde when transfering", undefined, { duration: 2500 })
    }

  }

}
