import { Component, inject, LOCALE_ID } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { RecordIdPipe } from '../../shared/pipes/record-id.pipe';
import { BudgetService } from '../../services/budget/budget.service';
import { TaskService } from '../../services/task/task.service';
import { RecordidService } from '../../services/utils/recordid.service';
import localeData from '@angular/common/locales/pt';
import { AuthService } from '../../services/auth/auth.service';
import { EquipmentFieldPipe } from '../../shared/pipes/equipment-field.pipe';
import Swal from 'sweetalert2';

registerLocaleData(localeData);

@Component({
  selector: 'app-budgeting',
  imports: [
    CommonModule,
    FormsModule,
    RecordIdPipe,
    RouterModule,
    EquipmentFieldPipe
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }],
  templateUrl: './budgeting.component.html',
  styleUrl: './budgeting.component.css',
})
export class BudgetingComponent {
  tasks: Task[] = [];
  activeAccordion: number | null = null;
  modalVisible = false;
  selectedTask: Task | null = null;
  message: string = '';
  budgetAmount: number = 0;
  budgetDescription: string = '';
  // Novas propriedades para os filtros de relatório
  startDate: string = ''; // Ou Date, dependendo de como você quer lidar
  endDate: string = '';   // Ou Date

  private readonly budgetService = inject(BudgetService);
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly recordIdService = inject(RecordidService);
  private readonly authService = inject(AuthService);
  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    console.log('Current user:', this.authService.getUser());
    if (taskId) {
      // If a taskId is provided, fetch the specific task
      this.taskService.getTaskById(taskId, 'budget,equipment').subscribe({
        next: (task: Task) => {
          // Only add the task if it doesn't have a budget yet
          this.tasks = task.budget ? [] : [task];
        },
        error: (error) => {
          console.error('Erro ao carregar a tarefa:', error);
          this.message = 'Erro ao carregar a tarefa.';
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: this.message,
            confirmButtonText: 'OK',
          });
        },
      });
    } else {
      // Fetch all tasks that need budgets (for employees to create budgets)
      this.taskService.getAllTasks2('budget,equipment').subscribe({
        next: (tasks: Task[]) => {
          console.log('Todas as tarefas carregadas:', tasks);

          // Filter tasks that:
          // 1. Have status 'ABERTA'
          // 2. Don't have budgets yet
          // 3. Are either unassigned (assignee is null) or assigned to current user
          this.tasks = tasks.filter((task) => {
            const hasBudget = task.budget !== null && task.budget !== undefined;
            const isOpenStatus = task.status === 'ABERTA';
            const currentUser = this.authService.getUser();
            const isUnassignedOrAssignedToMe =
              !task.assignee || task.assignee === currentUser;

            return !hasBudget && isOpenStatus && isUnassignedOrAssignedToMe;
          });
          console.log('Tarefas filtradas:', this.tasks);
        },
        error: (error) => {
          console.error('Erro ao carregar as tarefas:', error);
          this.message = 'Erro ao carregar as tarefas.';
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: this.message,
            confirmButtonText: 'OK',
          });
        },
      });
    }
  }
  openBudget(index: number): void {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }
  openCreateBudgetModal(task: Task): void {
    this.selectedTask = task;
    this.budgetAmount = 0;
    this.budgetDescription = '';
    this.openModal();
  }

  assignTaskToMyself(task: Task): void {
    if (!task.id) {
      this.message = 'Erro: ID da tarefa não encontrado.';
      Swal.fire({
        icon: 'error',
        title: 'Erro',
        text: this.message,
        confirmButtonText: 'OK',
      });
      return;
    }

    this.taskService
      .updateTask({
        id: task.id,
        assignee: this.authService.getUser() ?? '', // This should be the current user's ID
      })
      .subscribe({
        next: (updatedTask) => {
          this.message = 'Tarefa atribuída com sucesso!';
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: this.message,
            confirmButtonText: 'OK',
          });

          // Update the task in the local array
          const taskIndex = this.tasks.findIndex((t) => t.id === task.id);
          if (taskIndex !== -1) {
            this.tasks[taskIndex] = {
              ...this.tasks[taskIndex],
              assignee: this.authService.getUser() ?? '',
            };
          }
        },
        error: (error) => {
          console.error('Error assigning task:', error);
          this.message = 'Erro ao atribuir a tarefa.';
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: this.message,
            confirmButtonText: 'OK',
          });
        },
      });
  }

  canCreateBudget(task: Task): boolean {
    // Can create budget if task has an assignee (is assigned to someone)
    return !!task.assignee;
  }
  needsAssignment(task: Task): boolean {
    // Needs assignment if task has no assignee
    return !task.assignee;
  }

  getCleanTaskId(taskId: string | undefined): string {
    if (!taskId) return '';
    return this.recordIdService.getId(taskId);
  }

  createBudget(): void {
    if (
      !this.selectedTask ||
      !this.budgetAmount ||
      !this.budgetDescription.trim()
    ) {
      this.message = 'Por favor, preencha todos os campos obrigatórios.';
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: this.message,
        confirmButtonText: 'OK',
      });
      return;
    }

    const budget = {
      creator: this.authService.getUser() ?? '', // This should be the current user's ID
      amount: this.budgetAmount * 100, // Convert to cents
      description: this.budgetDescription.trim(),
    };

    this.budgetService
      .createBudget(budget, this.recordIdService.getId(this.selectedTask.id!))
      .subscribe({
        next: (createdBudget) => {
          this.message = 'Orçamento criado com sucesso!';
          Swal.fire({
            icon: 'success',
            title: 'Sucesso',
            text: this.message,
            confirmButtonText: 'OK',
          });

          // Update the task status to 'ORÇADA'
          this.taskService
            .updateTask({
              id: this.selectedTask?.id,
              status: 'ORÇADA',
            })
            .subscribe({
              next: () => {
                console.log('Task updated to ORÇADA');
                // Remove the task from the list since it now has a budget
                this.tasks = this.tasks.filter(
                  (t) => t.id !== this.selectedTask?.id
                );
              },
              error: (error) => {
                console.error('Error updating task:', error);
              },
            });

          this.closeModal();
        },
        error: (error) => {
          console.error('Error creating budget:', error);
          this.message = 'Erro ao criar o orçamento.';
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: this.message,
            confirmButtonText: 'OK',
          });
        },
      });
  }

  openModal() {
    this.modalVisible = true;
    console.log('Modal opened');
  }

  closeModal() {
    this.modalVisible = false;
    this.selectedTask = null;
    this.budgetAmount = 0;
    this.budgetDescription = '';
  }
}
function subscribe(arg0: {
  next: (createdBudget: any) => void;
  error: (error: any) => void;
}) {
  throw new Error('Function not implemented.');
}

