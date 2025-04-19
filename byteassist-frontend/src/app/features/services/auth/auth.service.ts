import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { handleErrors } from '../../helpers/errors/handleErrors';
import { LoadingService } from '../utils/loading.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api';

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) { }

  // Faz a requisição para o endpoint login no backend
  login(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.loadingService.show(); // Exibe o loading
    return this.http.post(`${this.apiUrl}/auth/login`, body.toString(), { headers }).pipe(
      finalize(() => this.loadingService.hide()), // Esconde o loading após a requisição
      catchError(handleErrors.handleError)
    );
  }

  // Salva o token na localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Remove o token da localStorage
  removeToken(): void {
    localStorage.removeItem('token');
  }

  // Verifica se o usuário está autenticado (Vamos implementar um endpoint para fazer essa verificação e consumi-lo aqui)
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return !!token; // Retorna true se o token existir, false caso contrário
  }
}
