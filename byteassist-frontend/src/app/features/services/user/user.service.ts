import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { handleErrors } from '../../helpers/errors/handleErrors';
import { LoadingService } from '../utils/loading.service';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api';

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private authService: AuthService
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
    expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000); // Expira em 7 dias
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

  getInfoUser(): Observable<User> {
    // Usuário completamente preenchido (mock)
    const mockUser = new User(
      '123e4567-e89b-12d3-a456-426614174000',
      'johndoe',
      '',
      'John Doe',
      '123.456.789-00',
      new Date(1990, 4, 15),
      'M',
      'john.doe@example.com',
      '(11) 91234-5678',
      '01001-000',
      'SP',
      'São Paulo',
      'Centro',
      'Praça da Sé',
      '100',
      'Apto 101',
      'BR'
    );

    return of(mockUser);
  }

  // Vai substuir o método getInfoUser
  getPersonByToken<T>(): Observable<T> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${this.authService.getToken()}` // Adiciona o token no header
    })

    return this.http.get<T>(`${this.apiUrl}/person/me`, { headers }).pipe(
      catchError(handleErrors.handleError)
    );
  }

  getInfoUserV2(): Observable<User> {
    return this.getPersonByToken<any>().pipe(
      map(data => new User(
        data.id,
        '',
        '',
        `${data.name.first} ${data.name.last}`,
        data.cpf,
        data.dob.split('T')[0],
        data.gender,
        '',
        '',
        data.address.zip,
        data.address.state,
        data.address.city,
        data.address.neighborhood,
        data.address.street,
        data.address.number,
        '',
        data.address.country
      )),
      catchError(handleErrors.handleError)
    );
  }

  getUser(): Observable<User> {
    return this.getInfoUserV2();
  }

  updateUser(user: User): Observable<any> {
    const userApiFormat = this.mapUserToApiFormat(user);
    const body = new HttpParams()
      .set('user', JSON.stringify(userApiFormat));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${this.authService.getToken()}` // Adiciona o token no header
    });

    this.loadingService.show(); // Exibe o loading

    return this.http.put(`${this.apiUrl}/user`, body.toString(), { headers }).pipe(
      finalize(() => this.loadingService.hide()), // Esconde o loading após a requisição
      catchError(handleErrors.handleError)
    );
  }

  private mapUserToApiFormat(user: User): any {
    return {
      id: user.id,
      cpf: user.cpf,
      dob: user.dateOfBirth.toISOString().split('T')[0], // Formato 'YYYY-MM-DD'
      gender: user.gender,
      address: {
        zip: user.zip,
        number: user.number,
        street: user.street,
        neighborhood: user.neighborhood,
        city: user.city,
        state: user.state,
        country: user.country
      },
      name: {
        first: user.fullName.split(' ')[0],
        last: user.fullName.split(' ').slice(1).join(' ')
      }
    };
  }
}
