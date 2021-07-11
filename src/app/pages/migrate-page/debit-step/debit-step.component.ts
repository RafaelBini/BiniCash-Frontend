import { UserService } from 'src/app/services/user.service';
import { StagedTransactionService } from './../../../services/staged-transaction.service';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
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
  ) {
    this.debits = new MatTableDataSource([]);
  }
  @ViewChild(MatSort) sort: any;
  debits: any;

  displayedColumns = ['description', 'value', 'transactionDate', 'sourceDescription', 'sourceName'];

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.debits.sort = this.sort;
  }

  goPrevious() {
    this.userService.goToStep(0).subscribe();
  }

  updateDescription(debit: any) {
    this.stagedTransactionService.update({ id: debit.id, description: debit.description }).subscribe()
  }

}
