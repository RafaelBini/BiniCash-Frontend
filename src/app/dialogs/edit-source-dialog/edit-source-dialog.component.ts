import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { SourceService } from 'src/app/services/source.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyService } from 'src/app/services/currency.service';
import { NewCurrencyComponent } from '../new-currency/new-currency.component';

@Component({
  selector: 'app-edit-source-dialog',
  templateUrl: './edit-source-dialog.component.html',
  styleUrls: ['./edit-source-dialog.component.css']
})
export class EditSourceDialogComponent implements OnInit {

  constructor(
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<EditSourceDialogComponent>,
    private currencyService: CurrencyService,
    private sourceService: SourceService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public sourceId: number,
  ) { }

  source: any;
  currencies: any;

  ngOnInit(): void {

    this.currencyService.getMyCurrencies().subscribe(currencies => {
      this.currencies = currencies;

      if (this.sourceId) {
        this.sourceService.getSource(this.sourceId).subscribe(sources => {
          console.log(sources)
          this.source = sources[0];
        })
      }
      else {
        this.source = {
          name: "",
          imageUrl: "https://png.pngtree.com/png-vector/20190227/ourmid/pngtree-vector-bank-icon-png-image_708538.jpg",
          type: "CSV",
          currencyId: this.currencies[0].id
        }
      }

    })



  }

  save() {
    if (this.sourceId) this.sourceService.updateSource(this.source).toPromise();
  }

  create() {
    if (!this.source.name) {
      this.snack.open("Missing name");
      return;
    }

    this.sourceService.create(this.source).toPromise().then(() => {
      this.dialogRef.close();
    });

  }

  openNewCurrencyDialog() {
    var newCurrenyDiag = this.dialog.open(NewCurrencyComponent, {
      data: this.currencies
    })
    newCurrenyDiag.afterClosed().subscribe(result => {
      if (result) {
        this.currencyService.getMyCurrencies().subscribe(currencies => {
          this.currencies = currencies;
        })
      }
    })
  }

  inactivate() {
    var ref = this.dialog.open(ConfirmDialogComponent, {
      data: {
        isDanger: true,
        title: "Are you sure?",
        content: `Inactivating source ${this.source.name}`
      }
    })
    ref.afterClosed().subscribe(result => {
      if (result) {
        this.sourceService.inativate(this.sourceId).toPromise().then(() => {
          this.dialogRef.close();
        });
      }

    })

  }

}
