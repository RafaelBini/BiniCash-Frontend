import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { StagedTransactionService } from './../../../services/staged-transaction.service';
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


@Component({
  selector: 'app-debit-step',
  templateUrl: './debit-step.component.html',
  styleUrls: ['./debit-step.component.css']
})
export class DebitStepComponent implements OnInit, AfterViewInit {

  constructor(
    private userService: UserService,
    private stagedTransactionService: StagedTransactionService,
    private snack: MatSnackBar,
  ) {
    this.debits = new MatTableDataSource<any>([]);
  }
  @ViewChild(MatSort) sort: any;
  @Output() updateCategories = new EventEmitter();
  debits: MatTableDataSource<any>;
  categories: any[] = [];
  selectedCategory: any = undefined;
  displayedColumns = ['category', 'description', 'value', 'transactionDate', 'sourceDescription', 'sourceName'];

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.debits.sort = this.sort;
  }


  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'Escape') {
      this.selectedCategory = undefined;
    }
  }

  onDebitClick(row: any) {
    if (!this.selectedCategory)
      return;

    this.stagedTransactionService.update({
      ...row,
      categoryId: this.selectedCategory.id
    }).toPromise().then(() => {
      row.Category = this.selectedCategory;
      this.updateCategories.emit()
    }).catch(() => {
      this.snack.open('Error when saving changes', undefined, { duration: 4500 })
    })
  }

  selectCategory(category: any) {
    if (this.selectedCategory?.id == category.id)
      this.selectedCategory = undefined;
    else
      this.selectedCategory = category;
  }

  goPrevious() {
    this.userService.goToStep(0).subscribe();
  }

  goNext() {
    this.userService.goToStep(2).subscribe();
  }

  isReadyToGo() {
    return this.debits.data.filter(t => !t.description || !t.Category).length <= 0;
  }

  updateDescription(debit: any) {
    this.stagedTransactionService.update({ id: debit.id, description: debit.description }).subscribe()
  }

}
