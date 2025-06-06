import { Injectable } from '@angular/core';
import { Budget } from '../../shared/models/budget.model';
import { EquipmenteParts } from '../../shared/models/equipmentParts.model';
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
        '22:25',
        'Notebook',
        'Dell',
        'Orçada',
        'Computador portátil',
        3000,
        'Substituição de placa-mãe, teclado e cooler.',
        'Limpeza interna completa e reinstalação do sistema operacional.',
        'Manutenção',
        'Manutenção preventiva e corretiva.',
        950,   // budgetPartsValue
        550,   // budgetLaborValue
        'Guilherme Arthur',
        'Adriano',
        '',    // rejectDescription
        'Superaquecimento frequente e falha na inicialização.',
        'Orçamento para conserto completo do notebook, incluindo peças e mão de obra.',
        [
          new EquipmenteParts(
            'p-01',
            'Placa-mãe Dell Inspiron',
            'Dell',
            'DP/N 0XJ3MP',
            'SN123456',
            'Placa-mãe compatível com socket PGA988B',
            600,
            1,
            600
          ),
          new EquipmenteParts(
            'p-02',
            'Teclado ABNT2',
            'Multilaser',
            'KB257',
            'SN654321',
            'Teclado padrão brasileiro, com layout ABNT2',
            150,
            1,
            150
          ),
          new EquipmenteParts(
            'p-03',
            'Cooler 75mm',
            'HP',
            'CPU Fan 501',
            'SN789012',
            'Cooler de reposição para processador Intel',
            200,
            1,
            200
          )
        ],
        'Carlos Eduardo', // clientName
        'Rafael Souza',   // technicalName
        120,              // technicalHourValue
        5                 // fees (% de taxa administrativa)
      ),

      new Budget(
        't-02',
        'user-002',
        new Date('2025-04-10'),
        '15:15',
        'Impressora',
        'HP',
        'Orçada',
        'Impressora jato de tinta',
        1250,
        'Troca de cartucho, correia de tração e ajuste de roletes.',
        'Teste de impressão, alinhamento e limpeza externa.',
        'Manutenção',
        'Serviço de calibração e troca de consumíveis.',
        500,   // budgetPartsValue
        450,   // budgetLaborValue
        'Henrique Dias',
        'Carla',
        '',    // rejectDescription
        'Manchas e falhas na impressão recorrentes.',
        'Orçamento para manutenção e calibração da impressora.',
        [
          new EquipmenteParts(
            'p-04',
            'Cartucho Preto HP 61',
            'HP',
            'HP61XL',
            'SN321654',
            'Cartucho de alto rendimento preto',
            120,
            1,
            120
          ),
          new EquipmenteParts(
            'p-05',
            'Correia de Tração',
            'Genérico',
            'TR-112',
            'SN987654',
            'Correia de tração compatível com HP DeskJet',
            200,
            1,
            200
          ),
          new EquipmenteParts(
            'p-06',
            'Roletes de Alimentação',
            'Brother',
            'RL-301',
            'SN456789',
            'Conjunto de roletes de alimentação de papel',
            180,
            1,
            180
          )
        ],
        'Mariana Silva',  // clientName
        'Beatriz Lima',   // technicalName
        100,              // technicalHourValue
        5                 // fees (%)
      ),

      new Budget(
        't-03',
        'user-003',
        new Date('2025-04-12'),
        '09:40',
        'Servidor',
        'Dell EMC',
        'Orçada',
        'Servidor rack 1U',
        7850,
        'Atualização de SSDs, expansão de memória e troca da fonte.',
        'Backup completo, configuração de RAID e testes de desempenho.',
        'Upgrade',
        'Atualização de hardware com otimização de performance.',
        5000,  // budgetPartsValue
        1650,  // budgetLaborValue
        'Juliana Ramos',
        'Bruno',
        '',    // rejectDescription
        'Desempenho insuficiente para carga de trabalho e espaço de armazenamento limitado.',
        'Orçamento para upgrade de componentes críticos do servidor.',
        [
          new EquipmenteParts(
            'p-07',
            'SSD 1TB NVMe',
            'Samsung',
            '970 EVO Plus',
            'SN112233',
            'SSD NVMe de alta performance',
            1200,
            1,
            1200
          ),
          new EquipmenteParts(
            'p-08',
            'Memória DDR4 32GB',
            'Kingston',
            'KVR26R19D4/32',
            'SN445566',
            'Módulo de memória DDR4 2666MHz',
            800,
            2,
            1600
          ),
          new EquipmenteParts(
            'p-09',
            'Fonte 550W Redundante',
            'Corsair',
            'RM550x',
            'SN778899',
            'Fonte modular de alta eficiência',
            1200,
            1,
            1200
          )
        ],
        'Lucas Pereira',  // clientName
        'Thiago Costa',   // technicalName
        150,              // technicalHourValue
        7                 // fees (%)
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
