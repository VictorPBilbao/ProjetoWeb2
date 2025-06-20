import { Injectable } from '@angular/core';
import { Budget } from '../../shared/models/budget.model';
import { LoadingService } from '../utils/loading.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private readonly loadingService: LoadingService) { }
  getBudgets(): Budget[] {
    return [
      {
        id: 't-01',
        accepted: false,
        amount: 3000,
        creator: 'user-001',
        description: 'Orçamento para conserto completo do notebook, incluindo peças e mão de obra.'
      },
      {
        id: 't-02',
        accepted: false,
        amount: 1250,
        creator: 'user-002',
        description: 'Orçamento para manutenção e calibração da impressora.'
      },
      {
        id: 't-03',
        accepted: false,
        amount: 7850,
        creator: 'user-003',
        description: 'Orçamento para upgrade de componentes críticos do servidor.'
      }
    ];
  }

  approveBudget(budgetId: string): Promise<void> {

    this.loadingService.show(); // Exibe o loading

    return new Promise((resolve) => {
      setTimeout(() => {
        this.loadingService.hide(); // Esconde o loading após a requisição
        // Logic to approve the budget goes here
        console.log(`Budget with ID ${budgetId} approved.`);
        resolve(); // Resolve a Promise após a lógica de aprovação
      }, 2000);
    });
  }

  rejectBudget(budgetId: string): Promise<void> {
    this.loadingService.show(); // Exibe o loading

    return new Promise((resolve) => {
      setTimeout(() => {
        this.loadingService.hide(); // Esconde o loading após a requisição
        // Logic to reject the budget goes here
        console.log(`Budget with ID ${budgetId} rejected.`);
        resolve();
      }, 2000);
    });
  }

  budgetingRequest(budgetId: string): Promise<void> {
    this.loadingService.show(); // Exibe o loading

    return new Promise((resolve) => {
      setTimeout(() => {
        this.loadingService.hide(); // Esconde o loading após a requisição
        // Logic to request the budget goes here
        console.log(`Budget with ID ${budgetId} budgeted.`);
        resolve();
      }, 2000);
    });
  }
}
