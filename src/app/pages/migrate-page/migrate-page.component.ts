import { RuleService } from './../../services/rule.service';
import { FinishStepComponent } from './finish-step/finish-step.component';
import { ConfirmDialogComponent } from './../../dialogs/confirm-dialog/confirm-dialog.component';
import { TransactionService } from './../../services/transaction.service';
import { CreditStepComponent } from './credit-step/credit-step.component';
import { ImportStepComponent } from './import-step/import-step.component';
import { DebitStepComponent } from './debit-step/debit-step.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { StagedTransactionService } from 'src/app/services/staged-transaction.service';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-migrate-page',
  templateUrl: './migrate-page.component.html',
  styleUrls: ['./migrate-page.component.css']
})
export class MigratePageComponent implements OnInit, AfterViewInit {

  constructor(
    private stagedTransactionService: StagedTransactionService,
    private userService: UserService,
    private dialog: MatDialog,
    private snack: MatSnackBar,
    private router: Router,
    private transactionService: TransactionService,
    private ruleService: RuleService,
  ) { }

  @ViewChild(DebitStepComponent) debitStep: any;
  @ViewChild(CreditStepComponent) creditStep: any;
  @ViewChild(ImportStepComponent) importStep: any;
  @ViewChild(FinishStepComponent) finishStep: any;
  @ViewChild('stepper') stepper: any;
  selectedIndex = 0;
  userInfo: any = { routineStep: 0 }
  transactionMessageSent = false;


  ngOnInit(): void {
    this.refreshStep();

    this.loadData(undefined);

  }

  ngAfterViewInit() {
    this.stepper.selectedIndex = this.userInfo.routineStep
  }

  async refreshStep() {
    console.log('updating interface')
    try {
      this.userInfo = await this.userService.getMyUserInfo().toPromise();
      if (this.stepper)
        this.stepper.selectedIndex = this.userInfo.routineStep;
    }
    catch (error) {
      this.snack.open('Failed when refreshing', undefined, { duration: 3500 })
      this.router.navigate(['main'])
    }


  }

  async loadData(event: any) {

    const index = event?.selectedIndex || this.stepper?.selectedIndex || 0;

    if (index == 0) {
      var stagedSources = await this.stagedTransactionService.getStagedBlancesBySource().toPromise();
      this.importStep.sources = stagedSources;
    }
    else if (index == 1) {
      var transactions = await this.stagedTransactionService.get().toPromise();
      this.debitStep.debits.data = transactions.filter(t => t.value < 0);
      this.updateCategories();
    }
    else if (index == 2) {
      var transactions = await this.stagedTransactionService.get().toPromise();
      this.creditStep.credits = transactions.filter(t => t.value > 0 && !t.categoryId && t.sourceId);
      this.creditStep.debits = transactions.filter(t => t.value < 0);
      this.creditStep.lastCreditDistribs = await this.transactionService.getLastCreditDistribs().toPromise();
      this.updateCategories();
      this.creditStep.creditsToDistribute = await this.stagedTransactionService.getCreditsToDistribute().toPromise();
      if (!this.transactionMessageSent) {
        var pendingTransferenceCreditCategories = this.creditStep.categories.filter((c: any) => (c.isTransference == true && c.stagedBalance < 0));
        if (pendingTransferenceCreditCategories.length > 0) {
          var content =
            `Do you wanna attribute credit to the transference accounts bellow?
          <br />
          <ul>
          `;

          for (let pendingTransferenceCreditCategory of pendingTransferenceCreditCategories) {
            content += `<li>${pendingTransferenceCreditCategory.name} (+ ${pendingTransferenceCreditCategory.Currency.symbol} ${pendingTransferenceCreditCategory.stagedBalance * -1})</li>`
          }
          content += `</ul>`;
          var diagRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
              title: 'Attribute credit automatically',
              content: content,
            }
          })
          diagRef.afterClosed().subscribe(async (result) => {
            if (result) {
              for (let pendingTransferenceCreditCategory of pendingTransferenceCreditCategories) {
                this.creditStep.selectedCategory = pendingTransferenceCreditCategory;
                this.creditStep.newValue = (pendingTransferenceCreditCategory.stagedBalance * -1);
                await this.creditStep.addCredit();
              }
              this.creditStep.selectedCategory = undefined;
              this.creditStep.newValue = 0;
            }
            this.transactionMessageSent = true;
          })

        }

      }

    }
    else if (index == 3) {
      var stagedBalancesByCategory = await this.stagedTransactionService.getStagedBlancesByCategory().toPromise()
      var stagedSources = await this.stagedTransactionService.getStagedBlancesBySource().toPromise();
      var stagedSavings = await this.stagedTransactionService.getStagedSavings().toPromise();

      var stagedCurrencies = new Map();

      for (let stagedSource of stagedSources) {

        const currencySymbol: string = stagedSource.symbol;

        var currency: { total: number, sources: any[], categories: any[] } = { total: 0, sources: [], categories: [] };

        if (!stagedCurrencies.get(currencySymbol)) {
          stagedCurrencies.set(currencySymbol, currency);
        }

        currency = {
          ...currency,
          total: stagedCurrencies.get(currencySymbol).total + stagedSource.balance + stagedSource.stagedBalance,
          sources: [...stagedCurrencies.get(currencySymbol).sources, stagedSource]
        }

        stagedCurrencies.set(currencySymbol, currency);
      }

      for (let stagedCategory of stagedBalancesByCategory) {
        var stagedCurrency = stagedCurrencies.get(stagedCategory.Currency.symbol);
        if (stagedCurrency) {
          stagedCurrency.categories.push(stagedCategory)
          stagedCurrencies.set(stagedCategory.Currency.symbol, stagedCurrency)
        }
      }

      for (let stagedSaving of stagedSavings) {
        var stagedCurrency = stagedCurrencies.get(stagedSaving.symbol);
        if (!stagedCurrency) break;

        stagedCurrency.savings = [{ name: 'CATEGORY.IS_SHORT_SAVING', value: stagedSaving.short }, { name: 'CATEGORY.IS_LONG_SAVING', value: stagedSaving.long }];
        stagedCurrencies.set(stagedSaving.symbol, stagedCurrency)
      }

      this.finishStep.currencies = Array.from(stagedCurrencies, ([symbol, value]) => ({ symbol, value }));;

    }

  }

  async updateCategories() {
    var stagedBalancesByCategory = await this.stagedTransactionService.getStagedBlancesByCategory().toPromise()
    this.debitStep.categories = [...stagedBalancesByCategory.sort((a, b) => (a.name > b.name ? 1 : -1))];
    this.creditStep.categories = [...stagedBalancesByCategory.sort((a, b) => b.priority - a.priority)];
    if (this.creditStep.selectedCategory)
      this.creditStep.selectedCategory = this.creditStep.categories.find((c: any) => c.id == this.creditStep.selectedCategory.id);
  }

  async cancel() {
    var diagRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Cancel this migration?',
        content: 'All new inserted data will be deleted and can not be restored'
      }
    })
    diagRef.afterClosed().subscribe(async result => {
      if (!result)
        return;
      try {
        await this.stagedTransactionService.cancelMigration().toPromise();
        this.router.navigate(['main'])
      }
      catch (error) {
        this.snack.open('Failed when trying to cancel migration', undefined, { duration: 3500 });
        return;
      }


    })

  }

  async runRules() {
    try {
      await this.ruleService.runRules().toPromise();
      await this.loadData(undefined);
      this.snack.open('Rules applied successfully!', undefined, { duration: 3500 })
    }
    catch (error) {
      this.snack.open('Failed when running rules!', undefined, { duration: 3500 })
    }

  }

}
