import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../components/notification/notification.component';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NotificationComponent
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  message: string = '';
  showNotification: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  isFieldInvalid(field: string): boolean {
    return !!this.registerForm.get(field)?.invalid && !!this.registerForm.get(field)?.touched;
  }

  getErrorMessage(field: string): string {
    if (field === 'username') {
      if (this.registerForm.get(field)?.hasError('required')) return 'Usuário é obrigatório';
    }

    if (field === 'password') {
      if (this.registerForm.get(field)?.hasError('required')) return 'Senha é obrigatória';
    }

    if (field === 'email') {
      if (this.registerForm.get(field)?.hasError('required')) return 'Email é obrigatório';
      if (this.registerForm.get(field)?.hasError('email')) return 'Email inválido';
    }

    return '';
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.showNotification = false;

      if (this.registerForm.value.password !== this.registerForm.value.confirmPassword) {
        this.message = 'As senhas não coincidem.';
        this.showNotification = true;
        return;
      }

      // Adicionando tipos explícitos para response e err
      this.auth.register(this.registerForm.value).subscribe({
        next: (response: any) => { // Use o tipo correto se souber
          this.message = 'Registro realizado com sucesso!';
          this.showNotification = true;
        },
        error: (err: any) => { // Use o tipo correto se souber
          this.message = 'Erro ao registrar. Tente novamente mais tarde.';
          this.showNotification = true;
        }
      });

    } else {
      this.registerForm.markAllAsTouched();
      console.log('Form is invalid', this.registerForm);
    }
  }
}