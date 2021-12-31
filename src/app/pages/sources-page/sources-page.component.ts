import { EditSourceDialogComponent } from './../../dialogs/edit-source-dialog/edit-source-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { SourceService } from 'src/app/services/source.service';
import { Component, OnInit } from '@angular/core';
import { TransactionService } from 'src/app/services/transaction.service';

@Component({
  selector: 'app-sources-page',
  templateUrl: './sources-page.component.html',
  styleUrls: ['./sources-page.component.css']
})
export class SourcesPageComponent implements OnInit {

  constructor(
    private transactionService: TransactionService,
    private dialog: MatDialog
  ) { }

  sources: any[] = [];

  ngOnInit(): void {
    this.loadSources();
  }

  loadSources() {
    this.transactionService.getBalancesBySources().subscribe(sources => {
      this.sources = sources.sort((a, b) => a.name > b.name ? 1 : -1);
    })
  }

  edit(sourceId: number) {
    var ref = this.dialog.open(EditSourceDialogComponent, {
      data: sourceId
    });
    ref.afterClosed().subscribe(() => {
      this.loadSources();
    })
  }

  add() {
    var ref = this.dialog.open(EditSourceDialogComponent, {
      data: undefined
    });
    ref.afterClosed().subscribe(() => {
      this.loadSources();
    })
  }

}
