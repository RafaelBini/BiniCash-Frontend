import { MatDialog } from '@angular/material/dialog';
import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StagedTransactionService } from 'src/app/services/staged-transaction.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-credit-step',
  templateUrl: './credit-step.component.html',
  styleUrls: ['./credit-step.component.css']
})
export class CreditStepComponent implements OnInit {

  constructor(
    private userService: UserService,
    private stagedTransactionService: StagedTransactionService,
    private snack: MatSnackBar,
    private dialog: MatDialog
  ) {

  }
  @Output() refresh = new EventEmitter();
  @Output() refreshStep = new EventEmitter();
  @ViewChild('newValueInput') newValueInput: any;
  categories: any[] = [];
  selectedCategory: any = undefined;
  newValue: any = 0;
  creditsToDistribute: any[] = [];
  credits: any[] = []
  debits: any[] = []
  lastCreditDistribs: any[] = []
  transferenceWords: string[] = [
    'APLICAÇÃO', 'RESGATE', 'APLICACAO', 'IGREJA JESUS'
  ]

  ngOnInit(): void {

  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    if (event.key == 'Escape') {
      this.selectedCategory = undefined;
    }
  }

  onNewValueKeyUp(event: KeyboardEvent) {
    if (event.key == 'Enter') {
      this.addCredit();
    }
  }

  getCurrentDebit() {
    return Math.abs(this.debits.filter(d => d.categoryId == this.selectedCategory.id).reduce((p, c) => p + c.value, 0))
  }

  getLastCreditDistrib() {
    return this.lastCreditDistribs.find(lcd => lcd.id == this.selectedCategory.id).sum;
  }

  updateCredit(credit: any) {
    this.stagedTransactionService.updateCredit({ id: credit.id, description: credit.description }).subscribe()
  }

  toggleIsTransference(credit: any) {
    if (credit.sourceReference == 'TRANSFERENCE') {
      credit.sourceReference = ''
      this.stagedTransactionService.updateCredit({ id: credit.id, isTransference: false }).subscribe()
    }
    else {
      credit.sourceReference = 'TRANSFERENCE'
      this.stagedTransactionService.updateCredit({ id: credit.id, isTransference: true }).subscribe()
    }
  }


  setNewValue(value: number) {

    this.newValue = value;

  }

  async undoCredit() {
    await this.stagedTransactionService.deleteCreditsByCategory(this.selectedCategory.id).toPromise();
    this.refresh.emit();
  }

  getNeededToZero() {
    return (this.selectedCategory.stagedBalance < 0 ? this.selectedCategory.stagedBalance * -1 : 0)
  }

  getNeededToCurrentDebit() {
    const value = this.getCurrentDebit() - this.selectedCategory.stagedBalance
    return value > 0 ? value : 0;
  }

  canGo() {
    for (let creditToDistribute of this.creditsToDistribute) {
      if (creditToDistribute.credit != 0)
        return false;
    }
    return true;
  }

  back() {
    this.selectedCategory = undefined;
  }

  async addCredit() {
    try {
      if (!this.newValue) {
        this.snack.open('You need to provide a value', undefined, { duration: 3500 })
        return;
      }
      // Get credits to distribute on thys currency
      var creditToDistribute = this.creditsToDistribute.find(c => c.symbol == this.selectedCategory.Currency.symbol)?.credit || 0

      if (creditToDistribute < this.newValue) {
        this.snack.open('You do not have credit enough for this distribution', undefined, { duration: 3500 })
        return;
      }

      await this.stagedTransactionService.distributeCreditToCategory(this.newValue, this.selectedCategory.id).toPromise()
      this.refresh.emit();
      this.newValue = 0;
    }
    catch (error: any) {
      this.snack.open(error.error.msg, undefined, { duration: 3500 })
      console.log("the error", error)
    }
  }

  selectCategory(category: any) {
    if (this.selectedCategory?.id == category.id)
      this.selectedCategory = undefined;
    else
      this.selectedCategory = category;
  }

  goPrevious() {
    this.userService.goToStep(1).subscribe();
    this.refreshStep.emit();
  }

  goNext() {

    if (this.getTransferenceDifference() != 0) {
      var diagRef = this.dialog.open(ConfirmDialogComponent, {
        data: {
          title: 'Inconsistent transactions',
          content: 'There is a difference between distributed and declared credit transactions values.<br /><br />Are you sure you want to proceed?',
        }
      })

      diagRef.afterClosed().subscribe(async (result) => {
        if (result) {
          this.userService.goToStep(3).subscribe();
          this.refreshStep.emit();
        }
      })
    }
    else {
      this.userService.goToStep(3).subscribe();
      this.refreshStep.emit();
    }



  }

  getDistributedCreditTransferencesTotal() {
    return this.categories.filter((c: any) => (c.isTransference == true)).reduce((p, c) => p + c.stagedCredit, 0);
  }

  getDeclaredCreditTransferencesTotal() {
    return this.credits.filter((c: any) => (c.sourceReference == 'TRANSFERENCE')).reduce((p, c) => p + c.value, 0);
  }

  getTransferenceDifference() {
    return Math.abs(this.getDistributedCreditTransferencesTotal() - this.getDeclaredCreditTransferencesTotal())
  }

}
