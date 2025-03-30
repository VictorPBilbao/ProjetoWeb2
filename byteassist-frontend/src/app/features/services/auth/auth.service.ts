import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // Faz a requisição para o endpoint login no backend
  login(username: string, password: string): Observable<any> {
    const body = { username, password };

    return this.http.post(`${this.apiUrl}/login`, body).pipe(
      catchError(this.handleError)
    );
  }

  // Trata o erro corretamente, colocar em outra classe, pois será utilizado em todas as requisições
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Erro desconhecido';

    if (error.error instanceof ErrorEvent) {
      // Erros do lado do cliente (ex: erro de rede, erro de validação)
      errorMessage = `Erro: ${error.error.message}`;
    } else {
      // Erros do lado do servidor (ex: backend offline, 500, 404)
      errorMessage = `Erro ${error.status}: ${error.message}`;
    }

    return throwError(() => new Error(errorMessage));
  }
}
