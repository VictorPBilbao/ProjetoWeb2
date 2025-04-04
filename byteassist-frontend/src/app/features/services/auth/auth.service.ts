import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleErrors } from '../../helpers/errors/handleErrors';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api';

  constructor(private http: HttpClient) { }

  // Faz a requisição para o endpoint login no backend
  login(username: string, password: string): Observable<any> {
    const body = new HttpParams()
      .set('username', username)
      .set('password', password);

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${this.apiUrl}/auth/login`, body.toString(), { headers }).pipe(
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


  // Faz a requisição para o endpoint register no backend
  register(userData: { username: string; email: string; password: string }): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post(`${this.apiUrl}/auth/register`, JSON.stringify(userData), { headers }).pipe(
      catchError(handleErrors.handleError)
    );
  }
}
