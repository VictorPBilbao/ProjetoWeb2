import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employee } from '../../shared/models/employee.model';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { ModalEmployeeVisualizarComponent } from '../../components/modal-employee-visualizar/modal-employee-visualizar.component';
import { ModalEmployeeEditarComponent } from '../../components/modal-employee-editar/modal-employee-editar.component';
import { Task } from '../../shared/models/task.model';
import { TaskService } from '../../services/task/task.service';
import { RecordIdPipe } from '../../shared/pipes/record-id.pipe';
import { EquipmentFieldPipe } from '../../shared/pipes/equipment-field.pipe';

declare var bootstrap: any;

@Component({
  selector: 'app-list-my-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalEmployeeVisualizarComponent,
    ModalEmployeeEditarComponent,
    RecordIdPipe,
    EquipmentFieldPipe
  ],
  templateUrl: './list-my-tasks.component.html',
  styleUrls: ['./list-my-tasks.component.css'],
})
export class ListMyTasksComponent implements OnInit {
  solicitacoes: Employee[] = [];
  selecionado: Employee = {} as Employee;
  solicitacoesPorGrupo: Employee[][] = [];
  paginaAtual: number = 1;
  itensPorPagina: number = 4;
  totalPaginas: number = 0;

  tasks: Task[] = [];

  categorias: string[] = [];
  marcas: string[] = [];

  campoOrdenado: string = '';
  ordemCrescente: boolean = true;

  constructor(
    private readonly router: Router,
    private readonly taskService: TaskService
  ) {}

  @ViewChild(ModalEmployeeVisualizarComponent)
  modalVisualizar!: ModalEmployeeVisualizarComponent;
  @ViewChild(ModalEmployeeEditarComponent)
  modalEmployeeEditar!: ModalEmployeeEditarComponent;

  editar(s: Employee) {
    this.modalEmployeeEditar.editar(s); // define o selecionado no modal
    //this.modalEmployeeEditar.abrirModal(); // abre o modal
  }

  ngOnInit(): void {
    this.taskService.getAllMyTasks('creator', undefined, 'equipment').subscribe({
      next: (tasks) => {
        console.log('Tasks recebidas:', tasks);
        this.tasks = tasks;
      },
      error: (error) => {
        console.error('Erro ao buscar tasks:', error);
      },
    });
  }

  verTask(task: Task) {
    this.modalVisualizar.selecionado = { ...task };
    this.modalVisualizar.abrirModal();
  }

  ordenarPor(campo: keyof Employee): void {
    // Garante que 'campo' seja uma chave válida de Employee
    if (this.campoOrdenado === campo) {
      this.ordemCrescente = !this.ordemCrescente;
    } else {
      this.campoOrdenado = campo;
      this.ordemCrescente = true;
    }

    this.solicitacoes.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (campo === 'data') {
        valA = new Date(`${a.data}T${a.hora}`);
        valB = new Date(`${b.data}T${b.hora}`);
      } else {
        valA = a[campo]; // Agora 'campo' é garantido como chave válida de 'Employee'
        valB = b[campo];
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return this.ordemCrescente ? -1 : 1;
      if (valA > valB) return this.ordemCrescente ? 1 : -1;
      return 0;
    });

    this.totalPaginas = Math.ceil(
      this.solicitacoes.length / this.itensPorPagina
    );
    this.paginaAtual = 1;
    this.atualizarPagina();
  }

  abrirFormulario() {
    this.router.navigate(['/nova-solicitacao']);
  }

  atualizarPagina(): void {
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.solicitacoesPorGrupo = [this.solicitacoes.slice(inicio, fim)]; // deixa só uma "página" no array
  }

  mudarPagina(novaPagina: number): void {
    if (novaPagina >= 1 && novaPagina <= this.totalPaginas) {
      this.paginaAtual = novaPagina;
      this.atualizarPagina();
    }
  }
}
