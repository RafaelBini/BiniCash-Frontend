import { TransactionService } from './../../services/transaction.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-undo-migration',
  templateUrl: './undo-migration.component.html',
  styleUrls: ['./undo-migration.component.css']
})
export class UndoMigrationComponent implements OnInit {

  constructor(
    private transactionService: TransactionService
  ) { }

  migrations: any[] = [];
  sources: any[] = [];
  migrationOnHover = '';
  migrationSelected = '';


  async ngOnInit() {
    this.migrations = await this.transactionService.getMigrations().toPromise()
    const yesterday = new Date(new Date().getTime() - (1000 * 60 * 60 * 24));
    const today = new Date();
    this.migrations = this.migrations.map(m => {
      var readbleDate = `${new Date(m).toLocaleDateString('en-US')} ${new Date(m).toLocaleTimeString().substr(0, 5)}`;

      if (new Date(m).getDate() == today.getDate() && new Date(m).getMonth() == today.getMonth() && new Date(m).getFullYear() == today.getFullYear())
        readbleDate = `Today, ${new Date(m).toLocaleTimeString().substr(0, 5)}`
      else if (new Date(m).getDate() == yesterday.getDate() && new Date(m).getMonth() == yesterday.getMonth() && new Date(m).getFullYear() == yesterday.getFullYear())
        readbleDate = `Yesterday, ${new Date(m).toLocaleTimeString().substr(0, 5)}`

      return {
        date: new Date(new Date(m).getTime() + (1000 * 60)).toISOString().substr(0, 16) + 'Z',
        readbleDate
      }
    })
    this.migrations = this.migrations.filter(function (item, pos, self) {
      return self.findIndex(e => e.date == item.date) == pos;
    })
    this.select(this.migrations[0]);
  }

  onHover(migration: any) {

    this.migrationOnHover = migration.date;
  }

  onLeave() {
    this.migrationOnHover = this.migrationSelected;
  }

  async select(migration: any) {
    this.migrationSelected = migration.date;
    this.sources = await this.transactionService.getBalancesBySourceUntilDate(migration.date).toPromise()
    console.log(this.sources)
  }

}
