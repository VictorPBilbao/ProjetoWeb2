import { Injectable } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { handleErrors } from '../../helpers/errors/handleErrors';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api'

  constructor(private http: HttpClient) { }

  // Método para criar um novo usuário
  createUser(user: User): Observable<any> {
    const body = new HttpParams()
      .set('user', JSON.stringify(user));

    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    return this.http.post(`${this.apiUrl}/auth/login`, body.toString(), { headers }).pipe(
      catchError(handleErrors.handleError)
    );
  }
}
