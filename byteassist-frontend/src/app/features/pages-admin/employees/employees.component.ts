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

  constructor(
    private readonly userService: UserService,
    private readonly route: Router
  ) {}

  ngOnInit() {
    this.showNotification = false;

    this.userService.getAllUsersByRole("Employee").subscribe({
      next: (users) => {
        this.users = users;
        console.log('Usuários encontrados:', this.users);
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
}
