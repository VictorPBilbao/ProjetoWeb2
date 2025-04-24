import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule para usar formulários reativos
import { CommonModule } from '@angular/common'; // Importa o CommonModule para usar ngIf e ngFor no template
import { NotificationComponent } from '../../components/notification/notification.component'; // Importa o componente de notificação
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificationComponent
  ], // Importa os módulos necessários
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message: string = '';
  showNotification: boolean = false;

  constructor (
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private userService: UserService) { }

  ngOnInit(): void {
    // Cria o formulário de login com campos e validações
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  // Método para verificar se o campo está inválido
  isFieldInvalid(field: string): boolean {
    return !!this.loginForm.get(field)?.invalid && !!this.loginForm.get(field)?.touched;
  }

  getErrorMessage(field: string): string {
    if (field === 'username') {
      if (this.loginForm.get(field)?.hasError('required')) return 'Usuário é obrigatório';
    }

    if (field === 'password') {
      if (this.loginForm.get(field)?.hasError('required')) return 'Senha é obrigatória';
    }

    return '';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.showNotification = false;

      this.auth.login(this.loginForm.value.username, this.loginForm.value.password).subscribe({
        next: (response) => {
          if (response && response.id && response.token != "") {
            try {
              this.auth.saveToken(response.token);
              this.userService.saveUserRule(response.username);

              (this.userService.getUserRule() === 'RULE_EMPLOYEE') ?
                this.router.navigate(['/funcionario/solicitacoes']) :
                  this.router.navigate(['/dashboard']);
            } catch (error) {
              throw error;
            }
          } else {
            this.message = 'Erro ao fazer login. Verifique sua conexão ou tente novamente mais tarde.';
          }
          this.showNotification = true;
        },
        error: (err) => {
          if (err.status === 401) {
            this.message = err.error?.message || 'Erro ao fazer login. Verifique sua conexão ou tente novamente mais tarde.';
          } else {
            this.message = 'Erro ao fazer login. Verifique sua conexão ou tente novamente mais tarde.';
          }
          this.showNotification = true;
        }
      });

    } else {
      this.loginForm.markAllAsTouched();
      console.log('Form is invalid', this.loginForm);
    }
  }
}
