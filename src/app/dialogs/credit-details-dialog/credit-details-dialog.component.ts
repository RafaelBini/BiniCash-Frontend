import { Component, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { AnalyticsCreditRow, CreditService } from 'src/app/services/credit.service';

export interface CreditDetailsDialogData {
  month: string;
  symbol: string;
  credits: AnalyticsCreditRow[];
}

@Component({
  selector: 'app-credit-details-dialog',
  templateUrl: './credit-details-dialog.component.html',
  styleUrls: ['./credit-details-dialog.component.css']
})
export class CreditDetailsDialogComponent implements AfterViewInit {

  displayedColumns = ['creditDate', 'value', 'description', 'sourceDescription', 'actions'];
  dataSource = new MatTableDataSource<AnalyticsCreditRow>([]);
  private dataChanged = false;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreditDetailsDialogData,
    private dialogRef: MatDialogRef<CreditDetailsDialogComponent>,
    private dialog: MatDialog,
    private creditService: CreditService,
    private snack: MatSnackBar,
  ) {
    this.dataSource.data = [...data.credits];
    this.dataSource.sortingDataAccessor = (row, property) => {
      switch (property) {
        case 'creditDate':
          return new Date(row.creditDate).getTime();
        case 'value':
          return row.value;
        case 'description':
          return (row.description || '').toLowerCase();
        case 'sourceDescription':
          return (row.sourceDescription || '').toLowerCase();
        default:
          return '';
      }
    };
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  get total(): number {
    return this.dataSource.data.reduce((p, c) => p + c.value, 0);
  }

  close() {
    this.dialogRef.close(this.dataChanged);
  }

  markAsTransference(credit: AnalyticsCreditRow) {
    const diagRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Marcar como transferência',
        content: 'Este crédito deixará de aparecer nos ganhos do gráfico. Deseja continuar?',
        isDanger: true,
      },
    });

    diagRef.afterClosed().subscribe(async (confirmed) => {
      if (!confirmed) {
        return;
      }
      try {
        await this.creditService.markCreditAsTransference(credit.id).toPromise();
        this.dataSource.data = this.dataSource.data.filter(c => c.id !== credit.id);
        this.data.credits = this.data.credits.filter(c => c.id !== credit.id);
        this.dataChanged = true;
      } catch (error: any) {
        this.snack.open(error.error?.msg || 'Falha ao atualizar crédito', undefined, { duration: 3500 });
      }
    });
  }
}
