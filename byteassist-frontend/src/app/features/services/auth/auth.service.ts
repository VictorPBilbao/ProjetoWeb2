import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleErrors } from '../../helpers/errors/handleErrors';

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
      catchError(handleErrors.handleError)
    );
  }
}
