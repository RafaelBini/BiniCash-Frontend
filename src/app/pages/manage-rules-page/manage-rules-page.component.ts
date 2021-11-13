import { Category } from './../../models/category';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rule } from 'src/app/models/rule';
import { CategoryService } from 'src/app/services/category.service';
import { RuleService } from 'src/app/services/rule.service';
import { getLocaleExtraDayPeriodRules } from '@angular/common';
import { ConfirmDialogComponent } from 'src/app/dialogs/confirm-dialog/confirm-dialog.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-manage-rules-page',
  templateUrl: './manage-rules-page.component.html',
  styleUrls: ['./manage-rules-page.component.css']
})
export class ManageRulesPageComponent implements OnInit {

  constructor(
    private ruleService: RuleService,
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snack: MatSnackBar
  ) { }

  selectedRule: any;
  rules: any[] = [];
  categories: Category[] = [];
  statusMessage: string = '';

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
    this.selectedRule = this.rules[0];
    this.categories = (await this.categoryService.getMyCategories().toPromise()).sort((a, b) => a.name > b.name ? 1 : -1);
  }

  async loadRules() {
    this.rules = await this.ruleService.getMyRules().toPromise();
  }

  getOperatorsFromConditionalFieldId(conditionalFieldId: string) {
    const conditionalField = this.conditionalFields.find(cf => cf.id == conditionalFieldId);
    return this.operators.filter(o => o.type == conditionalField?.type)
  }

  getConditionalField(conditionalFieldId: string) {
    return this.conditionalFields.find(cf => cf.id == conditionalFieldId);
  }

  getCategory(categoryId: number) {
    return this.categories.find(c => c.id == categoryId);
  }

  selectRule(rule: any) {
    this.selectedRule = rule;
  }

  async addRule() {
    await this.ruleService.addRule({
      field: this.selectedRule.field,
      value: this.selectedRule.value
    }).toPromise()
    await this.loadRules();
    this.selectRule(this.rules[this.rules.length - 1]);
  }

  async deleteRule() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Delete rule?',
        content: 'You will not be able recover this rule after deleted',
        isDanger: true
      }
    })
    confirmDialog.afterClosed().subscribe(async result => {
      if (result) {
        await this.ruleService.deleteRule(this.selectedRule.id).toPromise()
        const orderedRules = this.rules.filter(r => r.id != this.selectedRule.id).map((rule, ruleIndex) => {
          return {
            ruleId: rule.id,
            orderNumber: ruleIndex + 1
          }
        })
        await this.ruleService.updateRulesOrder(orderedRules).toPromise();
        await this.loadRules();
        this.selectRule(this.rules[0]);
      }
    })
  }

  async saveRuleProperty(property: string) {
    try {
      this.statusMessage = 'saving changes...';
      await this.ruleService.updateRule({ [property]: this.selectedRule[property] }, this.selectedRule.id).toPromise()
      this.statusMessage = 'all changes were saved!';
    }
    catch (reason) {
      this.statusMessage = '<span style="color: var(--danger);">problem when saving changes.<span>';
    }

  }

  async addConditional() {
    try {
      const ruleId = this.selectedRule.id;
      await this.ruleService.addConditional(ruleId).toPromise();
      await this.loadRules();
      this.selectRule(this.rules.find(r => r.id == ruleId));
    }
    catch (reason) {
      this.snack.open('Problem when adding a new conditional', undefined, { duration: 2500 })
    }
  }

  async deleteConditional(conditionalId: number) {
    try {
      const ruleId = this.selectedRule.id;
      await this.ruleService.deleteConditional(conditionalId).toPromise();
      await this.loadRules();
      this.selectRule(this.rules.find(r => r.id == ruleId));
    }
    catch (reason) {
      this.snack.open('Problem when deleting the conditional', undefined, { duration: 2500 })
    }
  }

  async saveConditionalProperty(conditional: any, property: string) {
    try {
      this.statusMessage = 'saving changes...';
      await this.ruleService.updateConditional({ [property]: conditional[property] }, conditional.id).toPromise()
      this.statusMessage = 'all changes were saved!';
    }
    catch (reason) {
      this.statusMessage = '<span style="color: var(--danger);">problem when saving changes.<span>';
    }
  }

  async drop(event: CdkDragDrop<any[]>) {
    try {
      this.statusMessage = 'saving changes...';
      moveItemInArray(this.rules, event.previousIndex, event.currentIndex);
      const orderedRules = this.rules.map((rule, ruleIndex) => {
        return {
          ruleId: rule.id,
          orderNumber: ruleIndex + 1
        }
      })
      await this.ruleService.updateRulesOrder(orderedRules).toPromise();
      const ruleId = this.selectedRule.id;
      await this.loadRules();
      this.selectRule(this.rules.find(r => r.id == ruleId));
      this.statusMessage = 'all changes were saved!';
    }
    catch (reason) {
      moveItemInArray(this.rules, event.currentIndex, event.previousIndex);
      this.statusMessage = '<span style="color: var(--danger);">problem when saving changes.<span>';
    }


  }

}
