import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../services/user/user.service';
import { NotificationComponent } from '../../components/notification/notification.component';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    FormsModule,
    NotificationComponent,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  @ViewChild('userForm') userForm!: NgForm | undefined;
  user: User = {} as User;
  message: string = '';
  showNotification: boolean = false;
  isAdmin: boolean = false;
  userId: string = '';

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.isAdmin = this.userService.getUserRule() === 'RULE_ADMIN';

    if (this.isAdmin) {
      this.userId = this.route.snapshot.paramMap.get('id') ?? '';
      this.userService.getUserById(this.userId).subscribe({
        next: (user: User) => {
          this.user = user;
        },
        error: (error: any) => {
          console.error('Error fetching user by ID', error);
          this.message = 'Erro ao carregar usuário!';
          this.showNotification = true;
        }
      });
    } else {
      this.userService.getUser().subscribe((user: User) => {
        this.user = user;
      });
    }
  }

  onSubmit() {
    this.showNotification = false;
    if (this.userForm?.valid) {
      this.userService.updatePerson(this.user.person, this.user.username).subscribe({
        next: (response: any) => {
          console.log('User updated successfully', response);
          this.message = 'Informações atualizadas com sucesso!';
          this.showNotification = true;
        },
        error: (error: any) => {
          console.error('Error updating user', error);
          // Verifica se error.error.message está definido
          this.message = 'Erro ao atualizar informações!' + (error.error?.message || '');
          this.showNotification = true;
          return;
        }
      });

      this.userService.updateUser(this.user).subscribe({
        next: (response: any) => {
          console.log('User updated successfully', response);
          this.message = 'Usuário atualizado com sucesso!';
          this.showNotification = true;
        },
        error: (error: any) => {
          console.error('Error updating user', error);
          // Verifica se error.error.message está definido
          this.message = 'Erro ao atualizar usuário!' + (error.error?.message || '');
          this.showNotification = true;
        }
      });
    } else {
      this.message = 'Preencha todos os campos corretamente!';
      this.showNotification = true;
    }
  }

  onCancel() {
    this.showNotification = false;
    if (this.isAdmin) {
      this.router.navigate(['/admin/funcionarios']);
    } else {
      this.router.navigate(['/minha-conta']);
    }
  }
}
