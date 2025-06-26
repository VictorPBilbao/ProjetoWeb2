import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';
import { LoadingService } from '../utils/loading.service';

export interface Task {
  id: string;
  assignee: string;
  creator: string;
  budget: string;
  equipment: string;
  status: string;
  summary: string;
  title: string;
  type: string;
  time: {
    createdAt: string;
    updatedAt: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api/task/me';

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly loadingService: LoadingService
  ) {}

  public getMyTasks(): Observable<Task[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    this.loadingService.show(); // Show loading indicator

    return this.http.get<Task[]>(this.apiUrl, { headers })
      .pipe(
        map(tasks =>
          tasks.map(task => ({
            ...task,
            time: {
              createdAt: new Date(task.time.createdAt).toISOString(),
              updatedAt: new Date(task.time.updatedAt).toISOString()
            }
          }))
        ),
        finalize(() => this.loadingService.hide()) // Hide loading indicator after request completes
      );
  }
}
