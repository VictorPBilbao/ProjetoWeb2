import { Component, LOCALE_ID } from '@angular/core';
import { Budget } from '../../shared/models/budget.model';
import { CommonModule, registerLocaleData } from '@angular/common';
import { BudgetService } from '../../services/budget/budget.service';
import { NotificationComponent } from '../../components/notification/notification.component';
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

  constructor(private budgetService: BudgetService) { }

  ngOnInit(): void {
    this.budgets = this.budgetService.getBudgets();
  }

  openBudget(index: number): void {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }
}
