import { AuthService } from './../auth/auth.service';
import { RecordidService } from './../utils/recordid.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Task } from '../../shared/models/task.model';
import { map, Observable, finalize } from 'rxjs';
import { LoadingService } from '../utils/loading.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private readonly loadingService: LoadingService) {}

  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api/task';
  private readonly http = inject(HttpClient);
  private readonly recordIdService = inject(RecordidService);
  private readonly authService = inject(AuthService);
  private readonly token = this.authService.getToken();

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
              createdAt: new Date(task?.time?.createdAt ?? ''),
              updatedAt: new Date(task?.time?.updatedAt ?? ''),
            },
          }))
        )
      );
  }

  public createTask(task: Task, expand?: string | string[]): Observable<Task> {
    const params: any = {};

    if (expand) {
      // Handle both string format "value1,value2" or array format ["value1", "value2"]
      params.expand = Array.isArray(expand) ? expand.join(',') : expand;
    }

    return this.http.post<Task>(this.apiUrl, task, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      params,
    });
  }

  public getTaskById(
    taskId: string,
    expand?: string | string[]
  ): Observable<Task> {
    const params: any = {};

    if (expand) {
      // Handle both string format "value1,value2" or array format ["value1", "value2"]
      params.expand = Array.isArray(expand) ? expand.join(',') : expand;
    }

    return this.http.get<Task>(`${this.apiUrl}/${taskId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      params,
    });
  }

  //atualizar status da task no back
  updateTask(task: Task): Observable<Task> {
    if (!task.id) {
      throw new Error('Task.id é obrigatório para updateTask');
    }

    // const taskPayload = {
    //   assignee: task.assignee,
    //   creator: task.creator,
    //   equipment: task.equipment.id,
    //   equipment: equipmentId,
    //   status: task.status,
    //   title: task.title,
    //   type: task.type
    // }


    // create a new variable that has the same information as the task but without the id
    const { id, ...taskPayload } = task;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getToken()}`, // Adiciona o token no header
    });
    this.loadingService.show(); // Exibe o loading
    return this.http
      .patch<Task>(
        `${this.apiUrl}/${this.recordIdService.getId(id)}
      `,
        taskPayload,
        { headers }
      )
      .pipe(
        finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
      );
  }
}
