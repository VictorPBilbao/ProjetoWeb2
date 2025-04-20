import { Injectable } from '@angular/core';
import { Budget } from '../../shared/models/budget.model';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  constructor() { }

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
        'Manutenção preventiva e corretiva.',
        'Peças: R$950 | Pessoal: R$500 | Mão de Obra: R$550 | Contador: Adriano | Tesoureiro: Guilherme Arthur'
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
        'Serviço de calibração e troca de consumíveis.',
        'Peças: R$500 | Pessoal: R$300 | Mão de Obra: R$450 | Contador: Carla | Tesoureiro: Henrique Dias'
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
        'Atualização de hardware com otimização de performance.',
        'Peças: R$5000 | Pessoal: R$1200 | Mão de Obra: R$1650 | Contador: Bruno | Tesoureiro: Juliana Ramos'
      )
    ];
  }

}
