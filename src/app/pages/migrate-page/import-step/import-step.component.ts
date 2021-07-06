import { SourceService } from './../../../services/source.service';
import { Component, OnInit } from '@angular/core';
import { StagedTransactionService } from 'src/app/services/staged-transaction.service';

@Component({
  selector: 'app-import-step',
  templateUrl: './import-step.component.html',
  styleUrls: ['./import-step.component.css']
})
export class ImportStepComponent implements OnInit {

  constructor(
    private stagedTransactionService: StagedTransactionService
  ) { }

  sources: any[] = [];

  async ngOnInit() {
    this.sources = await this.stagedTransactionService.getStagedBlancesBySource().toPromise()
  }



}
