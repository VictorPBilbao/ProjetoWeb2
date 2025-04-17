import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../components/notification/notification.component';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    NotificationComponent,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm: NgForm | undefined;
  user: User = new User();
  message: string = '';
  showNotification: boolean = false;
  currentStep: number = 1; // Variável para controlar o passo atual do formulário

  constructor(
    private router: Router,
    private userService: UserService) {}

  onSubmit() {
    if (this.registerForm?.valid) {
      this.userService.createUser(this.user).subscribe({
        next: (response) => {
          if (response) {
            this.message = 'Cadastro realizado com sucesso!';
            this.router.navigate(['/login']);
          } else {
            this.message = 'Erro ao fazer cadastro. Verifique sua conexão ou tente novamente mais tarde.';
          }
          this.showNotification = true;
        },
        error: (err) => {
          this.message = 'Ocorreu um erro ao fazer o cadastro. Erro: ' + (err.error?.message || 'Erro desconhecido.');
          this.showNotification = true;
        }
      });
    } else {
      this.message = 'Preencha todos os campos obrigatórios.';
      this.showNotification = true;
    }
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']); // Redireciona para a página de login
  }

  goToNextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }
}
