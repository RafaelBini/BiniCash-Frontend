import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreditService, PassiveIncomeKeyword } from 'src/app/services/credit.service';

@Component({
  selector: 'app-passive-income-keywords-dialog',
  templateUrl: './passive-income-keywords-dialog.component.html',
  styleUrls: ['./passive-income-keywords-dialog.component.css']
})
export class PassiveIncomeKeywordsDialogComponent implements OnInit {

  keywords: PassiveIncomeKeyword[] = [];
  newKeyword = '';
  isLoading = false;

  constructor(
    private creditService: CreditService,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<PassiveIncomeKeywordsDialogComponent>,
  ) { }

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.isLoading = true;
    try {
      this.keywords = await this.creditService.getPassiveIncomeKeywords().toPromise();
    } catch {
      this.snack.open('Falha ao carregar palavras-chave', undefined, { duration: 3500 });
    } finally {
      this.isLoading = false;
    }
  }

  async addKeyword() {
    const keyword = this.newKeyword.trim();
    if (!keyword) {
      return;
    }
    try {
      const created = await this.creditService.createPassiveIncomeKeyword(keyword).toPromise();
      this.keywords = [...this.keywords, created].sort((a, b) => a.keyword.localeCompare(b.keyword));
      this.newKeyword = '';
    } catch (error: any) {
      this.snack.open(error.error?.msg || 'Falha ao adicionar', undefined, { duration: 3500 });
    }
  }

  async saveKeyword(row: PassiveIncomeKeyword) {
    const keyword = row.keyword.trim();
    if (!keyword) {
      return;
    }
    try {
      await this.creditService.updatePassiveIncomeKeyword(row.id, keyword).toPromise();
    } catch (error: any) {
      this.snack.open(error.error?.msg || 'Falha ao salvar', undefined, { duration: 3500 });
      await this.load();
    }
  }

  async deleteKeyword(row: PassiveIncomeKeyword) {
    try {
      await this.creditService.deletePassiveIncomeKeyword(row.id).toPromise();
      this.keywords = this.keywords.filter(k => k.id !== row.id);
    } catch {
      this.snack.open('Falha ao remover', undefined, { duration: 3500 });
    }
  }

  close() {
    this.dialogRef.close(true);
  }
}
