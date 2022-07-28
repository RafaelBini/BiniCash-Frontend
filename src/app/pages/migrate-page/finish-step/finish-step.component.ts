import { UserService } from 'src/app/services/user.service';
import { ConfirmDialogComponent } from './../../../dialogs/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TransactionService } from './../../../services/transaction.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-finish-step',
  templateUrl: './finish-step.component.html',
  styleUrls: ['./finish-step.component.css']
})
export class FinishStepComponent implements OnInit {

  constructor(
    private snack: MatSnackBar,
    private transactionService: TransactionService,
    private router: Router,
    private dialog: MatDialog,
    private userService: UserService,
  ) { }
  canFinish = false;
  currencies: any[] = [];
  @Output() refreshStep = new EventEmitter();

  ngOnInit(): void {
  }

  async finish() {
    if (!this.canFinish) {
      this.snack.open('Please indicate that its fine to finish', undefined, { duration: 3400 })
      return;
    }
    var diagRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: `Are you sure you wanna finish?`,
        content: `You will save all changes as real transactions`
      }
    })

    diagRef.afterClosed().subscribe(async result => {
      if (result) {
        try {
          await this.transactionService.finishMigration().toPromise();
          this.router.navigate(['main']);
        }
        catch (error: any) {
          this.snack.open('Error: ' + error.msg);
        }
      }
    })

  }

  goPrevious() {
    this.userService.goToStep(2).subscribe();
    this.refreshStep.emit();
  }

}
