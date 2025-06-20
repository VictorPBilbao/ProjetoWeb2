import { Component, LOCALE_ID } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { CommonModule, registerLocaleData } from '@angular/common';
import { BudgetService } from '../../services/budget/budget.service';
import { NotificationComponent } from '../../components/notification/notification.component';
import { ActivatedRoute } from '@angular/router';
import ptBr from '@angular/common/locales/pt';

registerLocaleData(ptBr);

@Component({
  selector: 'app-budgeting',
  imports: [
    NotificationComponent,
    CommonModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' }
  ],
  templateUrl: './budgeting.component.html',
  styleUrl: './budgeting.component.css'
})
export class BudgetingComponent {
  tasks: Task[] = [];
  activeAccordion: number | null = null;
  modalVisible = false;
  selectedTask: Task | null = null;
  message: string = '';
  showNotification: boolean = false;

  constructor(
    private readonly budgetService: BudgetService,
    private readonly route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');

    this.budgetService.getTasksWithBudget().subscribe({
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

  openBudget(index: number): void {
    this.activeAccordion = this.activeAccordion === index ? null : index;
  }

  async budgetingRequest(id?: string): Promise<void> {

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
