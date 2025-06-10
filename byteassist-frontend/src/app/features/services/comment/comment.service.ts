import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';
import { Comment } from '../../shared/models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private readonly authService = inject(AuthService);
  private readonly token = this.authService.getToken();
  private readonly apiUrl = 'https://byteassist-backend.fly.dev/api';

  public createComment(taskId: string, commentText: string): Observable<Comment> {
    const body = { text: commentText };
    return this.http.post<Comment>(`${this.apiUrl}/comment/${taskId}`, body, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });
  }

  public getComments(taskId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/comment/${taskId}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
    });
  }
}
