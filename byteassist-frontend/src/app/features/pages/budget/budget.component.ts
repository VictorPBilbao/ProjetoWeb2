import { RecordIdPipe } from './../../shared/pipes/record-id.pipe';
import { Component, inject, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../shared/models/task.model';
import { NotificationComponent } from '../../components/notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import { TaskService } from '../../services/task/task.service';

@Component({
  selector: 'app-budget',
  imports: [CommonModule, NotificationComponent, FormsModule, RecordIdPipe],
  providers: [{ provide: LOCALE_ID, useValue: 'pt-BR' }],
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

  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (taskId) {
      // If a taskId is provided, fetch the specific task with its budget
      this.taskService.getTaskById(taskId, 'budget').subscribe({
      next: (task: Task) => {
        // Only add the task if it has a budget
        this.tasks = task.budget ? [task] : [];
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
        this.tasks = tasks.filter(task => task.budget !== null);
        // console log the tasks
        console.log('Tarefas carregadas:', this.tasks);
      },
      error: (error) => {
        console.error('Erro ao carregar as tarefas:', error);
        this.message = 'Erro ao carregar as tarefas.';
        this.showNotification = true;
      }
      });
    }
  }

  openBudget(index: number): void {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }

  async approvalBudget(id: string): Promise<void> {
    this.openModal();
  }

  async rejectBudget(id?: string): Promise<void> {
    // log the id
    console.log('Rejecting budget for task ID:', id);
    this.closeModal();
  }

  openRejectBudgetModal(id: string): void {
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
