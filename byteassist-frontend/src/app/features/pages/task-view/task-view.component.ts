import { RecordidService } from './../../services/utils/recordid.service';
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
import { Comment } from '../../shared/models/comment.model';
import { RecordIdPipe } from './../../shared/pipes/record-id.pipe';
import { AuthService } from '../../services/auth/auth.service';
import Swal from 'sweetalert2';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-task-view',
  standalone: true,
  // Use MarkdownModule.forRoot() here
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MarkdownModule,
    RecordIdPipe,
  ],
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.css'],
})
export class TaskViewComponent implements OnInit {
  /** Lista de status possíveis */
  public statusList = [
    'ABERTA',
    'ORÇADA',
    'APROVADA',
    'REJEITADA',
    'REDIRECIONADA',
    'ARRUMADA',
    'PAGA',
    'FINALIZADA',
  ];

  /** Flag que seu guard/authService define */
  public isFuncionario = false;

  task: Task | null = null;
  equipment: Equipment | null = null;
  budget: Budget | null = null;
  loading = true;
  error = false;
  comments: Comment[] = [];
  newCommentText: string = '';
  showManutencaoModal: boolean = false;
  descricaoManutencao: string = '';
  orientacoesCliente: string = '';
  public userRole: string | null = null;

  public funcionarios: string[] = [];
  public selectedAssignee: string = '';
  public rawFuncionarios: string[] = []; // contém ["User:tecnico1", …]
  public displayFuncionarios: string[] = []; // contém ["tecnico1", …]
  private readonly route = inject(ActivatedRoute);
  private readonly taskService = inject(TaskService);
  private readonly commentService = inject(CommentService);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly recordidService = inject(RecordidService);
  private readonly userService = inject(UserService);

  username: string = this.authService.getUsername() ?? '';

  ngOnInit(): void {

    this.userRole = this.userService.getUserRule();
    // this.isFuncionario = this.authService.hasRole('FUNCIONARIO');
    console.log('isFuncionario:', this.isFuncionario);

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

    // 3) aqui, chame a API de funcionários e preencha o combo
    this.userService.getAllEmployees().subscribe({
      next: (rawList) => {
        this.rawFuncionarios = rawList;

        // opcional: prepara uma lista só para exibir, mas não afeta o value
        this.displayFuncionarios = rawList.map((raw) =>
          raw.includes(':') ? raw.split(':')[1] : raw
        );
      },
      error: (err) => {
        console.error('Não foi possível buscar funcionários', err);
      },
    });
  }

  addComment(): void {
    if (this.newCommentText.trim() && this.task) {
      const newComment: Comment = {
        out: 'Task:' + this.route.snapshot.paramMap.get('taskId'),
        comment: this.newCommentText.trim(),
      };
      //* Faz a resuisição do comentário
      this.commentService.createComment(newComment).subscribe({
        next: (createdComment) => {
          this.comments.push(createdComment);
          this.newCommentText = '';
        },
        error: (err) => {
          console.error('Erro ao adicionar comentário', err);
          Swal.fire('Erro', 'Não foi possível adicionar o comentário', 'error');
        },
      });
    }
  }

  // Métodos para a modal de manutenção
  openManutencaoModal(): void {
    this.showManutencaoModal = true;
    // Limpar campos ao abrir a modal
    this.descricaoManutencao = '';
    this.orientacoesCliente = '';
  }

  closeManutencaoModal(): void {
    this.showManutencaoModal = false;
  }

  saveManutencao(): void {
    if (!this.descricaoManutencao.trim() || !this.task) {
      Swal.fire('Atenção', 'A descrição da manutenção é obrigatória.', 'warning');
      return;
    }

    const taskId = this.route.snapshot.paramMap.get('taskId');
    if (!taskId) {
      console.error('Task ID não encontrado para salvar a manutenção.');
      Swal.fire('Erro', 'ID da tarefa não encontrado.', 'error');
      return;
    }

    const tecnico = this.authService?.getUsername?.() || 'Técnico Desconhecido';
    const data = new Date().toLocaleString();

    let commentContent = `### ⚙️ Relatório Técnico - Byte Assist

A Byte Assist informa que foi realizada uma **intervenção técnica** no equipamento relacionado a esta solicitação.

🔧 **Descrição:** ${this.descricaoManutencao.trim()}

📌 **Orientações:** ${this.orientacoesCliente.trim() || 'Sem orientações.'}

---

👨‍🔧**Responsável:** ${tecnico}

📝 *Registro gerado automaticamente pelo sistema.*
`;

    const newComment: Comment = {
      out: 'Task:' + taskId,
      comment: commentContent,
    };

    this.commentService.createComment(newComment).subscribe({
      next: (createdComment) => {
        this.comments.push(createdComment);
        this.closeManutencaoModal();
        Swal.fire('Sucesso', 'Manutenção registrada com sucesso como comentário!', 'success');

        // Atualiza o status da tarefa para 'ARRUMADA'
        const updatedTaskPayload = {
          id: this.task?.id,
          status: 'ARRUMADA',
        };

        this.taskService.updateTask(updatedTaskPayload).subscribe({
          next: (updatedTask) => {
            this.task = updatedTask;
            Swal.fire('Sucesso', 'Status da tarefa atualizado para ARRUMADA.', 'success');
          },
          error: (err) => {
            console.error('Erro ao atualizar status para ARRUMADA:', err);
            Swal.fire('Erro', 'Não foi possível atualizar o status da tarefa para ARRUMADA.', 'error');
          },
        });
      },
      error: (err) => {
        console.error('Erro ao registrar manutenção:', err);
        Swal.fire('Erro', 'Não foi possível registrar a manutenção.', 'error');
      },
    });
  }

  // badgeClass(): controla as cores do badge
  badgeClass(status: string | null | undefined): string {
    switch (status) {
      case 'ABERTA':
        return 'bg-secondary text-white'; // Cinza
      case 'ORÇADA':
        return 'bg-brown text-white'; // Marrom
      case 'REJEITADA':
        return 'bg-danger text-white'; // Vermelho
      case 'APROVADA':
        return 'bg-warning text-white'; // Amarelo
      case 'REDIRECIONADA':
        return 'bg-purple text-white'; // Roxo
      case 'ARRUMADA':
        return 'bg-primary text-white'; // Azul
      case 'PAGA':
        return 'bg-orange text-white'; // Alaranjado
      case 'FINALIZADA':
        return 'bg-success text-white'; // Verde
      default:
        return 'bg-light text-white'; // fallback claro
    }
  }

  // RF005: redireciona para tela de orçamentos
  onMostrarOrcamento(task: Task): void {
    this.router.navigate([
      '/orcamentos',
      this.route.snapshot.paramMap.get('taskId'),
    ]);
  }

  // onResgatarServico(task: Task): void {
  //   if (!task.id) {
  //     console.error('Task sem ID, impossível resgatar.');
  //     return;
  //   }

  //   task.status = 'APROVADA'; // Atualiza o status para APROVADA
  //   this.taskService.updateTask(task).subscribe({
  //     next: (updatedTask) => {
  //       // Reflete no front
  //       this.task = updatedTask;
  //     },
  //     error: (err) => {
  //       console.error('Falha ao resgatar serviço', err);
  //       task.status = 'REJEITADA'; // Reverte o status se falhar
  //       Swal.fire('Erro', 'Não foi possível atualizar o status', 'error');
  //     },
  //   });
  // }

  onResgatarServico(task: Task): void {
    if (!task.id) {
      console.error('Task sem ID, impossível resgatar.');
      return;
    }

    const updatedTaskPayload = {
      id: task.id,
      status: 'APROVADA', // O status que você quer enviar ao backend
    };

    this.taskService.updateTask(updatedTaskPayload).subscribe({
      next: (updatedTask) => {

        this.task = updatedTask;
        Swal.fire('Sucesso', 'Serviço resgatado e status atualizado para APROVADA.', 'success');

        // this.router.navigate(['/sua-rota-de-redirecionamento']);
      },
      error: (err) => {
        console.error('Falha ao resgatar serviço', err);

        Swal.fire('Erro', 'Não foi possível resgatar o serviço.', 'error');
      },
    });
  }

  // RF010: paga serviço e redireciona
  onPagarServico(task: Task): void {
    Swal.fire({
      title: `Realize o pagamento!`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Ir para Pagamentos',
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate([
          '/pagamentos',
          this.recordidService.getId(task.id ?? ''),
        ]);
      }
    });
  }

  public onAssigneeChange(): void {
    if (!this.task || !this.selectedAssignee) {
      return;
    }

    const selectedUsername = this.recordidService.getId(this.selectedAssignee);

    if (selectedUsername === this.username) {
      Swal.fire(
        'Atenção',
        'Você não pode redirecionar a solicitação a si mesmo. Selecione outro responsável.',
        'warning'
      );

      return;
    }

    const updatedTask = {
      id: this.task.id,
      assignee: this.selectedAssignee,
      status: 'REDIRECIONADA',
    };

    this.taskService.updateTask(updatedTask).subscribe({
      next: (t) => {
        this.task = t; // Atualiza no front
        Swal.fire('Sucesso', 'Responsável atribuído.', 'success').then(() => {
          // this.router.navigate(['solicitacao/:taskId']);
        });
      },
      error: () => {
        Swal.fire('Erro', 'Não foi possível atribuir responsável.', 'error');
      },
    });
  }

  //método que vai redirecionar para a tela de orçamento
  public onOrcarSolicitacao(task: Task): void {
    this.router.navigate(['funcionario/orcamentos/', this.recordidService.getId(task.id ?? '')]);
  }

  public onStatusChange(newStatus: string): void {
    if (!this.task) { return };

    // Prepara o payload com o novo status
    const updatedTask: Task = {
      id: this.task.id,
      status: newStatus,
    };

    this.taskService.updateTask(updatedTask).subscribe({
      next: (t) => {
        // assume que o back-end retorna o objeto completo
        this.task = t;
        Swal.fire('Sucesso', `Status atualizado para ${newStatus}.`, 'success');
      },
      error: () => {
        Swal.fire('Erro', 'Não foi possível atualizar o status.', 'error');
      },
    });
  }

  onFinalizarServico(task: Task): void {
    if (!task.id) {
      console.error('Task sem ID, impossível finalizar.');
      Swal.fire('Erro', 'ID da tarefa não encontrado.', 'error');
      return;
    }

    const updatedTaskPayload = {
      id: task.id,
      status: 'FINALIZADA', // Novo status
    };

    this.taskService.updateTask(updatedTaskPayload).subscribe({
      next: (updatedTask) => {
        this.task = updatedTask; // Atualiza a tarefa no frontend
        Swal.fire('Sucesso', 'Status da tarefa atualizado para FINALIZADA.', 'success');
      },
      error: (err) => {
        console.error('Falha ao finalizar serviço:', err);
        Swal.fire('Erro', 'Não foi possível finalizar o serviço.', 'error');
      },
    });
  }

  public onAssignToMe(): void {
    if (!this.task || !this.task.id) {
      console.error('Task ou Task ID não encontrado para atribuição.');
      Swal.fire('Erro', 'Tarefa não disponível para atribuição.', 'error');
      return;
    }

    if (this.task.assignee && this.task.assignee.trim() !== '') {
      Swal.fire(
        'Atenção',
        'Já existe um responsável atribuído. ' +
        'Use o botão "Redirecionar" para transferi-la.',
        'warning'
      );
      return;
    }

    const assigneeValue = `User:${this.username}`; // Formato Record ID para o usuário logado

    const updatedTaskPayload = {
      id: this.task.id,
      assignee: assigneeValue, // Atribui a si mesmo
    };

    this.taskService.updateTask(updatedTaskPayload).subscribe({
      next: (t) => {
        this.task = t; // Atualiza a task no front com os dados retornados
        this.selectedAssignee = assigneeValue; // Atualiza o combobox para refletir a mudança
        Swal.fire('Sucesso', 'Tarefa atribuída a você.', 'success');
      },
      error: (err) => {
        console.error('Erro ao atribuir tarefa a si mesmo:', err);
        Swal.fire('Erro', 'Não foi possível atribuir a tarefa a você.', 'error');
      },
    });
  }

}
