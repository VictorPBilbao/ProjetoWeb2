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
  private readonly apiUrl = 'https://byteassist-backend.fly.dev';

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
    return this.http.post(`${this.apiUrl}/api/auth/login`, body.toString(), { headers }).pipe(
      finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
      // catchError(handleErrors.handleError)
    );
  }

  // Salva o token em um cookie
  saveToken(token: string): void {
    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // Expira em 24 horas
    document.cookie = `token=${token}; path=/; secure; samesite=strict; expires=${expires.toUTCString()}`;
  }

  // Remove o token do cookie
  removeToken(): void {
    document.cookie = 'token=; path=/; secure; samesite=strict; expires=Thu, 01 Jan 1970 00:00:00 UTC;';
  }

  getToken(): string | null {
    const cookies = document.cookie.split(';'); // Divide os cookies em um array
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('='); // Divide cada cookie em chave e valor
      if (key === 'token') {
        return value; // Retorna o valor do token se encontrado
      }
    }
    return null; // Retorna null se o token não for encontrado
  }

  // Verifica se o usuário está autenticado (Vamos implementar um endpoint para fazer essa verificação e consumi-lo aqui)
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }
}
