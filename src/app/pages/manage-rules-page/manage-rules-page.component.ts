import { Category } from './../../models/category';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService } from 'src/app/services/category.service';
import { RuleService } from 'src/app/services/rule.service';
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
  ruleSearchTerm = '';

  conditionalFields = [
    { id: 'sourceDescription', name: 'Descrição no extrato', type: 'string' },
    { id: 'sourceName', name: 'Nome da fonte', type: 'string' },
    { id: 'value', name: 'Valor', type: 'number' },
  ]
  operators = [
    { id: '==', name: 'é igual a', type: 'string' },
    { id: 'like', name: 'contém', type: 'string' },
    { id: 'not like', name: 'não contém', type: 'string' },
    { id: '!=', name: 'é diferente de', type: 'string' },
    { id: '>', name: 'é maior que', type: 'number' },
    { id: '<', name: 'é menor que', type: 'number' },
    { id: '==', name: 'é igual a', type: 'number' },
    { id: '!=', name: 'é diferente de', type: 'number' },
  ]

  async ngOnInit() {
    this.categories = (await this.categoryService.getMyCategories().toPromise()).sort((a, b) => a.name > b.name ? 1 : -1);
    await this.loadRules();
    this.selectedRule = this.rules[0];
  }

  get filteredRules() {
    const term = this.ruleSearchTerm.trim().toLowerCase();
    if (!term) {
      return this.rules;
    }
    return this.rules.filter(r => this.getRuleSearchText(r).includes(term));
  }

  get canReorder() {
    return !this.ruleSearchTerm.trim();
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

  getRuleActionLabel(rule: any): string {
    if (rule.field === 'category') {
      const name = this.getCategory(+rule.value)?.name;
      return name ? `Categoria = ${name}` : 'Categoria = …';
    }
    const desc = (rule.value ?? '').toString().trim();
    return desc ? `Descrição = ${desc}` : 'Descrição = …';
  }

  formatConditional(conditional: any): string {
    const hasField = !!conditional.field;
    const hasOperator = !!conditional.operator;
    const valueStr = conditional.value != null ? String(conditional.value).trim() : '';
    if (!hasField && !hasOperator && !valueStr) {
      return '(condição incompleta)';
    }
    const field = this.getConditionalField(conditional.field)?.name || conditional.field || '…';
    const fieldType = this.getConditionalField(conditional.field)?.type;
    const operator = this.operators.find(o => o.id === conditional.operator && o.type === fieldType)?.name
      || conditional.operator || '…';
    const quotedValue = valueStr ? `"${valueStr}"` : '""';
    return `${field} ${operator} ${quotedValue}`;
  }

  getRuleWhenSummary(rule: any): string {
    const conditionals = rule.Conditionals || [];
    if (!conditionals.length) {
      return 'Sem condições';
    }
    return conditionals.map((c: any) => this.formatConditional(c)).join(' OU ');
  }

  getRuleSearchText(rule: any): string {
    return [
      rule.orderNumber,
      this.getRuleActionLabel(rule),
      this.getRuleWhenSummary(rule),
      rule.field,
      rule.value,
    ].join(' ').toLowerCase();
  }

  selectRule(rule: any) {
    this.selectedRule = rule;
  }

  sameSelectValue = (a: any, b: any): boolean => {
    const normalize = (v: any) => (v === undefined || v === '' ? null : v);
    a = normalize(a);
    b = normalize(b);
    if (a == null && b == null) {
      return true;
    }
    if (a == null || b == null) {
      return false;
    }
    return String(a) === String(b);
  };

  async addRule() {
    const template = this.selectedRule || { field: 'description', value: '' };
    await this.ruleService.addRule({
      field: template.field,
      value: template.value ?? ''
    }).toPromise()
    await this.loadRules();
    this.selectRule(this.rules[this.rules.length - 1]);
  }

  async deleteRule() {
    const confirmDialog = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Excluir regra?',
        content: 'Esta regra não poderá ser recuperada após a exclusão.',
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
      this.statusMessage = 'Salvando…';
      await this.ruleService.updateRule({ [property]: this.selectedRule[property] }, this.selectedRule.id).toPromise()
      this.statusMessage = 'Alterações salvas.';
    }
    catch (reason) {
      this.statusMessage = '<span style="color: var(--danger);">Erro ao salvar.</span>';
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
      this.snack.open('Erro ao adicionar condição', undefined, { duration: 2500 })
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
      this.snack.open('Erro ao remover condição', undefined, { duration: 2500 })
    }
  }

  async saveConditionalProperty(conditional: any, property: string) {
    try {
      this.statusMessage = 'Salvando…';
      await this.ruleService.updateConditional({ [property]: conditional[property] }, conditional.id).toPromise()
      this.statusMessage = 'Alterações salvas.';
    }
    catch (reason) {
      this.statusMessage = '<span style="color: var(--danger);">Erro ao salvar.</span>';
    }
  }

  async drop(event: CdkDragDrop<any[]>) {
    try {
      this.statusMessage = 'Salvando ordem…';
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
      this.statusMessage = 'Ordem atualizada.';
    }
    catch (reason) {
      moveItemInArray(this.rules, event.currentIndex, event.previousIndex);
      this.statusMessage = '<span style="color: var(--danger);">Erro ao reordenar.</span>';
    }


  }

}
