import { EditStagedTransactionsDialogComponent } from './../../../edit-staged-transactions-dialog/edit-staged-transactions-dialog.component';
import { NewManualDebitsDialogComponent } from './../../../dialogs/new-manual-debits-dialog/new-manual-debits-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from './../../../services/user.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SourceService } from './../../../services/source.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { StagedTransactionService } from 'src/app/services/staged-transaction.service';

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


  openManualDebitDialog(source: any) {
    var diagRef = this.dialog.open(NewManualDebitsDialogComponent, {
      data: source
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
