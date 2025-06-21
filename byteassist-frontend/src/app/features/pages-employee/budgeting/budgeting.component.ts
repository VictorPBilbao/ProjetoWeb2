import { Component, inject, LOCALE_ID } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { Budget } from '../../shared/models/budget.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { NotificationComponent } from '../../components/notification/notification.component';
import { RecordIdPipe } from '../../shared/pipes/record-id.pipe';
import { BudgetService } from '../../services/budget/budget.service';
import { TaskService } from '../../services/task/task.service';
import { RecordidService } from '../../services/utils/recordid.service';

@Component({
  selector: 'app-budgeting',
  imports: [NotificationComponent, CommonModule, FormsModule, RecordIdPipe, RouterModule],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
  templateUrl: './budgeting.component.html',
  styleUrl: './budgeting.component.css',
})
export class BudgetingComponent {
  tasks: Task[] = [];
  activeAccordion: number | null = null;
  modalVisible = false;
  selectedTask: Task | null = null;
  message: string = '';
  showNotification: boolean = false;
  budgetAmount: number = 0;
  budgetDescription: string = '';
  private readonly budgetService = inject(BudgetService);
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly recordIdService = inject(RecordidService);
  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (taskId) {
      // If a taskId is provided, fetch the specific task
      this.taskService.getTaskById(taskId, 'budget,equipment').subscribe({
        next: (task: Task) => {
          // Only add the task if it doesn't have a budget yet
          this.tasks = !task.budget ? [task] : [];
        },
        error: (error) => {
          console.error('Erro ao carregar a tarefa:', error);
          this.message = 'Erro ao carregar a tarefa.';
          this.showNotification = true;
        },
      });    } else {
      // Fetch all tasks that need budgets (for employees to create budgets)
      this.taskService.getAllTasks('budget,equipment').subscribe({
        next: (tasks: Task[]) => {
          console.log('Todas as tarefas carregadas:', tasks);

          // Filter tasks that:
          // 1. Don't have budgets yet
          // 2. Have status 'ABERTA'
          // 3. Are either unassigned (assignee is null) or assigned to current user
          this.tasks = tasks.filter((task) => {
            const hasBudget = task.budget !== null && task.budget !== undefined;
            const isOpenStatus = task.status === 'ABERTA';
            const isUnassignedOrAssignedToMe = !task.assignee || task.assignee === 'current-user';

            console.log(`Task ${task.id}: hasBudget=${hasBudget}, status=${task.status}, assignee=${task.assignee}, isOpenStatus=${isOpenStatus}, isUnassignedOrAssignedToMe=${isUnassignedOrAssignedToMe}`);

            return !hasBudget && isOpenStatus && isUnassignedOrAssignedToMe;
          });

          console.log('Tarefas filtradas (ABERTA + sem orçamento + não atribuída a outros):', this.tasks);
        },
        error: (error) => {
          console.error('Erro ao carregar as tarefas:', error);
          this.message = 'Erro ao carregar as tarefas.';
          this.showNotification = true;
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
      this.showNotification = true;
      return;
    }

    this.taskService.updateTask({
      id: task.id,
      assignee: 'current-user', // This should be the current user's ID
    }).subscribe({
      next: (updatedTask) => {
        this.message = 'Tarefa atribuída com sucesso!';
        this.showNotification = true;

        // Update the task in the local array
        const taskIndex = this.tasks.findIndex(t => t.id === task.id);
        if (taskIndex !== -1) {
          this.tasks[taskIndex] = { ...this.tasks[taskIndex], assignee: 'current-user' };
        }
      },
      error: (error) => {
        console.error('Error assigning task:', error);
        this.message = 'Erro ao atribuir a tarefa.';
        this.showNotification = true;
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
    if (!this.selectedTask || !this.budgetAmount || !this.budgetDescription.trim()) {
      this.message = 'Por favor, preencha todos os campos obrigatórios.';
      this.showNotification = true;
      return;
    }

    const budget = {
      amount: this.budgetAmount * 100, // Convert to cents
      description: this.budgetDescription.trim()
    };

    this.budgetService.createBudget(budget, this.selectedTask.id!).subscribe({
      next: (createdBudget) => {
        this.message = 'Orçamento criado com sucesso!';
        this.showNotification = true;

        // Update the task status to 'ORÇADA'
        this.taskService.updateTask({
          id: this.selectedTask?.id,
          status: 'ORÇADA',
        }).subscribe({
          next: () => {
            console.log('Task updated to ORÇADA');
            // Remove the task from the list since it now has a budget
            this.tasks = this.tasks.filter(t => t.id !== this.selectedTask?.id);
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
        this.showNotification = true;
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
