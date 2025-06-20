import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';
import { handleErrors } from '../../helpers/errors/handleErrors';
import { LoadingService } from '../utils/loading.service';
import { AuthService } from '../auth/auth.service';
import { User } from '../../shared/models/user.model';
import { Person } from '../../shared/models/person.model';
import { PersonAddress } from '../../shared/models/person-address.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiUrl = 'https://byteassist-backend.fly.dev';

  constructor(
    private readonly http: HttpClient,
    private readonly loadingService: LoadingService,
    private readonly authService: AuthService
  ) {}

  // Método para criar um novo usuário
  createUser(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const newUserPayload = {
      password: user.password,
      email: user.email,
      person: {
        cpf: user.person.cpf,
        dob: user.person.dob,
        gender: user.person.gender,
        phone: user.person.phone,
        address: {
          zip: user.person.address.zip,
          number: user.person.address.number,
          street: user.person.address.street,
          neighborhood: user.person.address.neighborhood,
          complement: user.person.address.complement || '',
          city: user.person.address.city,
          state: user.person.address.state,
          country: user.person.address.country,
        },
        name: {
          first: user.person.name.first,
          last: user.person.name.last,
        },
      },
    };

    this.loadingService.show(); // Exibe o loading
    console.log('Payload do novo usuário:', newUserPayload);
    return this.http
      .post(
        `${this.apiUrl}/api/auth/register/${user.username}`,
        newUserPayload,
        { headers }
      )
      .pipe(
        finalize(() => this.loadingService.hide()), // Esconde o loading após a requisição
        catchError(handleErrors.handleError)
      );
  }

  // getUseRuleTemporaria
  saveUserRule(): Observable<void> {
    return this.getUser().pipe(
      tap((user) => {
        if (!user) {
          throw new Error('Usuário não encontrado');
        }

        let rule: string;

        if (user.role === 'Employee' || user.role === 'Manager') {
          rule = 'RULE_EMPLOYEE';
        } else if (user.role === 'Admin') {
          rule = 'RULE_ADMIN';
        } else if (user.role === 'Client') {
          rule = 'RULE_CLIENT';
        } else {
          rule = 'RULE_CLIENT';
        }

        const expires = new Date();
        expires.setTime(expires.getTime() + 24 * 60 * 60 * 1000); // 24 horas

        document.cookie = `rule=${rule}; path=/; secure; samesite=strict; expires=${expires.toUTCString()}`;
      }),
      map(() => void 0), // transforma o resultado para void
      catchError((err) =>
        throwError(() => new Error('Erro ao obter usuário: ' + err))
      )
    );
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
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    let params = new HttpParams();
    if (expand) {
      params = params.set('expand', expand);
    }

    return this.http
      .get<T>(`${this.apiUrl}/api/user/me`, { headers, params })
      .pipe(catchError(handleErrors.handleError));
  }

  getUser(): Observable<User> {
    return this.getPersonByToken<User>('person');
  }

  updateUser(user: User): Observable<User> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getToken()}`, // Adiciona o token no header
    });

    const userPayload = {
      email: user.email,
    };

    this.loadingService.show(); // Exibe o loading

    return this.http
      .patch<User>(`${this.apiUrl}/api/user/${user.username}`, userPayload, {
        headers,
      })
      .pipe(
        finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
      );
  }

  updatePerson(person: Person, username: string): Observable<Person> {
    const personPayload = {
      cpf: person.cpf,
      dob: person.dob,
      gender: person.gender,
      address: person.address,
      name: person.name,
    };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.authService.getToken()}`, // Adiciona o token no header
    });

    this.loadingService.show(); // Exibe o loading

    return this.http
      .patch<Person>(`${this.apiUrl}/api/person/${username}`, personPayload, {
        headers,
      })
      .pipe(
        finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
      );
  }

  removeRule(): void {
    const expires = new Date();
    expires.setTime(expires.getTime() - 1); // Define a data de expiração para o passado
    document.cookie = `rule=; path=/; secure; samesite=strict; expires=${expires.toUTCString()}`; // Remove o cookie
  }

  // valid o cep do usuário
  validateCep(cep: string): Observable<PersonAddress> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.loadingService.show(); // Exibe o loading

    return this.http
      .get<any>(`https://viacep.com.br/ws/${cep}/json/`, { headers })
      .pipe(
        map((data) => {
          if (data.erro) {
            throw new Error('CEP inválido');
          }
          return this.mapToPersonAddress(data);
        }),
        finalize(() => this.loadingService.hide()), // Esconde o loading após a requisição
        catchError((err) => {
          return throwError(
            () => new Error('Erro ao validar CEP: ' + err.message)
          );
        })
      );
  }

  mapToPersonAddress(data: any): PersonAddress {
    console.log('Dados do CEP:', data);
    return {
      zip: data.cep,
      number: '',
      street: data.logradouro,
      neighborhood: data.bairro,
      complement: data.complemento || '',
      city: data.localidade,
      state: data.uf,
      country: 'Brasil',
    };
  }

  // Método para validar o nome de usuário
  validateUsername(username: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.loadingService.show(); // Exibe o loading

    return this.http
      .get<any>(`${this.apiUrl}/api/auth/validate/username/${username}`, {
        headers,
      })
      .pipe(
        finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
      );
  }

  // Valida o email do usuário
  validateEmail(email: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.loadingService.show(); // Exibe o loading

    return this.http
      .get<any>(`${this.apiUrl}/api/auth/validate/email/${email}`, { headers })
      .pipe(
        finalize(() => this.loadingService.hide()) // Esconde o loading após a requisição
      );
  }

  getAllEmployees(): Observable<string[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    this.loadingService.show(); // Exibe o loading

    return this.http.get<string[]>(`${this.apiUrl}/api/user/getAllEmployees`, { headers })
      .pipe(
        finalize(() => this.loadingService.hide()), // Esconde o loading após a requisição
        catchError((err) => {
          return throwError(
            () => new Error('Erro ao buscar funcionários: ' + err.message)
          );
        })
      );
  }
}
