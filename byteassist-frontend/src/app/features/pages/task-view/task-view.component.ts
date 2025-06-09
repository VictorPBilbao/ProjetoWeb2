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

@Component({
  selector: 'app-task-view',
  standalone: true,
  // Use MarkdownModule.forRoot() here
  imports: [CommonModule, RouterModule, FormsModule, MarkdownModule],
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css'],
})
export class TaskViewComponent implements OnInit {
  task: Task | null = null;
  equipment: Equipment | null = null;
  budget: Budget | null = null;
  loading = true;
  error = false;
  comments = [
    {
      author: 'Victor Bilbao',
    },
    {
      author: 'Maria Silva',
      date: new Date(),
      text: 'Outro comentário mock com *itálico*.',
    },
  ];
  newCommentText: string = '';

  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly commentService = inject(CommentService);

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
  }

  addComment(): void {
    if (this.newCommentText.trim() && this.task) {
      const newComment = {
        author: 'Usuário Atual (mock)',
        date: new Date(),
        text: this.newCommentText.trim(),
      };
      this.comments.push(newComment);
      this.newCommentText = '';
    }
  }
}
