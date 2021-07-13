import { Component, OnInit } from '@angular/core';
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
  ) { }

  ngOnInit(): void {
  }

  goPrevious() {
    this.userService.goToStep(1).subscribe();
  }

  goNext() {
    this.userService.goToStep(3).subscribe();
  }


}
