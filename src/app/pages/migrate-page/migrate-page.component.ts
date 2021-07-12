import { ImportStepComponent } from './import-step/import-step.component';
import { DebitStepComponent } from './debit-step/debit-step.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { StagedTransactionService } from 'src/app/services/staged-transaction.service';
import { MatTableDataSource } from '@angular/material/table';
import { CategoryService } from 'src/app/services/category.service';

@Component({
  selector: 'app-migrate-page',
  templateUrl: './migrate-page.component.html',
  styleUrls: ['./migrate-page.component.css']
})
export class MigratePageComponent implements OnInit {

  constructor(
    private stagedTransactionService: StagedTransactionService,
    private categoryService: CategoryService,
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router
  ) { }

  @ViewChild(DebitStepComponent) debitStep: any;
  @ViewChild(ImportStepComponent) importStep: any;
  selectedIndex = 0;
  userInfo: any = { routineStep: 0 }

  ngOnInit(): void {
    this.userService.getMyUserInfo().subscribe(userInfo => {
      this.userInfo = userInfo
      this.selectedIndex = this.userInfo.routineStep;
    }, error => {
      this.snack.open(error, undefined, { duration: 3500 })
      this.router.navigate(['main'])
    })

    this.loadData(undefined);

  }


  async loadData(event: any) {

    const index = event?.selectedIndex || this.selectedIndex;

    if (index == 0) {
      var stagedSources = await this.stagedTransactionService.getStagedBlancesBySource().toPromise();
      this.importStep.sources = stagedSources;
    }
    else if (index == 1) {

      var transactions = await this.stagedTransactionService.get().toPromise();
      this.debitStep.debits.data = transactions.filter(t => t.value < 0);

      var transactionsByCategory = await this.stagedTransactionService.getStagedBlancesByCategory().toPromise()

      var categories = await this.categoryService.getMyCategories().toPromise();
      categories = categories.map(c => {
        return {
          ...c,
          balance: transactionsByCategory.find(t => t.id == c.id)?.balance || 0,
          debit: transactionsByCategory.find(t => t.id == c.id)?.debit || 0,
        }
      })
      this.debitStep.categories = categories;
    }

  }

}
