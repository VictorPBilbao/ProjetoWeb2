import { CommentService } from './../../services/comment/comment.service';
import { RecordIdPipe } from './../../shared/pipes/record-id.pipe';
import { Component, inject } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import localeData from '@angular/common/locales/pt';
import { Task } from '../../shared/models/task.model';
import { NotificationComponent } from '../../components/notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task/task.service';
import { BudgetService } from '../../services/budget/budget.service';

registerLocaleData(localeData);

@Component({
  selector: 'app-budget',
  imports: [CommonModule, NotificationComponent, FormsModule, RecordIdPipe],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css',
})
export class BudgetComponent {
  tasks: Task[] = [];
  activeAccordion: number | null = null;
  modalVisible = false;
  selectedTask: Task | null = null;
  message: string = '';
  showNotification: boolean = false;
  rejectDescription: string = '';
  modalType: 'approval' | 'rejection' = 'approval';

  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly budgetService = inject(BudgetService);
  private readonly commentService = inject(CommentService);

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (taskId) {
      // If a taskId is provided, fetch the specific task with its budget
      this.taskService.getTaskById(taskId, 'budget').subscribe({
        next: (task: Task) => {
          // Only add the task if it has a budget
          this.tasks = task.budget ? [task] : [];
          this.sortTasksByBudgetStatus();
        },
        error: (error) => {
          console.error('Erro ao carregar a tarefa:', error);
          this.message = 'Erro ao carregar a tarefa.';
          this.showNotification = true;
        },
      });
    } else {
      // If no taskId is provided, fetch all tasks with their budgets
      this.taskService.getAllMyTasks('creator', undefined, 'budget').subscribe({
        next: (tasks: Task[]) => {
          // Only include tasks where budget is not null
          this.tasks = tasks.filter((task) => task.budget !== null);
          this.sortTasksByBudgetStatus();
          // console log the tasks
          console.log('Tarefas carregadas:', this.tasks);
        },
        error: (error) => {
          console.error('Erro ao carregar as tarefas:', error);
          this.message = 'Erro ao carregar as tarefas.';
          this.showNotification = true;
        },
      });
    }
  }
  private sortTasksByBudgetStatus(): void {
    this.tasks.sort((a, b) => {
      const statusOrder = { PENDENTE: 0, ACEITA: 1, REJEITADA: 2 };
      const statusA = a.budget?.accepted ?? 'PENDENTE';
      const statusB = b.budget?.accepted ?? 'PENDENTE';

      return (
        (statusOrder[statusA as keyof typeof statusOrder] ?? 3) -
        (statusOrder[statusB as keyof typeof statusOrder] ?? 3)
      );
    });
  }

  openBudget(index: number): void {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }
  async approvalBudget(id: string): Promise<void> {
    // Store the budget for the approval modal
    this.selectedTask =
      this.tasks.find((task) => task.budget?.id === id) || null;
    this.modalType = 'approval';
    this.openModal();
  }

  confirmApprovalBudget(): void {
    console.log('Approving budget with ID:', this.selectedTask?.budget?.id);
    this.budgetService.updateBudget({ id: this.selectedTask?.budget?.id, accepted: 'ACEITA' }).subscribe({
      next: () => {
        this.message = 'Orçamento aprovado com sucesso.';
        this.showNotification = true;
      },
      error: (error) => {
        this.message = 'Erro ao aprovar o orçamento.';
        this.showNotification = true;
      },
    });
    //* now update the task to 'APROVADA'
    this.taskService.updateTask({
      id: this.selectedTask?.id,
      status: 'APROVADA',
    }).subscribe({
      next: () => {
        console.log('Task updated to APROVADA');
      },
      error: (error) => {
        console.error('Error updating task:', error);
      },
    });
    this.closeModal();
  }

  async rejectBudget(id?: string): Promise<void> {
    console.log('Rejecting budget for task ID:', id);
    console.log('Rejection reason:', this.rejectDescription);
    this.budgetService.updateBudget({
      id: this.selectedTask?.budget?.id,
      accepted: 'REJEITADA',
    }).subscribe({
      next: () => {
        this.message = 'Orçamento rejeitado com sucesso.';
        this.showNotification = true;
      },
      error: (error) => {
        this.message = 'Erro ao rejeitar o orçamento.';
        this.showNotification = true;
      },
    });
    //* now update the task to 'REJEITADA'
    this.taskService.updateTask({
      id: this.selectedTask?.id,
      status: 'REJEITADA',
    }).subscribe({
      next: () => {
        console.log('Task updated to REJEITADA');
      },
      error: (error) => {
        console.error('Error updating task:', error);
      },
    });

    //* Now create a comment for the rejection
    this.commentService.createComment({
      out: this.selectedTask?.id,
      comment: "Rejeitei por: " + this.rejectDescription,
    }).subscribe({
      next: () => {
        console.log('Comment created successfully.');
      },
      error: (error) => {
        console.error('Error creating comment:', error);
      },
    });

    this.closeModal();
    this.rejectDescription = ''; // Clear the rejection description
  }

  openRejectBudgetModal(id: string): void {
    // Store the budget ID for the rejection modal
    this.selectedTask =
      this.tasks.find((task) => task.budget?.id === id) || null;
    this.modalType = 'rejection';
    this.openModal();
  }

  openModal() {
    this.modalVisible = true;
    console.log('Modal opened');
  }

  closeModal() {
    this.modalVisible = false;
  }
}
