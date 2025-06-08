import { RecordIdPipe } from './../../shared/pipes/record-id.pipe';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { Task } from '../../shared/models/task.model';
import { TaskService } from '../../services/task/task.service';
import { EquipmentFieldPipe } from '../../shared/pipes/equipment-field.pipe';
import { ModalListMyTaskVisualizarComponent } from '../../components/modal-listmytask-visualizar/modal-listmytask-visualizar.component';
import { RecordidService } from '../../services/utils/recordid.service';

@Component({
  selector: 'app-list-my-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RecordIdPipe, EquipmentFieldPipe],
  templateUrl: './list-my-tasks.component.html',
  styleUrls: ['./list-my-tasks.component.css'],
})
export class ListMyTasksComponent implements OnInit {
  public readonly recordIdService = inject(RecordidService);
  // ===== Paginação =====
  paginaAtual: number = 1;
  itensPorPagina: number = 4;
  totalPaginas: number = 0;

  tasks: Task[] = [];
  tasksPorPagina: Task[] = [];

  categorias: string[] = [];
  marcas: string[] = [];

  constructor(
    private readonly router: Router,
    private readonly taskService: TaskService
  ) {}
  @ViewChild(ModalListMyTaskVisualizarComponent)
  modalVisualizar!: ModalListMyTaskVisualizarComponent;

  ngOnInit(): void {
    this.taskService
      .getAllMyTasks('creator', undefined, 'equipment')
      .subscribe({
        next: (tasks) => {
          console.log('Tasks recebidas:', tasks);
          this.tasks = tasks;
          this.totalPaginas = Math.ceil(
            this.tasks.length / this.itensPorPagina
          );
          this.atualizarPagina();
        },
        error: (err) => console.error('Erro ao buscar tasks:', err),
      });
  }
  verTask(task: Task) {
    this.router.navigate([
      '/solicitacao',
      this.recordIdService.getId(task.id ?? ''),
    ]);
  }

  abrirFormulario() {
    this.router.navigate(['/nova-solicitacao']);
  }

  private atualizarPagina(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    this.tasksPorPagina = this.tasks.slice(
      inicio,
      inicio + this.itensPorPagina
    );
  }

  mudarPagina(nova: number): void {
    if (nova < 1 || nova > this.totalPaginas) {
      return;
    }
    this.paginaAtual = nova;
    this.atualizarPagina();
  }

  trackByTaskId(_idx: number, task: Task): any {
    return task.id;
  }
}
