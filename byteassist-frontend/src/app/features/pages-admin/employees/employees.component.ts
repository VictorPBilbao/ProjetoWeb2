import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { User } from '../../shared/models/user.model';
import { Router } from '@angular/router';
import { RecordIdPipe } from './../../shared/pipes/record-id.pipe';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    RecordIdPipe
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {
  message: string = '';
  users: User[] = [];
  paginatedUsers: User[] = []; // usuários visíveis na página atual
  currentPage: number = 1;
  itemsPerPage: number = 6; // você pode ajustar esse valor
  totalPages: number = 0;

  constructor(
    private readonly userService: UserService,
    private readonly route: Router
  ) {}

  ngOnInit() {
    this.userService.getAllUsersByRole("Employee").subscribe({
      next: (users) => {
        this.users = users;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updatePaginatedUsers();
      },
      error: (error) => {
        console.error('Erro ao carregar os usuários:', error);
        this.message = 'Erro ao carregar os usuários.';
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: this.message,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  visualizeUser(userId: string) {
    this.route.navigate(['/admin/funcionario', userId]);
  }

  sortByNameAsc(): void {
    this.paginatedUsers.sort((a, b) => {
      const nameA = `${a.person.name.first} ${a.person.name.last}`.toLowerCase();
      const nameB = `${b.person.name.first} ${b.person.name.last}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }

  sortByNameDesc(): void {
    this.paginatedUsers.sort((a, b) => {
      const nameA = `${a.person.name.first} ${a.person.name.last}`.toLowerCase();
      const nameB = `${b.person.name.first} ${b.person.name.last}`.toLowerCase();
      return nameB.localeCompare(nameA);
    });
  }

  createNewEmployee() {
    console.log('Navegando para a página de cadastro de funcionário');
    this.route.navigate(['/admin/cadastrar-funcionario']);
  }

  updatePaginatedUsers(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedUsers = this.users.slice(start, end);
  }

  deleteUser(userId: string): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você não poderá reverter isso!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sim, excluir!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe({
          next: (user) => {
            if (!user.id) {
              Swal.fire(
                'Erro!',
                'Usuário não encontrado.',
                'error'
              );
              return;
            }

            Swal.fire(
              'Excluído!',
              'O usuário foi excluído com sucesso.',
              'success'
            );

            this.route.navigate(['/admin/funcionarios']);
          },
          error: (error) => {
            console.error('Erro ao excluir o usuário:', error);
            Swal.fire(
              'Erro!',
              'Não foi possível excluir o usuário.',
              'error'
            );
          }
        });
      }
    });
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedUsers();
    }
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedUsers();
    }
  }
}
