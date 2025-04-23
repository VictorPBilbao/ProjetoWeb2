import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { handleErrors } from '../../helpers/errors/handleErrors';
import { LoadingService } from '../utils/loading.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api';

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
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
  getUserRule(userId: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.get(`${this.apiUrl}/user/${userId}`, { headers }).pipe(
      catchError(handleErrors.handleError)
    );
  }
}
