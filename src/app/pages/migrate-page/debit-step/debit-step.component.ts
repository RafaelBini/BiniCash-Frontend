import { CreateTransactionChildrenDialogComponent } from './../../../dialogs/create-transaction-children-dialog/create-transaction-children-dialog.component';
import { ConfirmDialogComponent } from './../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
    private dialog: MatDialog,
  ) {
    this.debits = new MatTableDataSource<any>([]);
  }
  @ViewChild(MatSort) sort: any;
  @Output() updateCategories = new EventEmitter();
  @Output() refreshStep = new EventEmitter();
  @Output() refresh = new EventEmitter();
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
      this.selectCategory(this.selectedCategory);
    }
  }

  onDebitClick(row: any) {
    console.log(row)
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

    if (this.selectedCategory?.id == category.id) {
      this.selectedCategory = undefined;
      this.debits.filter = '';
    }
    else {
      this.debits.filterPredicate = (data, filter) => {
        return data.Source.currencyId == filter || !filter
      };
      this.debits.filter = category.Currency.id
      this.selectedCategory = category;
    }

  }

  goPrevious() {
    this.userService.goToStep(0).subscribe();
  }

  async goNext() {
    var mandatoryCategoriesPending = this.categories.filter(c => c.isDebitRequired && c.stagedDebit >= 0)
    if (mandatoryCategoriesPending.length > 0) {
      var content =
        `There are some mandatory debits pending:
      <br />
      <ul>`
      for (let mandatoryCategoryPending of mandatoryCategoriesPending) {
        content += `<li>${mandatoryCategoryPending.name}</li>`;
      }
      var diagRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Are you sure your wanna proceed?',
          content: content
        }
      })
      diagRef.afterClosed().subscribe(async result => {
        if (result) {
          await this.userService.goToStep(2).toPromise();
          this.refreshStep.emit();
        }

      })
    }
    else {
      await this.userService.goToStep(2).subscribe();
      this.refreshStep.emit();
    }
  }

  isReadyToGo() {
    return this.debits.data.filter(t => !t.description || !t.Category).length <= 0;
  }

  updateDescription(debit: any) {
    this.stagedTransactionService.update({ id: debit.id, description: debit.description }).subscribe()
  }

  splitValues(transaction: any) {
    const diagRef = this.dialog.open(CreateTransactionChildrenDialogComponent, {
      data: transaction
    })
    diagRef.afterClosed().subscribe(() => {
      this.refresh.emit()
    })
  }

}
