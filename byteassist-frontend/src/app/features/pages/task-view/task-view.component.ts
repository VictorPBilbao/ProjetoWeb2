import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TaskService } from '../../services/task/task.service';
import { Task } from '../../shared/models/task.model';
import { Equipment } from '../../shared/models/equipment.model';

@Component({
  selector: 'app-task-view',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css']
})
export class TaskViewComponent implements OnInit {
  task: Task | null = null;
  equipment: Equipment | null = null;
  loading = true;
  error = false;
  comments = [
    { author: 'Victor Bilbao', date: new Date(), text: 'Primeiro comentário de exemplo.' },
    { author: 'Maria Silva', date: new Date(), text: 'Outro comentário mock.' }
  ];

  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);

  ngOnInit(): void {
    const taskId = this.route.snapshot.paramMap.get('taskId');
    if (taskId) {
      this.taskService.getTaskById(taskId, 'equipment').subscribe({
        next: (task: Task) => {
          this.task = task;
          this.equipment = typeof task.equipment === 'object' ? task.equipment : null;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
          this.error = true;
        }
      });
    } else {
      this.loading = false;
      this.error = true;
    }
  }
}
