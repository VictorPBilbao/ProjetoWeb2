import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule para usar formulários reativos
import { CommonModule } from '@angular/common'; // Importa o CommonModule para usar ngIf e ngFor no template
import { NotificationComponent } from '../../components/notification/notification.component'; // Importa o componente de notificação
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificationComponent,
    AuthService
  ], // Importa os módulos necessários
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message: string = '';
  showNotification: boolean = false;

  constructor (private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    // Cria o formulário de login com campos e validações
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(10)]],
      password: ['', [Validators.required, Validators.minLength(8)]],
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
      // Chama a service de login
      try {
        this.auth.login(this.loginForm.value.username, this.loginForm.value.password);
      } catch (error) {
        if (error instanceof Error) {
          this.message = error.message;
        } else {
          this.message = 'Erro desconhecido'; // Caso o erro não seja uma instância de Error
        }
      }

    } else {
      this.loginForm.markAllAsTouched(); // Marca todos os campos como tocados para mostrar as mensagens de erro
      console.log('Form is invalid', this.loginForm);
    }
  }
}
