import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user/user.service';
import { User } from '../../shared/models/user.model';
import { NotificationComponent } from '../../components/notification/notification.component';
import { Router } from '@angular/router';
import { RecordIdPipe } from './../../shared/pipes/record-id.pipe';

@Component({
  selector: 'app-employees',
  imports: [
    CommonModule,
    NotificationComponent,
    RecordIdPipe
  ],
  templateUrl: './employees.component.html',
  styleUrl: './employees.component.css'
})
export class EmployeesComponent {
  message: string = '';
  showNotification: boolean = false;
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
    this.showNotification = false;

    this.userService.getAllUsersByRole("Employee").subscribe({
      next: (users) => {
        this.users = users;
        this.totalPages = Math.ceil(this.users.length / this.itemsPerPage);
        this.updatePaginatedUsers();
      },
      error: (error) => {
        console.error('Erro ao carregar os usuários:', error);
        this.message = 'Erro ao carregar os usuários.';
        this.showNotification = true;
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
