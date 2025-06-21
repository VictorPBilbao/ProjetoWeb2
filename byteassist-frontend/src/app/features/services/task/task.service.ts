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
  constructor(
    private readonly loadingService: LoadingService
  ) { };

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

    const taskPayload = {
      assignee: task.assignee,
      // creator: task.creator,
      // equipment: task.equipment.id,
      // equipment: equipmentId,
      status: task.status,
      // title: task.title,
      // type: task.type
    }
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.authService.getToken()}` // Adiciona o token no header
    });
    this.loadingService.show(); // Exibe o loading
    return this.http.patch<Task>(`${this.apiUrl}/${this.recordIdService.getId(task.id)}
      `, taskPayload, { headers }).pipe(
      finalize(() => this.loadingService.hide()), // Esconde o loading após a requisição
    );
  }

  // // ATUALIZAÇÃO DO MÉTODO updateTask:
  // // Agora aceita um `Partial<Task>` para enviar apenas os campos que queremos atualizar.
  // updateTask(taskId: string, updates: Partial<Task>): Observable<Task> {
  //   console.log('Atualizando tarefa com ID:', updates);
  //   if (!taskId) { // taskId é o id da tarefa, não o objeto inteiro.
  //     throw new Error('ID da Task é obrigatório para updateTask');
  //   }

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //     'Authorization': `Bearer ${this.authService.getToken()}`
  //   });

  //   this.loadingService.show();
  //   return this.http.patch<Task>(`${this.apiUrl}/${this.recordIdService.getId(taskId)}`, updates, { headers }).pipe( // Envia `updates` diretamente
  //     finalize(() => this.loadingService.hide()),
  //   );
  // }


  // NOVA FUNÇÃO: Para buscar TODAS as tarefas no sistema
  public getAllTasks(status?: string, expand?: string | string[]): Observable<Task[]> {
    const params: any = {};

    if (status) {
      params.status = status;
    }

    if (expand) {
      params.expand = Array.isArray(expand) ? expand.join(',') : expand;
    }

    this.loadingService.show(); // Exibe o loading para esta requisição também
    return this.http
      .get<Task[]>(this.apiUrl, { // Este endpoint é para 'todas as tarefas'
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
        ),
        finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
      );
  }

}
