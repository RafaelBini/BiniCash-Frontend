import { CategoryService } from './../../services/category.service';
import { ConfirmDialogComponent } from './../confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RuleService } from './../../services/rule.service';
import { Component, Inject, OnInit } from '@angular/core';

@Component({
  selector: 'app-manage-rules-dialog',
  templateUrl: './manage-rules-dialog.component.html',
  styleUrls: ['./manage-rules-dialog.component.css']
})
export class ManageRulesDialogComponent implements OnInit {

  constructor(
    private ruleService: RuleService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ManageRulesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snack: MatSnackBar
  ) { }

  rules: any[] = [];
  selectedRule: any = undefined;
  selectedRuleId: any = undefined;
  categories: any[] = [];
  inputbleFields = [
    'category',
    'description'
  ]
  conditionalFields = [
    { id: 'sourceDescription', name: 'source description', type: 'string' },
    { id: 'sourceName', name: 'source name', type: 'string' },
    { id: 'value', name: 'value', type: 'number' },
  ]
  operators = [
    { id: '==', name: 'is equals to', type: 'string' },
    { id: 'like', name: 'includes', type: 'string' },
    { id: 'not like', name: 'do not includes', type: 'string' },
    { id: '!=', name: 'is not equals to', type: 'string' },
    { id: '>', name: 'is greater than', type: 'number' },
    { id: '<', name: 'is less than', type: 'number' },
    { id: '==', name: 'is equals to', type: 'number' },
    { id: '!=', name: 'is not equals to', type: 'number' },
  ]

  async ngOnInit() {
    await this.loadRules();
    await this.loadCategories();
  }

  async loadRules() {
    this.rules = await this.ruleService.getMyRules().toPromise();
    this.rules = this.rules;
    if (this.rules.length > 0) {
      this.selectedRuleId = this.rules[0].id;
      this.selectedRule = this.rules[0];
    }
  }

  async loadCategories() {
    this.categories = await this.categoryService.getMyCategories().toPromise();
  }

  getCategoryById(categoryId: number) {
    if (this.categories.length > 0)
      return this.categories.find(c => c.id == categoryId);
    return { name: '...' }
  }

  getOperatorsFromConditionalFieldId(conditionalFieldId: any) {
    const conditionalField = this.conditionalFields.find(cf => cf.id == conditionalFieldId);
    return this.operators.filter(o => o.type == conditionalField?.type)
  }

  updateSelectedRule() {
    this.selectedRule = this.rules.find(r => r.id == this.selectedRuleId);
  }

  setToUpdate(ruleOrConditional: any) {
    if (ruleOrConditional.action != 'insert')
      ruleOrConditional.action = 'update'
    this.dialogRef.disableClose = true;
  }

  addRule() {
    const FAKE_ID = (this.getNotDeletedRules().length * -1);
    this.rules.push({
      id: FAKE_ID,
      field: '',
      value: '',
      orderNumber: this.getNotDeletedRules().length + 1,
      Conditionals: [
        { field: '', value: '', operator: '', action: 'insert' }
      ],
      action: 'insert'
    });
    this.selectedRuleId = FAKE_ID;
    this.selectedRule = this.rules.find(r => r.id == this.selectedRuleId);
    this.dialogRef.disableClose = true;
  }

  addConditional() {
    this.selectedRule.Conditionals.push({
      field: '',
      operator: '',
      value: '',
      action: 'insert'
    })
    this.dialogRef.disableClose = true;
  }


  async save() {
    try {
      var result = await this.ruleService.saveRulesChanges(this.rules).toPromise();
      this.snack.open('All changes saved!', undefined, { duration: 3500 });
      this.dialogRef.disableClose = false;
    }
    catch (error) {
      this.snack.open('Failed when saving', undefined, { duration: 3500 });
    }
  }

  async deleteRule() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete rule?',
        content: 'You will not be able recover this rule after deleted',
        isDanger: true
      }
    })
    confirmDialog.afterClosed().subscribe(result => {
      if (result) {
        this.selectedRule.action = 'delete';
        this.selectedRuleId = this.rules[0].id;
        this.selectedRule = this.rules[0]
        this.dialogRef.disableClose = true;
      }
    })

  }

  deleteConditional(conditional: any) {
    conditional.action = 'delete';
    this.dialogRef.disableClose = true;
  }

  getNotDeletedRules() {
    return this.rules.filter(r => r.action != 'delete').sort((a, b) => a.orderNumber - b.orderNumber)
  }

  getNotDeletedConditionals(conditionals: any[]) {
    return conditionals.filter(r => r.action != 'delete');
  }


}
