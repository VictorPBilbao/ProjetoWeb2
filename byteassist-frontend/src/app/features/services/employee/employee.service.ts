import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Employee } from '../../shared/models/employee.model';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  //private readonly apiUrl = 'https://byteassist-backend.fly.dev/api/task';
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api/task/detailed';

  constructor(private http: HttpClient, private authService: AuthService) {}

private getHttpOptions() {
  const token = this.authService.getToken();

  return {
    headers: new HttpHeaders({
      //'Content-Type': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${token}`
    })
  };
}
listar(type: string = 'creator', status?: string): Observable<Employee[]> {
  const params: any = { type };
  if (status) {
    params.status = status;
  }

  return this.http.get<any[]>(`${this.apiUrl}/me`, {
    ...this.getHttpOptions(),
    params
  }).pipe(
    map((tasks: any[]) => tasks.map(task => this.mapTaskToEmployee(task))),
    catchError(this.handleError)
  );
}

private mapTaskToEmployee(task: any): Employee {
  const dt = task.time?.createdAt ? new Date(task.time.createdAt) : new Date();

  // Corrigido: formato ISO aceito por input type="date"
  const data = dt.toISOString().slice(0, 10); // "2025-05-29"

  const hora = dt.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit'
  }); 

  return {
    id: task.id?.match(/⟨(.+?)⟩/)?.[1] ?? task.id,
    categoria: task.type,
    cor: task.equipment?.color ?? '',
    data,
    hora,
    defeitoRelatado: task.summary,
    descricaoServico: task.title,
    equipamento: `${task.equipment?.brand ?? ''} ${task.equipment?.model ?? ''}`.trim(),
    estado: task.status,
    autor: task.creator?.username ?? '',
    funcionario: task.assignee?.username ?? '',
    historico: task.summary, // Se houver campo mais específico, substitua aqui
    marca: task.equipment?.brand ?? '',
    orcamento: task.budget?.amount?.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }) ?? ''
  };
}

  buscarPorId(id: number): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/${id}`, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  editar(solicitacao: Employee): Observable<Employee> { //add url da api pra editar
    return this.http.put<Employee>(`${this.apiUrl}/${solicitacao.id}`, solicitacao, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  adicionar(solicitacao: Employee): Observable<Employee> { // add url da api para criar nova usando o post
    return this.http.post<Employee>(`${this.apiUrl}`, solicitacao, this.getHttpOptions())
      .pipe(catchError(this.handleError));
  }

  getEquipamentos(): Observable<any[]> {
  return this.http.get<any[]>('https://byteassist-backend.fly.dev/api/equipment', this.getHttpOptions())
    .pipe(catchError(this.handleError));
}

  private handleError(error: HttpErrorResponse) {
    console.error('Erro da API:', error);
    return throwError(() => new Error(error.message || 'Erro ao se comunicar com o servidor.'));
  }
}
