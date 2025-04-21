import { Component, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { Budget } from '../../shared/models/budget.model';
import { BudgetService } from '../../services/budget/budget.service';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

@Component({
  selector: 'app-budget',
  imports: [
    CommonModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent {
  budgets: Budget[] = [];
  activeAccordion: number | null = null;
  modalVisible = false;

  constructor(private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.budgets = this.budgetService.getBudgets();
  }

  openBudget(index: number): void {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }

  approvalBudget(id: string): void {
    this.budgetService.approveBudget(id);
    this.closeModal();
  }

  rejectBudget(id: string): void {
    this.budgetService.rejectBudget(id);
    this.closeModal();
  }

  openModal() {
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;
  }
}
