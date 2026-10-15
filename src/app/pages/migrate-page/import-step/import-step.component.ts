import { ExportInvestmentsDialogComponent } from './../../../dialogs/export-investments-dialog/export-investments-dialog.component';
import { EditStagedTransactionsDialogComponent } from './../../../edit-staged-transactions-dialog/edit-staged-transactions-dialog.component';
import { NewManualDebitsDialogComponent } from './../../../dialogs/new-manual-debits-dialog/new-manual-debits-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SourceService } from './../../../services/source.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StagedTransactionService } from 'src/app/services/staged-transaction.service';
import { BalanceComparisonDialogComponent } from 'src/app/dialogs/balance-comparison-dialog/balance-comparison-dialog.component';

@Component({
  selector: 'app-import-step',
  templateUrl: './import-step.component.html',
  styleUrls: ['./import-step.component.css']
})
export class ImportStepComponent implements OnInit {

  constructor(
    private stagedTransactionService: StagedTransactionService,
    private userService: UserService,
    private snack: MatSnackBar,
    private dialog: MatDialog,
  ) { }

  sources: any[] = [];
  loadingApiSources: { [sourceId: number]: boolean } = {};
  canGoCheckbox: boolean = false;
  @Output() updateData = new EventEmitter();

  async ngOnInit() {

  }
  goNextStep() {
    this.userService.goToStep(1).subscribe();
  }

  async updateSources() {
    this.updateData.emit()
    this.canGoCheckbox = false;
  }

  async uploadFile(event: any, source: any, input: any) {


    if (source.type == 'OFX') {
      var files = event.target.files as File[];
      for (let file of files) {
        var reader = new FileReader();
        reader.onload = async (e: any) => {
          const rawContent = e.target.result;
          console.log(rawContent)
          input.value = "";
          this.stagedTransactionService.insertOfx(rawContent, source).subscribe(result => {
            this.updateSources()
          },
            error => {
              this.snack.open(error.error.msg, undefined, { duration: 3500 });
            })
        }
        reader.readAsText(file, 'us-ascii');

      }
    }
    else if (source.type == 'CSV') {
      var files = event.target.files as File[];
      for (let file of files) {
        const rawContent = await file.text();
        input.value = "";
        this.stagedTransactionService.insertCsv(rawContent, source).subscribe(result => {
          this.updateSources()
        },
          error => {
            this.snack.open(error.error.msg, undefined, { duration: 3500 });
          })
      }
    }

  }

  async loadApi(source: any, event: Event) {
    event.stopPropagation();
    if (this.loadingApiSources[source.id]) return;

    this.loadingApiSources[source.id] = true;
    try {
      const response: any = await this.stagedTransactionService.importPluggyTransactions(source.id).toPromise();
      const result = response.payload;
      await this.updateSources();

      if (Math.abs(Number(result.difference)) <= 0.01) {
        this.snack.open('Dados importados com sucesso e os saldos estão batendo.', undefined, {
          duration: 5000,
          panelClass: ['success-snackbar']
        });
      } else {
        this.dialog.open(BalanceComparisonDialogComponent, {
          data: {
            sourceName: source.name,
            symbol: source.symbol,
            systemBalance: result.systemBalance,
            apiBalance: result.apiBalance,
            difference: result.difference,
            importedCount: result.importedCount
          },
          width: '440px'
        });
      }
    } catch (error: any) {
      this.snack.open(error?.error?.msg || 'Falha ao importar transações da Pluggy.', undefined, { duration: 4000 });
    } finally {
      this.loadingApiSources[source.id] = false;
    }
  }


  openManualExportInvest(source: any) {
    var diagRef = this.dialog.open(ExportInvestmentsDialogComponent, {
      data: { selectedSource: source, sources: this.sources.filter(s => s.symbol == source.symbol && s.id != source.id) },
      height: '92%',
      width: '92%'
    });
    diagRef.afterClosed().subscribe(() => {
      this.updateSources();
    })
  }

  openEditStagedTransactionsDialog(source: any) {
    var diagRef = this.dialog.open(EditStagedTransactionsDialogComponent, {
      data: source,
      height: '92%',
      width: '92%'
    });
    diagRef.afterClosed().subscribe(() => {
      this.updateSources();
    })
  }

}
