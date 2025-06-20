import { Component, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Task } from '../../shared/models/task.model';
import { BudgetService } from '../../services/budget/budget.service';
import { NotificationComponent } from '../../components/notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user.model';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

@Component({
  selector: 'app-budget',
  imports: [
    CommonModule,
    NotificationComponent,
    FormsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent {
  tasks: Task[] = [];
  activeAccordion: number | null = null;
  modalVisible = false;
  selectedTask: Task | null = null;
  message: string = '';
  showNotification: boolean = false;
  rejectDescription: string = '';
  constructor(
    private readonly budgetService: BudgetService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');

    if (taskId) {
      this.budgetService.getTaskWithBudget(taskId).subscribe({
        next: (task: Task) => {
          this.tasks = [task];
        },
        error: (error) => {
          console.error('Erro ao carregar a tarefa:', error);
          this.message = 'Erro ao carregar a tarefa.';
          this.showNotification = true;
        }
      });
    } else {
      this.budgetService.getTasksWithBudgetFromClient().subscribe({
        next: (tasks: Task[]) => {
          this.tasks = tasks;
        },
        error: (error) => {
          console.error('Erro ao carregar as tarefas:', error);
          this.message = 'Erro ao carregar as tarefas.';
          this.showNotification = true;
        }
      });
    }
  }

  getCreatorName(creator: User | string): string {
    if (
      creator &&
      typeof creator === 'object' &&
      'name' in creator &&
      creator.name &&
      typeof creator.name === 'object' &&
      'first' in creator.name
    ) {
      return (creator.name as { first: string }).first;
    }
    return creator as string;
  }

  openBudget(index: number): void {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }

  async approvalBudget(id: string): Promise<void> {

    this.openModal();
  }

  async rejectBudget(id?: string): Promise<void> {

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
