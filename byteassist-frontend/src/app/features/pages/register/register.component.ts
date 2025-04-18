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
  @ViewChild('registerForm') registerForm!: NgForm | undefined;
  user: User = new User();
  message: string = '';
  showNotification: boolean = false;
  currentStep: number = 1; // Variável para controlar o passo atual do formulário

  constructor(
    private router: Router,
    private userService: UserService) {}

  onSubmit() {
    this.showNotification = false; // Reseta a notificação ao submeter o formulário
    this.message = ''; // Reseta a mensagem ao submeter o formulário

    if (this.registerForm?.valid) {
      this.user = this.verifyFieldsAndCreateUser() as User;
      if (!this.user) {
        return;
      }

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

  verifyFieldsAndCreateUser(): User | null {
    if (this.registerForm) {
      const formValues = this.registerForm.value; // Obtém os valores do formulário
      const password = formValues.password;

      // Alimenta o objeto User com os dados do formulário
      this.user.username = formValues.username;
      this.user.password = password;
      this.user.fullName = formValues.nome;
      this.user.cpf = formValues.cpf.replace(/\D/g, ''); // Remove caracteres não numéricos do CPF
      this.user.dateOfBirth = new Date(formValues.nascimento); // Converte para Date
      this.user.gender = formValues.sexo;
      this.user.email = formValues.email;
      this.user.phone = formValues.telefone.replace(/\D/g, ''); // Remove caracteres não numéricos do telefone
      this.user.zipCode = formValues.cep.replace(/\D/g, ''); // Remove caracteres não numéricos do CEP
      this.user.state = formValues.uf;
      this.user.city = formValues.cidade;
      this.user.neiborhood = formValues.bairro;
      this.user.street = formValues.logradouro;
      this.user.number = formValues.numero;
      this.user.complement = formValues.complemento;

      return this.user; // Retorna o objeto User preenchido
    }

    return null; // Retorna null caso o formulário não esteja definido
  }

  goToNextStep(): void {
    // Verifica se as senhas coincidem
    if (this.registerForm?.value.password !== this.registerForm?.value.confirmedPassword) {
      this.message = 'As senhas não coincidem.';
      this.showNotification = true;
      return;
    }

    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Máscara para CPF
  applyCpfMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .replace(/\D/g, '') // Remove tudo que não é número
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o primeiro ponto
      .replace(/(\d{3})(\d)/, '$1.$2') // Adiciona o segundo ponto
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2'); // Adiciona o traço
  }

  // Máscara para Data de Nascimento
  applyDateMask(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value
      .replace(/\D/g, '') // Remove tudo que não é número
      .replace(/(\d{2})(\d)/, '$1/$2') // Adiciona a primeira barra
      .replace(/(\d{2})(\d)/, '$1/$2'); // Adiciona a segunda barra
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
