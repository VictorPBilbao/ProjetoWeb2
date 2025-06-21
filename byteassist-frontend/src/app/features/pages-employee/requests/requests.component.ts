import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Task } from '../../shared/models/task.model';
import { TaskService } from '../../services/task/task.service';
import { RecordidService } from '../../services/utils/recordid.service';
import { Equipment } from '../../shared/models/equipment.model';
import { RecordIdPipe } from '../../shared/pipes/record-id.pipe';
import { EquipmentFieldPipe } from '../../shared/pipes/equipment-field.pipe';


@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule, RecordIdPipe, EquipmentFieldPipe],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  public readonly recordIdService = inject(RecordidService);


  // Paginação
  paginaAtual: number = 1;
  itensPorPagina: number = 5;
  totalPaginas: number = 0;

  // Dados
  solicitacoes: Task[] = [];
  solicitacoesFiltradas: Task[] = [];
  solicitacoesPorPagina: Task[] = [];
  allSolicitacoes: Task[] = [];
  mySolicitacoes: Task[] = [];

  // Filtros
  filtroEstado: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  tipoFiltroData: 'HOJE' | 'PERIODO' | 'TODAS' = 'TODAS';
  estadosDisponiveis: string[] = [];

  // AQUI É A MUDANÇA PRINCIPAL:
  // Definindo todos os status possíveis explicitamente
  readonly TODOS_OS_STATUS: string[] = [
    'ABERTA',
    'ORÇADA',
    'REJEITADA',
    'APROVADA',
    'REDIRECIONADA',
    'ARRUMADA',
    'PAGA',
    'FINALIZADA'
  ].sort(); // Opcional: ordenar alfabeticamente para exibição


  mostrarMinhasTarefas: boolean = true; // Por padrão, mostra as minhas tarefas

  constructor(
    private taskService: TaskService, //pega as tasks de quem ta logado
    private router: Router
  ) { }

  // ngOnInit(): void {
  //   this.taskService.getAllMyTasks('assignee', undefined, ['equipment'])
  //     .subscribe({
  //       next: (tasks) => {
  //         console.log('📦 Dados recebidos da API:', tasks);
  //         this.solicitacoes = tasks;
  //         this.filtrarSolicitacoes();
  //       },
  //       error: (err) => console.error('Erro ao carregar solicitações:', err)
  //     });
  // }

  ngOnInit(): void {
    this.estadosDisponiveis = [...this.TODOS_OS_STATUS];
    // 1. Carrega as minhas tarefas
    this.taskService.getAllMyTasks('assignee', undefined, ['equipment'])
      .subscribe({
        next: (tasks) => {
          console.log('📦 Minhas tarefas recebidas da API:', tasks);
          this.mySolicitacoes = tasks;
          // Se estiver mostrando minhas tarefas por padrão, atualiza a lista principal
          if (this.mostrarMinhasTarefas) {
            this.solicitacoes = [...this.mySolicitacoes]; // Copia para a lista ativa
            //this.atualizarEstadosDisponiveis();
            this.filtrarSolicitacoes();
          }
        },
        error: (err) => console.error('Erro ao carregar minhas solicitações:', err)
      });

    // 2. Carrega TODAS as tarefas
    this.taskService.getAllTasks(undefined, ['equipment']) // Chamada para o novo método
      .subscribe({
        next: (tasks) => {
          console.log('🌍 Todas as tarefas recebidas da API:', tasks);
          this.allSolicitacoes = tasks;
          // Se não estiver mostrando minhas tarefas por padrão, atualiza a lista principal com todas
          if (!this.mostrarMinhasTarefas) {
            this.solicitacoes = [...this.allSolicitacoes]; // Copia para a lista ativa
            this.filtrarSolicitacoes();
          }
        },
        error: (err) => console.error('Erro ao carregar todas as solicitações:', err)
      });
  }

  atualizarEstadosDisponiveis(): void {
    const todosOsEstados = new Set<string>();
    // Percorre todas as tarefas da lista ATIVA para pegar os estados
    this.solicitacoes.forEach(task => {
      if (task.status) {
        todosOsEstados.add(task.status.trim().toUpperCase());
      }
    });
    // Converte o Set para Array e ordena (opcional, mas bom para exibição)
    this.estadosDisponiveis = Array.from(todosOsEstados).sort();
  }

  // Método para alternar entre "Minhas Tarefas" e "Todas as Tarefas"
  toggleTaskList(): void {
    this.mostrarMinhasTarefas = !this.mostrarMinhasTarefas;
    if (this.mostrarMinhasTarefas) {
      this.solicitacoes = [...this.mySolicitacoes];
      console.log('Exibindo minhas tarefas.');
    } else {
      this.solicitacoes = [...this.allSolicitacoes];
      console.log('Exibindo todas as tarefas.');
    }
    // Reinicia a paginação e aplica os filtros à nova lista
    this.paginaAtual = 1;
    this.filtrarSolicitacoes();
  }


  filtrarSolicitacoes(): void {
    this.solicitacoesFiltradas = this.solicitacoes.filter(s => {
      // 1. Obter a data de criação da task e normalizá-la para o início do dia UTC
      // Isso garante que não haja problemas com fusos horários ao comparar as datas
      const createdAtDateObj = new Date(s.time?.createdAt || '');
      // Normaliza para o início do dia UTC para comparação apenas da data (ignora o horário exato)
      // Usamos getTime() para ter um valor numérico para comparação
      const dataCriacaoTimestampUTC = Date.UTC(
        createdAtDateObj.getUTCFullYear(),
        createdAtDateObj.getUTCMonth(),
        createdAtDateObj.getUTCDate()
      );

      // Filtro de Estado
      const estadoValido = !this.filtroEstado || (s.status && s.status.toUpperCase() === this.filtroEstado.toUpperCase());

      // Filtro de Data
      let dataValida = true;

      switch (this.tipoFiltroData) {
        case 'HOJE':
          const hoje = new Date();
          // Normaliza "hoje" para o início do dia UTC para comparação
          const hojeTimestampUTC = Date.UTC(
            hoje.getFullYear(), // Pega o ano local para o "hoje" que o usuário vê
            hoje.getMonth(),   // Pega o mês local
            hoje.getDate()     // Pega o dia local
          );
          dataValida = dataCriacaoTimestampUTC === hojeTimestampUTC;
          break;

        case 'PERIODO':
          let inicioPeriodoTimestampUTC: number | null = null;
          let fimPeriodoTimestampUTC: number | null = null;

          if (this.filtroDataInicio) {
            // Split da string YYYY-MM-DD para construir a data no fuso horário local
            const partsInicio = this.filtroDataInicio.split('-').map(Number);
            // new Date(year, monthIndex, day) - monthIndex é 0-based
            const dataInputInicio = new Date(partsInicio[0], partsInicio[1] - 1, partsInicio[2]);

            // Normaliza o início do período para o início do dia UTC (a partir da data local)
            inicioPeriodoTimestampUTC = Date.UTC(
              dataInputInicio.getFullYear(),
              dataInputInicio.getMonth(),
              dataInputInicio.getDate()
            );
          }
          if (this.filtroDataFim) {
            // Split da string YYYY-MM-DD para construir a data no fuso horário local
            const partsFim = this.filtroDataFim.split('-').map(Number);
            // new Date(year, monthIndex, day)
            const dataInputFim = new Date(partsFim[0], partsFim[1] - 1, partsFim[2]);

            // Normaliza o fim do período para o final do dia UTC (a partir da data local)
            // Adiciona 23h59m59s999ms para incluir todo o dia selecionado
            fimPeriodoTimestampUTC = Date.UTC(
              dataInputFim.getFullYear(),
              dataInputFim.getMonth(),
              dataInputFim.getDate(),
              23, 59, 59, 999
            );
          }

          if (inicioPeriodoTimestampUTC !== null && fimPeriodoTimestampUTC !== null) {
            dataValida = dataCriacaoTimestampUTC >= inicioPeriodoTimestampUTC &&
              dataCriacaoTimestampUTC <= fimPeriodoTimestampUTC;
          } else if (inicioPeriodoTimestampUTC !== null) {
            dataValida = dataCriacaoTimestampUTC >= inicioPeriodoTimestampUTC;
          } else if (fimPeriodoTimestampUTC !== null) {
            dataValida = dataCriacaoTimestampUTC <= fimPeriodoTimestampUTC;
          } else {
            dataValida = true; // Se nenhum período foi selecionado, não filtra por data.
          }
          break;

        case 'TODAS':
        default:
          dataValida = true; // Nenhuma restrição de data
          break;
      }
      return estadoValido && dataValida;
    });

    // 2. Ordenar as solicitações filtradas por data/hora crescente
    this.solicitacoesFiltradas.sort((a, b) => {
      const dateA = new Date(a.time?.createdAt || '');
      const dateB = new Date(b.time?.createdAt || '');
      return dateA.getTime() - dateB.getTime(); // Ordem crescente
    });

    this.totalPaginas = Math.ceil(this.solicitacoesFiltradas.length / this.itensPorPagina);
    this.atualizarPagina();
  }

  // Método para alterar o tipo de filtro de data
  mudarTipoFiltroData(tipo: 'HOJE' | 'PERIODO' | 'TODAS'): void {
    this.tipoFiltroData = tipo;
    // Limpa os campos de data se não for filtro por período
    if (tipo !== 'PERIODO') {
      this.filtroDataInicio = '';
      this.filtroDataFim = '';
    }
    this.paginaAtual = 1; // Reinicia a paginação
    this.filtrarSolicitacoes(); // Reaplica os filtros
  }


  public get pages(): number[] {
    return Array.from(
      { length: Math.ceil(this.solicitacoes.length / this.itensPorPagina) },
      (_, i) => i + 1
    );
  }

  atualizarPagina(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    this.solicitacoesPorPagina = this.solicitacoesFiltradas.slice(
      inicio,
      inicio + this.itensPorPagina
    );
  }

  mudarPagina(novaPagina: number): void {
    if (novaPagina < 1 || novaPagina > this.totalPaginas) return;
    this.paginaAtual = novaPagina;
    this.atualizarPagina();
  }

  trackByTaskId(_index: number, task: Task): any {
    return task.id;
  }

  abrirFormulario(): void {
    this.router.navigate(['/nova-solicitacao']);
  }

  verTask(task: Task) {
    this.router.navigate([
      '/solicitacao',
      this.recordIdService.getId(task.id ?? ''),
    ]);
  }

  getModeloEquipamento(equipment: string | Equipment | undefined): string {
    if (typeof equipment === 'object' && equipment !== null && 'model' in equipment) {
      return (equipment as Equipment).model ?? 'Desconhecido';
    }
    return (equipment as string) ?? 'Desconhecido';
  }

}
