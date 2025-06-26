import { inject, Injectable } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { LoadingService } from '../utils/loading.service';
import { Observable, finalize } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { Budget } from '../../shared/models/budget.model';
import { RecordidService } from '../utils/recordid.service';

@Injectable({
  providedIn: 'root'
})
export class BudgetService {

  private readonly apiUrlTask = 'https://byteassist-backend.fly.dev/api/task';
  private readonly apiUrlBudget = 'https://byteassist-backend.fly.dev/api/budget';
  private readonly apiUrlReports = 'https://byteassist-backend.fly.dev';
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

    this.loadingService.show(); // Exibe o loading
    return this.http.get<Task[]>(`${this.apiUrlTask}?expand=budget, equipment`, { headers }).pipe(
      finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
    );
  }

  getTasksWithBudgetFromClient(): Observable<Task[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.loadingService.show(); // Exibe o loading
    return this.http.get<Task[]>(`${this.apiUrlTask}/me?expand=budget, equipment`, { headers }).pipe(
      finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
    );
  }

  getTaskWithBudget(taskId: string): Observable<Task> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.loadingService.show(); // Exibe o loading
    return this.http.get<Task>(`${this.apiUrlTask}/${taskId}?expand=budget, equipment`, { headers }).pipe(
      finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
    );
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

    this.loadingService.show(); // Exibe o loading
    // Exclude 'id' from the payload before sending
    const { id, ...budgetPayload } = budget;
    return this.http.patch<Budget>(`${this.apiUrlBudget}/${this.recordIdService.getId(id)}`, budgetPayload, { headers }).pipe(
      finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
    );
  }

  createBudget(budget: Budget, taskId: string): Observable<Budget> {
    if (!budget || !taskId) {
      throw new Error('Budget object with a valid taskId is required for creation.');
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    this.loadingService.show(); // Exibe o loading
    // exclude 'id' from the payload before sending
    const { id, ...budgetPayload } = budget;
    return this.http.post<Budget>(this.apiUrlBudget + `/${taskId}`, budgetPayload, { headers }).pipe(
      finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
    );
  }


  getReportPdf(path: string, params?: HttpParams): Observable<Blob> {
    const headers = new HttpHeaders({
      'Accept': 'application/pdf',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
    return this.http.get(
      `${this.apiUrlReports}${path}`,
      { headers, params, responseType: 'blob' }
    );
  }


}
