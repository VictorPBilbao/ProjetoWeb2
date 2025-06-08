import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


import { Task } from '../../shared/models/task.model';
import { TaskService } from '../../services/task/task.service';
import { RecordIdPipe } from '../../shared/pipes/record-id.pipe';
import { EquipmentFieldPipe } from '../../shared/pipes/equipment-field.pipe';
import { ModalListMyTaskVisualizarComponent } from '../../components/modal-listmytask-visualizar/modal-listmytask-visualizar.component';

@Component({
  selector: 'app-list-my-tasks',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RecordIdPipe,
    EquipmentFieldPipe,
    ModalListMyTaskVisualizarComponent
],
  templateUrl: './list-my-tasks.component.html',
  styleUrls: ['./list-my-tasks.component.css'],
})
export class ListMyTasksComponent implements OnInit {
  // ===== Paginação =====
  paginaAtual: number = 1;
  itensPorPagina: number = 4;
  totalPaginas: number = 0;

  // ===== Dados de Tasks =====
  tasks: Task[] = [];
  tasksPorPagina: Task[] = [];

  // ===== (EMPLOYEE: comentado) =====
  // solicitacoes: Employee[] = [];
  // solicitacoesPorGrupo: Employee[][] = [];
  // selecionado: Employee = {} as Employee;

  categorias: string[] = [];
  marcas: string[] = [];

  // ===== (EMPLOYEE: comentado) =====
  // campoOrdenado: string = '';
  // ordemCrescente: boolean = true;

  constructor(
    //private readonly service: EmployeeService,    // EMPLOYEE
    private readonly router: Router,
    private readonly taskService: TaskService
  ) { }
  @ViewChild(ModalListMyTaskVisualizarComponent)
  modalVisualizar!: ModalListMyTaskVisualizarComponent;

  // ===== (EMPLOYEE: comentado) =====
  // @ViewChild(ModalEmployeeVisualizarComponent)
  // modalVisualizar!: ModalEmployeeVisualizarComponent;
  // @ViewChild(ModalEmployeeEditarComponent)
  // modalEmployeeEditar!: ModalEmployeeEditarComponent;

  ngOnInit(): void {
    // ===== (EMPLOYEE: listar solicitacoes) =====
    // this.service.listar().subscribe((s) => {
    //   console.log('Solicitações recebidas:', s);
    //   this.solicitacoes = s;
    //   this.ordenarPor('data');
    // });

    // ===== (EMPLOYEE: categorias e marcas) =====
    // this.service.getEquipamentos().subscribe((equipamentos) => {
    //   this.categorias = [...new Set(equipamentos.map((e) => e.type))];
    //   this.marcas     = [...new Set(equipamentos.map((e) => e.brand))];
    // });

    // ===== Carrega e pagina tasks =====
  //@ViewChild(ModalEmployeeVisualizarComponent)
  //modalVisualizar!: ModalEmployeeVisualizarComponent;
  //@ViewChild(ModalEmployeeEditarComponent)
  //!: ModalEmployeeEditarComponent;

  //editar(s: Employee) {
    //this.modalEmployeeEditar.editar(s); // define o selecionado no modal
    //this.modalEmployeeEditar.abrirModal(); // abre o modal
  //}

  //ngOnInit(): void {
    this.taskService.getAllMyTasks('creator', undefined, 'equipment').subscribe({
      next: (tasks) => {
        console.log('Tasks recebidas:', tasks);
        this.tasks = tasks;
        this.totalPaginas = Math.ceil(this.tasks.length / this.itensPorPagina);
        this.atualizarPagina();
      },
      error: (err) => console.error('Erro ao buscar tasks:', err)
    });
  }

  /** Abre modal de visualização da task */
  //verTask(task: Task) {
  // EMPLOYEE modal adaptado: aqui abriria modalVisualizar para task
  // this.modalVisualizar.selecionado = { ...task };
  // this.modalVisualizar.abrirModal();

/** Abre modal de visualização da task */
verTask(task: Task) {
  // 1) passa a task selecionada para o modal
  this.modalVisualizar.selecionado = task;
  // 2) chama o método de exibir
  this.modalVisualizar.abrirModal();
}


/** (EMPLOYEE: ordenação comentada) */
// ordenarPor(campo: keyof Employee): void { … }

/** (EMPLOYEE: seleção comentada) */
// selecionar(s: Employee) {
//   this.selecionado = { ...s };
// }

/** Navega para criação de nova solicitação/task */
abrirFormulario() {
  this.router.navigate(['/nova-solicitacao']);
}
  //abrirFormulario() {
    //this.router.navigate(['/nova-solicitacao']);
  //}

  /** Atualiza tasksPorPagina para a página atual */
  private atualizarPagina(): void {
  const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
  this.tasksPorPagina = this.tasks.slice(inicio, inicio + this.itensPorPagina);
}

/** Muda de página */
mudarPagina(nova: number): void {
  if(nova < 1 || nova > this.totalPaginas) return;
this.paginaAtual = nova;
this.atualizarPagina();
  }

/** trackBy para performance no *ngFor */
trackByTaskId(_idx: number, task: Task): any {
  return task.id;
}

  /** (EMPLOYEE: editar comentado) */
  //editar(s: Employee) {
  // this.modalEmployeeEditar.editar(s);
  // this.modalEmployeeEditar.abrirModal();
  //}

}
