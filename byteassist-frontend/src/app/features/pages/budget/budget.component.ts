import { Component, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Budget } from '../../shared/models/budget.model';
import { BudgetService } from '../../services/budget/budget.service';
import { NotificationComponent } from '../../components/notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

@Component({
  selector: 'app-budget',
  imports: [
    CommonModule,
    NotificationComponent,
    FormsModule
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
  selectedBudget: Budget | null = null;
  message: string = '';
  showNotification: boolean = false;
  rejectDescription: string = '';
  constructor(
    private readonly budgetService: BudgetService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.budgets = this.budgetService.getBudgets();
  }

  openBudget(index: number): void {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }

  async approvalBudget(id: string): Promise<void> {
    this.selectedBudget = this.budgets.find(budget => budget.id === id) || null;
    if (!this.selectedBudget) {
      this.message = 'Erro ao encontrar o orçamento selecionado.';
      this.showNotification = true;
      return;
    }

    this.selectedBudget.accepted = true;
    console.log('Chamando approveBudget...');
    await this.budgetService.approveBudget(id);
    console.log('approveBudget finalizado, abrindo modal');
    this.openModal();
  }

  async rejectBudget(id?: string): Promise<void> {
    if (!this.selectedBudget || !id) {
      this.message = 'Erro ao encontrar o orçamento selecionado.';
      this.showNotification = true;
      return;
    }

    await this.budgetService.rejectBudget(id);
    this.selectedBudget.accepted = false;
    this.closeModal();
  }

  openRejectBudgetModal(id: string): void {
    this.selectedBudget = this.budgets.find(budget => budget.id === id) || null;
    this.rejectDescription = '';
    this.openModal();
  }

  openModal() {
    this.modalVisible = true;
    console.log('Modal opened');
  }

  closeModal() {
    this.modalVisible = false;
  }
}
