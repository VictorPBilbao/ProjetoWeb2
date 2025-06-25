import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms'; // Importa ReactiveFormsModule para usar formulários reativos
import { CommonModule } from '@angular/common'; // Importa o CommonModule para usar ngIf e ngFor no template
import { tap, concatMap } from 'rxjs/operators';
import { AuthService } from '../../services/auth/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import confetti from 'canvas-confetti'
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ], // Importa os módulos necessários
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  message: string = '';

  constructor (
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService) { }

  ngOnInit(): void {
    const isRegisterSuccess = this.route.snapshot.paramMap.get('isRegisterSuccess');
    if (isRegisterSuccess === '1') {
      Swal.fire({
        title: 'Cadastro realizado com sucesso!',
        text: 'Faça login para continuar.',
        icon: 'success',
        confirmButtonText: 'OK'
      });

      this.launchConfetti(); // Lança confete se o cadastro foi bem-sucedido
    }

    // Cria o formulário de login com campos e validações
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    this.route.queryParamMap.subscribe(params => {
      this.message = params.get('error') ?? '';
      if (!!this.message) {
        Swal.fire({
          title: 'Erro',
          text: this.message,
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  launchConfetti() {
    confetti({
      particleCount: 500,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff0000', '#00ff00', '#0000ff'],
      zIndex: 1060
    })
  }

  // Método para verificar se o campo está inválido
  isFieldInvalid(field: string): boolean {
    return !!this.loginForm.get(field)?.invalid && !!this.loginForm.get(field)?.touched;
  }

  // Método para obter a mensagem de erro do campo
  getErrorMessage(field: string): string {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório`;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.auth.login(this.loginForm.value.username, this.loginForm.value.password).pipe(
        tap(response => {
          if (response && response.id && response.token != "") {
            this.auth.saveToken(response.token);
          } else {
            throw new Error('Resposta de login inválida');
          }
        }),
        concatMap(() => this.userService.saveUserRule()),
      ).subscribe({
        next: () => {
          const userRule = this.userService.getUserRule();

          if (userRule === 'RULE_EMPLOYEE') {
            this.router.navigate(['/funcionario/solicitacoes']);
          } else if (userRule === 'RULE_ADMIN') {
            this.router.navigate(['/admin/funcionarios']);
          } else if (userRule === 'RULE_CLIENT') {
            this.router.navigate(['/dashboard']);
          }
        },
        error: (err) => {
          if (err.status === 401) {
            Swal.fire({
              title: 'Erro de autenticação',
              text: 'Usuário ou senha inválidos. Tente novamente.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Erro',
              text: 'Erro ao fazer login. Verifique sua conexão ou tente novamente mais tarde.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      console.log('Form is invalid', this.loginForm);
    }
  }
}
