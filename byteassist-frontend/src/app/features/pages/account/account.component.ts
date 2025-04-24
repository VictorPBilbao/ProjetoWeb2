import { Component, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../services/user/user.service';
import { NotificationComponent } from '../../components/notification/notification.component';

@Component({
  selector: 'app-account',
  imports: [
    CommonModule,
    FormsModule,
    NotificationComponent
  ],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  @ViewChild('userForm') userForm!: NgForm | undefined;
  user: User = new User();
  message: string = '';
  showNotification: boolean = false;

  constructor(
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getInfoUser().subscribe((user: User) => {
      this.user = user;
    });
  }

  onSubmit() {
    this.showNotification = false;
    if (this.userForm?.valid) {
      this.userService.updateUser(this.user).subscribe({
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
        }
      });
    } else {
      this.message = 'Preencha todos os campos corretamente!';
      this.showNotification = true;
    }
  }

  applyCpfMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .replace(/\D/g, '') // Remove tudo que não é número
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
  }

  // Máscara para Telefone
  applyPhoneMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .replace(/\D/g, '') // Remove tudo que não é número
      .replace(/(\d{2})(\d)/, '($1) $2') // Adiciona os parênteses
      .replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona o traço
  }

  // Máscara para CEP
  applyCepMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .replace(/\D/g, '') // Remove tudo que não é número
      .replace(/(\d{5})(\d)/, '$1-$2'); // Adiciona o traço
  }
}
