import { DebitStepComponent } from './debit-step/debit-step.component';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { StagedTransactionService } from 'src/app/services/staged-transaction.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-migrate-page',
  templateUrl: './migrate-page.component.html',
  styleUrls: ['./migrate-page.component.css']
})
export class MigratePageComponent implements OnInit {

  constructor(
    private stagedTransactionService: StagedTransactionService,
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router
  ) { }

  @ViewChild(DebitStepComponent) debitStep: any;
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

    this.loadData();

  }


  loadData() {
    this.stagedTransactionService.get().subscribe(transactions => {
      this.debitStep.debits.data = transactions.filter(t => t.value < 0);

    })
  }

}
