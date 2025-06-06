import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../auth/auth.service';

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
  private readonly token;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.token = this.authService.getToken();
  }

  public getMyTasks(): Observable<Task[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${this.token}`
    });

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
        )
      );
  }
}