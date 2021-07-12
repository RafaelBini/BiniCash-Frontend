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
    private snack: MatSnackBar
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
      console.log(source)
      var files = event.target.files as File[];
      for (let file of files) {
        const rawContent = await file.text();
        input.value = "";
        this.stagedTransactionService.insertOfx(rawContent, source).subscribe(result => {
          this.updateSources()
        },
          error => {
            this.snack.open(error.error.msg, undefined, { duration: 3500 });
          })
      }

    }
  }

  async undo(source: any) {
    this.stagedTransactionService.deleteBySource(source.id).subscribe(result => {
      console.log(result)
      this.updateSources();
    },
      error => {
        this.snack.open(error.error.msg, undefined, { duration: 3500 });
      })
  }

}
