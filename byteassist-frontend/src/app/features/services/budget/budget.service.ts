import { Injectable } from '@angular/core';
import { Budget } from '../../shared/models/budget.model';
import { LoadingService } from '../utils/loading.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor(private loadingService: LoadingService) { }

  getBudgets(): Budget[] {
    return [
      new Budget(
        't-01',
        'user-001',
        new Date('2025-04-08'),
        '10:25 PM',
        'Notebook',
        'Orçada',
        3000,
        'Substituição de placa-mãe, teclado e cooler.',
        'Limpeza interna completa e reinstalação do sistema operacional.',
        'Manutenção',
        'Manutenção preventiva e corretiva.',
        950, // budgetPartsValue
        550, // budgetLaborValue
        'Guilherme Arthur', // treasurerName
        'Adriano' // accountantName
      ),
      new Budget(
        't-02',
        'user-002',
        new Date('2025-04-10'),
        '03:15 PM',
        'Impressora',
        'Orçada',
        1250,
        'Troca de cartucho, correia de tração e ajuste de roletes.',
        'Teste de impressão, alinhamento e limpeza externa.',
        'Manutenção',
        'Serviço de calibração e troca de consumíveis.',
        500, // budgetPartsValue
        450, // budgetLaborValue
        'Henrique Dias', // treasurerName
        'Carla' // accountantName
      ),
      new Budget(
        't-03',
        'user-003',
        new Date('2025-04-12'),
        '09:40 AM',
        'Servidor',
        'Orçada',
        7850,
        'Atualização de SSDs, expansão de memória e troca da fonte.',
        'Backup completo, configuração de RAID e testes de desempenho.',
        'Upgrade',
        'Atualização de hardware com otimização de performance.',
        5000, // budgetPartsValue
        1650, // budgetLaborValue
        'Juliana Ramos', // treasurerName
        'Bruno' // accountantName
      )
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
}
