import { inject, Injectable } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { LoadingService } from '../utils/loading.service';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Budget } from '../../shared/models/budget.model';
import { RecordidService } from '../utils/recordid.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private readonly apiUrlTask = 'https://byteassist-backend.fly.dev/api/task';
  private readonly apiUrlBudget = 'https://byteassist-backend.fly.dev/api/budget';
  private readonly recordIdService = inject(RecordidService);

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

    return this.http.get<Task[]>(`${this.apiUrlTask}/me?expand=budget, equipment`, { headers });
  }

  getTaskWithBudget(taskId: string): Observable<Task> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    return this.http.get<Task>(`${this.apiUrlTask}/${taskId}?expand=budget, equipment`, { headers });
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

  updateBudget(budget: Budget): Observable<Budget> {

    if (!budget?.id) {
      throw new Error('Budget object with a valid id is required for update.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    // Exclude 'id' from the payload before sending
    const { id, ...budgetPayload } = budget;
    return this.http.patch<Budget>(`${this.apiUrlBudget}/${this.recordIdService.getId(id)}`, budgetPayload, { headers });
  }

  createBudget(budget: Budget, taskId: string): Observable<Budget> {
    if (!budget || !taskId) {
      throw new Error('Budget object with a valid taskId is required for creation.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    // exclude 'id' from the payload before sending
    const { id, ...budgetPayload } = budget;
    return this.http.post<Budget>(this.apiUrlBudget + `/${taskId}`, budgetPayload, { headers });
  }
}
