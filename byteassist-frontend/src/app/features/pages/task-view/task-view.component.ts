import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
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
import Swal from 'sweetalert2';

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
  private readonly router = inject(Router);
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
      this.comments.push(newComment);
      this.newCommentText = '';
    }
  }

  // badgeClass(): controla as cores do badge
  badgeClass(status: string | null | undefined): string {
    switch (status) {
      case 'ABERTA': return 'bg-secondary text-white';   // Cinza
      case 'ORÇADA': return 'bg-brown text-white';       // Marrom
      case 'REJEITADA': return 'bg-danger text-white';      // Vermelho
      case 'APROVADA': return 'bg-warning text-white';     // Amarelo
      case 'REDIRECIONADA': return 'bg-purple text-white';      // Roxo
      case 'ARRUMADA': return 'bg-primary text-white';     // Azul
      case 'PAGA': return 'bg-orange text-white';      // Alaranjado
      case 'FINALIZADA': return 'bg-success text-white';     // Verde
      default: return 'bg-light text-white';       // fallback claro
    }
  }

  // RF005: redireciona para tela de orçamentos
  onMostrarOrcamento(task: Task): void {
    this.router.navigate(['/orcamentos', task.id]); //não tem id(adriano vai alterar)
  }

  onResgatarServico(task: Task): void {
    if (!task.id) {
      console.error('Task sem ID, impossível resgatar.');
      return;
    }

    const now = new Date();
    const textoHist = `Serviço resgatado: REJEITADA → APROVADA em ${now.toLocaleString()}`;

    // Atualiza status no backend
    task.status = 'APROVADA'; // Atualiza o status para APROVADA
    this.taskService.updateTask(task)
      .subscribe({
        next: (updatedTask) => {
          // Reflete no front
          this.task = updatedTask;

          // 2Cria comentário “histórico”
          this.commentService.createComment({
            out: 'Task:' + task.id,
            comment: textoHist
          })
            .subscribe({
              next: (newComment: Comment) => {
                // Insere no topo da lista
                this.comments.unshift(newComment);

                Swal.fire({
                  icon: 'success',
                  title: 'Serviço resgatado',
                  text: textoHist,
                  timer: 2000
                });
              },
              error: (err) => {
                console.error('Erro ao adicionar comentário de histórico', err);
                task.status = 'REJEITADA'; // Reverte o status se falhar
                Swal.fire('Aviso', 'Status alterado, mas não foi possível registrar histórico', 'warning');
              }
            });
        },
        error: (err) => {
          console.error('Falha ao resgatar serviço', err);
          task.status = 'REJEITADA'; // Reverte o status se falhar
          Swal.fire('Erro', 'Não foi possível atualizar o status', 'error');
        }
      });
  }

  // RF010: paga serviço e redireciona
  onPagarServico(task: Task): void {
    Swal.fire({
      title: `Realize o pagamento!`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ir para Pagamentos'
    }).then(result => {
      if (result.isConfirmed) {
        this.router.navigate(['/pagamentos', task.id]);
      }
    });
  }
}
