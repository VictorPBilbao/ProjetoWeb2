import { Injectable } from '@angular/core';
import { Budget } from '../../shared/models/budget.model';
import { Task } from '../../shared/models/task.model';
import { LoadingService } from '../utils/loading.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private readonly apiUrlTask = 'https://byteassist-backend.fly.dev/api/task';
  private readonly apiUrlBudget = 'https://byteassist-backend.fly.dev/api/budget';

  constructor(
    private readonly loadingService: LoadingService,
    private readonly authService: AuthService,
    private readonly http: HttpClient
  ) { }

  getTasksWithBudget(): Observable<Task[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<Task[]>(`${this.apiUrlTask}?expand=budget, equipment`, { headers });
  }

  getTasksWithBudgetFromClient(): Observable<Task[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<Task[]>(`${this.apiUrlTask}/me?expand=budget, equipment, creator`, { headers });
  }

  getTaskWithBudget(taskId: string): Observable<Task> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<Task>(`${this.apiUrlTask}/${taskId}?expand=budget, equipment`, { headers });
  }

  approveBudget(budgetId: string): Promise<void> {

    this.loadingService.show(); // Exibe o loading

    return new Promise((resolve) => {
      setTimeout(() => {
        this.loadingService.hide(); // Esconde o loading após a requisição
        // Logic to approve the budget goes here
        console.log(`Budget with ID ${budgetId} approved.`);
        resolve(); // Resolve a Promise após a lógica de aprovação
      }, 2000);
    });
  }

  rejectBudget(budgetId: string): Promise<void> {
    this.loadingService.show(); // Exibe o loading

    return new Promise((resolve) => {
      setTimeout(() => {
        this.loadingService.hide(); // Esconde o loading após a requisição
        // Logic to reject the budget goes here
        console.log(`Budget with ID ${budgetId} rejected.`);
        resolve();
      }, 2000);
    });
  }

  budgetingRequest(budgetId: string): Promise<void> {
    this.loadingService.show(); // Exibe o loading

    return new Promise((resolve) => {
      setTimeout(() => {
        this.loadingService.hide(); // Esconde o loading após a requisição
        // Logic to request the budget goes here
        console.log(`Budget with ID ${budgetId} budgeted.`);
        resolve();
      }, 2000);
    });
  }
}
