import { DecimalPipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Component, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StagedTransactionService } from 'src/app/services/staged-transaction.service';
import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';

export type CreditDistributionOption = 'zeroBalance' | 'currentDebit' | 'lastCredit';

const CREDIT_DISTRIBUTION_PREFS_KEY = 'binicash_credit_distribution_prefs';

@Component({
  selector: 'app-credit-step',
  templateUrl: './credit-step.component.html',
  styleUrls: ['./credit-step.component.css']
})
export class CreditStepComponent {

  constructor(
    private userService: UserService,
    private stagedTransactionService: StagedTransactionService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
    private decimalPipe: DecimalPipe,
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
    'APLIC', 'RESG', 'JESUS'
  ]

  private pendingCreditOption: CreditDistributionOption | null = null;
  private autoDistributionRan = false;

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

  resetAutoDistributionFlag() {
    this.autoDistributionRan = false;
  }

  applyCreditOption(option: CreditDistributionOption, value: number) {
    this.pendingCreditOption = option;
    this.setNewValue(value);
  }

  getCurrentDebit() {
    return Math.abs(this.debits.filter(d => d.categoryId == this.selectedCategory.id).reduce((p, c) => p + c.value, 0))
  }

  getLastCreditDistrib() {
    return this.lastCreditDistribs.find(lcd => lcd.id == this.selectedCategory.id)?.sum ?? 0;
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

  private getAvailableCredit(symbol: string) {
    return this.creditsToDistribute.find(c => c.symbol == symbol)?.credit ?? 0;
  }

  private loadPreferences(): Record<string, CreditDistributionOption> {
    try {
      const raw = localStorage.getItem(CREDIT_DISTRIBUTION_PREFS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  }

  private saveCategoryPreference(categoryId: number, option: CreditDistributionOption) {
    const prefs = this.loadPreferences();
    prefs[String(categoryId)] = option;
    localStorage.setItem(CREDIT_DISTRIBUTION_PREFS_KEY, JSON.stringify(prefs));
  }

  private computeDistributionAmount(category: any, option: CreditDistributionOption): number {
    switch (option) {
      case 'zeroBalance':
        return category.stagedBalance < 0 ? category.stagedBalance * -1 : 0;
      case 'currentDebit': {
        const currentDebit = Math.abs(
          this.debits.filter(d => d.categoryId == category.id).reduce((p, c) => p + c.value, 0)
        );
        const value = currentDebit - category.stagedBalance;
        return value > 0 ? value : 0;
      }
      case 'lastCredit': {
        const last = this.lastCreditDistribs.find(lcd => lcd.id == category.id);
        return last?.sum ?? 0;
      }
    }
  }

  private formatAmount(symbol: string, value: number) {
    const locale = this.userService.me?.Configs?.['LANGUAGE'] || 'pt-BR';
    const formatted = this.decimalPipe.transform(value, '1.2-2', locale);
    return `${symbol} ${formatted}`;
  }

  private async reloadDistributionState() {
    const stagedBalancesByCategory = await this.stagedTransactionService.getStagedBlancesByCategory().toPromise();
    this.categories = [...stagedBalancesByCategory.sort((a, b) => b.priority - a.priority)];
    this.creditsToDistribute = await this.stagedTransactionService.getCreditsToDistribute().toPromise();
    if (this.selectedCategory) {
      this.selectedCategory = this.categories.find((c: any) => c.id == this.selectedCategory.id);
    }
  }

  async runAutoDistributionFromPreferences() {
    if (this.autoDistributionRan) {
      return;
    }
    this.autoDistributionRan = true;

    const prefs = this.loadPreferences();
    const categoryIdsWithPrefs = Object.keys(prefs);
    if (!categoryIdsWithPrefs.length) {
      return;
    }

    const distributedBySymbol = new Map<string, number>();

    for (const category of this.categories) {
      const option = prefs[String(category.id)];
      if (!option) {
        continue;
      }

      const amount = this.computeDistributionAmount(category, option);
      if (amount <= 0) {
        continue;
      }

      const symbol = category.Currency.symbol;
      const available = this.getAvailableCredit(symbol);
      if (amount > available) {
        break;
      }

      try {
        await this.stagedTransactionService.distributeCreditToCategory(amount, category.id).toPromise();
        distributedBySymbol.set(symbol, (distributedBySymbol.get(symbol) ?? 0) + amount);
        await this.reloadDistributionState();
      } catch (error: any) {
        this.snack.open(error.error?.msg ?? 'Falha na distribuição automática', undefined, { duration: 3500 });
        break;
      }
    }

    if (distributedBySymbol.size > 0) {
      const messageParts = Array.from(distributedBySymbol.entries()).map(
        ([symbol, total]) => this.formatAmount(symbol, total)
      );
      this.snack.open(
        `${messageParts.join(', ')} distribuidos automaticamente`,
        undefined,
        { duration: 5000 }
      );
      this.refresh.emit();
    }
  }

  async addCredit() {
    try {
      if (!this.newValue) {
        this.snack.open('You need to provide a value', undefined, { duration: 3500 })
        return;
      }
      var creditToDistribute = this.creditsToDistribute.find(c => c.symbol == this.selectedCategory.Currency.symbol)?.credit || 0

      if (creditToDistribute < this.newValue) {
        this.snack.open('You do not have credit enough for this distribution', undefined, { duration: 3500 })
        return;
      }

      const optionToSave = this.pendingCreditOption;
      const categoryId = this.selectedCategory.id;

      await this.stagedTransactionService.distributeCreditToCategory(this.newValue, categoryId).toPromise()

      if (optionToSave) {
        this.saveCategoryPreference(categoryId, optionToSave);
      }
      this.pendingCreditOption = null;

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
    else {
      this.selectedCategory = category;
      this.pendingCreditOption = null;
    }
  }

  goPrevious() {
    this.resetAutoDistributionFlag();
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
