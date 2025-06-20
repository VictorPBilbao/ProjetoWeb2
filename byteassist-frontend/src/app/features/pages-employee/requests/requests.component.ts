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

  // Filtros
  filtroEstado: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';

  constructor(
    private taskService: TaskService, //pega as tasks de quem ta logado
    private router: Router
  ) { }

  ngOnInit(): void {
    this.taskService.getAllMyTasks('assignee', undefined, ['equipment'])
      .subscribe({
        next: (tasks) => {
          console.log('📦 Dados recebidos da API:', tasks);
          this.solicitacoes = tasks;
          this.filtrarSolicitacoes();
        },
        error: (err) => console.error('Erro ao carregar solicitações:', err)
      });
  }

  filtrarSolicitacoes(): void {
    this.solicitacoesFiltradas = this.solicitacoes.filter(s => {
      const data = new Date(s.time?.createdAt || '');
      const estadoValido = !this.filtroEstado || s.status === this.filtroEstado;
      const inicioValido = this.filtroDataInicio ? new Date(this.filtroDataInicio) <= data : true;
      const fimValido = this.filtroDataFim ? data <= new Date(this.filtroDataFim) : true;
      return estadoValido && inicioValido && fimValido;
    });

    this.totalPaginas = Math.ceil(this.solicitacoesFiltradas.length / this.itensPorPagina);
    this.atualizarPagina();
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
