import { Component, LOCALE_ID } from '@angular/core';
import { Budget } from '../../shared/models/budget.model';
import { CommonModule, registerLocaleData } from '@angular/common';
import { BudgetService } from '../../services/budget/budget.service';
import { NotificationComponent } from '../../components/notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

@Component({
  selector: 'app-budgeting',
  imports: [
    NotificationComponent,
    CommonModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  templateUrl: './budgeting.component.html',
  styleUrl: './budgeting.component.css'
})
export class BudgetingComponent {
  budgets: Budget[] = [];
  activeAccordion: number | null = null;
  modalVisible = false;
  selectedBudget: Budget | null = null;
  message: string = '';
  showNotification: boolean = false;

  constructor(
    private budgetService: BudgetService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    this.budgets = this.budgetService.getBudgets();
  }

  openBudget(index: number): void {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }

  async budgetingRequest(id: string): Promise<void> {
    this.selectedBudget = this.budgets.find(budget => budget.id === id) || null;
    if (!this.selectedBudget) {
      this.message = 'Erro ao encontrar o orçamento selecionado.';
      this.showNotification = true;
      return;
    }

    this.selectedBudget.status = "Orçada";
    console.log('Chamando approveBudget...');
    await this.budgetService.approveBudget(id);
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
