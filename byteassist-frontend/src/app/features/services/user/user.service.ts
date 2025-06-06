import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { handleErrors } from '../../helpers/errors/handleErrors';
import { LoadingService } from '../utils/loading.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api';

  constructor(
    private readonly http: HttpClient,
    private readonly loadingService: LoadingService,
    private readonly authService: AuthService
  ) { }

  // Método para criar um novo usuário
  createUser(user: User): Observable<any> {
    const body = new HttpParams()
      .set('user', JSON.stringify(user));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    this.loadingService.show(); // Exibe o loading

    console.log('body', body.toString());
    return this.http.post(`${this.apiUrl}/auth/register`, body.toString(), { headers }).pipe(
      finalize(() => this.loadingService.hide()), // Esconde o loading após a requisição
      catchError(handleErrors.handleError)
    );
  }

  // getUseRuleTemporaria
  saveUserRule(rule: string): void {
    // Temporario, na versão final é preciso passar a rule mesmo
    rule = (rule === 'thalitasanttos77') ? 'RULE_EMPLOYEE' : 'RULE_CLIENT';

    const expires = new Date();
    expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // Expira em 24 horas
    document.cookie = `rule=${rule}; path=/; secure; samesite=strict; expires=${expires.toUTCString()}`;
  }

  getUserRule(): string | null {
    const cookies = document.cookie.split(';'); // Divide os cookies em um array
    for (const cookie of cookies) {
      const [key, value] = cookie.trim().split('='); // Divide cada cookie em chave e valor
      if (key === 'rule') {
        console.log('cookie', value);
        return value; // Retorna o valor do token se encontrado
      }
    }

    return null; // Retorna null se o token não for encontrado
  }

  // Vai substuir o método getInfoUser
  getPersonByToken<T>(expand?: string): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${this.authService.getToken()}`
    });

    let params = new HttpParams();
    if (expand) {
      params = params.set('expand', expand);
    }

    return this.http.get<T>(`${this.apiUrl}/person/me`, { headers, params }).pipe(
      catchError(handleErrors.handleError)
    );
  }

  getUser(): Observable<User> {
    return this.getPersonByToken<User>('person');
  }

  updateUser(user: User): Observable<User> {
    const body = new HttpParams()
      .set('user', JSON.stringify(user));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${this.authService.getToken()}` // Adiciona o token no header
    });

    this.loadingService.show(); // Exibe o loading

    return this.http.put<User>(`${this.apiUrl}/user`, body.toString(), { headers }).pipe(
      finalize(() => this.loadingService.hide()), // Esconde o loading após a requisição
      catchError(handleErrors.handleError)
    );
  }
}
