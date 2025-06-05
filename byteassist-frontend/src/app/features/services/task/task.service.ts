import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Task } from '../../shared/models/task.model';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api/task';
  private readonly token;

  constructor(
    private readonly http: HttpClient,
    private readonly authService: AuthService
  ) {
    this.token = this.authService.getToken();
  }

  public getAllMyTasks(
    type: string = 'creator',
    status?: string,
    expand?: string | string[]
  ) {
    const params: any = { type };

    if (status) {
      params.status = status;
    }

    if (expand) {
      // Handle both string format "value1,value2" or array format ["value1", "value2"]
      params.expand = Array.isArray(expand) ? expand.join(',') : expand;
    }

    return this.http
      .get<Task[]>(`${this.apiUrl}/me`, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Bearer ${this.token}`,
        },
        params,
      })
      .pipe(
        map((tasks) =>
          tasks.map((task) => ({
            ...task,
            time: {
              createdAt: new Date(task.time.createdAt),
              updatedAt: new Date(task.time.updatedAt),
            },
          }))
        )
      );
  }
}
