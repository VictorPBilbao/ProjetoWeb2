import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// Import MarkdownModule like this
import { MarkdownModule } from 'ngx-markdown';

import { TaskService } from '../../services/task/task.service';
import { Task } from '../../shared/models/task.model';
import { Equipment } from '../../shared/models/equipment.model';
import { Budget } from '../../shared/models/budget.model';
import { CommentService } from '../../services/comment/comment.service';
import { BudgetService } from '../../services/budget/budget.service'; // Added import
import { Comment } from '../../shared/models/comment.model';
import { RecordIdPipe } from './../../shared/pipes/record-id.pipe';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-task-view',
  standalone: true,
  // Use MarkdownModule.forRoot() here
  imports: [CommonModule, RouterModule, FormsModule, MarkdownModule, RecordIdPipe],
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css'],
})
export class TaskViewComponent implements OnInit {
  task: Task | null = null;
  equipment: Equipment | null = null;
  budget: Budget | null = null;
  loading = true;
  error = false;
  comments: Comment[] = [];
  newCommentText: string = '';

  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly commentService = inject(CommentService);
  private readonly authService = inject(AuthService);

  username: string = this.authService.getUsername() ?? '';

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    if (taskId) {
      this.taskService.getTaskById(taskId, 'equipment').subscribe({
        next: (task: Task) => {
          this.task = task;
          this.equipment =
            typeof task.equipment === 'object' ? task.equipment : null;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = true;
        },
      });
    } else {
      this.loading = false;
      this.error = true;
    }

    //* fetch comments from the comment service
    this.commentService.getComments(taskId ?? '').subscribe({
      next: (comments) => {
        this.comments = comments;
      },
      error: () => {
        console.error('Error fetching comments');
      },
    });
  }

  addComment(): void {
    if (this.newCommentText.trim() && this.task) {
      const newComment: Comment = {
        out: 'Task:' + this.route.snapshot.paramMap.get('taskId'),
        comment: this.newCommentText.trim(),
      };
      if (newComment.out === undefined) {
        console.error('Task ID is undefined, cannot add comment');
        return;
      }
      // in should be the current user's ID or username, get it from the auth service or similar

      this.commentService.createComment(newComment).subscribe({
        next: () => {
          newComment.in = this.username;
            const now = new Date();
            now.setHours(now.getHours() + 3);
            newComment.comment_date = now;
          this.comments.push(newComment);
          this.newCommentText = '';
        },
      });
    }
  }
}
