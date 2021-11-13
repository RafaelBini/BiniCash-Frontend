import { AfterViewInit, Component, EventEmitter, HostListener, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StagedTransactionService } from 'src/app/services/staged-transaction.service';
import { UserService } from 'src/app/services/user.service';

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
  ) {

  }
  @Output() refresh = new EventEmitter();
  @Output() refreshStep = new EventEmitter();
  @ViewChild('newValueInput') newValueInput: any;
  categories: any[] = [];
  categoriesAvg: any[] = [];
  selectedCategory: any = undefined;
  newValue: any = 0;
  creditsToDistribute: any[] = [];
  credits: any[] = []

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

  getAvgsFromCategory(categoryId: number) {
    return this.categoriesAvg.find(ca => ca.id == categoryId);
  }

  updateDescription(credit: any) {
    this.stagedTransactionService.update({ id: credit.id, description: credit.description }).subscribe()
  }


  setNewValue(value: number) {

    this.newValue = value;

  }

  async undoCredit() {
    await this.stagedTransactionService.deleteCreditsByCategory(this.selectedCategory.id).toPromise();
    this.refresh.emit();
  }

  getNeededToCreditAVG() {
    const creditAVG = this.getAvgsFromCategory(this.selectedCategory.id).creditAvg;
    if (this.selectedCategory.stagedBalance - creditAVG < 0)
      return (this.selectedCategory.stagedBalance - creditAVG) * -1;
    return 0
  }

  getNeededToDebitAVG() {
    const debitAVG = this.getAvgsFromCategory(this.selectedCategory.id).debitAvg;
    if (this.selectedCategory.stagedBalance - (debitAVG * -1) < 0)
      return (this.selectedCategory.stagedBalance - (debitAVG * -1)) * -1;
    return 0;
  }

  getNeededToZero() {
    return (this.selectedCategory.stagedBalance < 0 ? this.selectedCategory.stagedBalance * -1 : 0)
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
    this.userService.goToStep(3).subscribe();
    this.refreshStep.emit();
  }


}
