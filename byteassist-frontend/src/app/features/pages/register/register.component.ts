import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from '../../components/notification/notification.component';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../shared/models/user.model';
import { Person } from '../../shared/models/person.model';
import { PersonAddress } from '../../shared/models/person-address.model';
import { UserTime } from '../../shared/models/user-time.model';

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
  user: User = {} as User;
  message: string = '';
  showNotification: boolean = false;
  currentStep: number = 1; // Variável para controlar o passo atual do formulário
  showPassword: boolean = false; // Variável para controlar a visibilidade da senha
  isCepValid: boolean = true;

  constructor(
    private router: Router,
    private userService: UserService) {}

  onSubmit() {
    this.showNotification = false; // Reseta a notificação ao submeter o formulário
    this.message = ''; // Reseta a mensagem ao submeter o formulário

    if (this.isCepValid === false) {
      this.message = 'CEP inválido. Por favor, verifique o CEP informado.';
      this.showNotification = true;
      return;
    }

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

      // Monta o objeto PersonAddress
      const address: PersonAddress = {
        street: formValues.logradouro,
        number: formValues.numero,
        complement: formValues.complemento,
        neighborhood: formValues.bairro,
        city: formValues.cidade,
        state: formValues.uf,
        zip: formValues.cep.replace(/\D/g, ''),
        country: 'Brasil'
      };

      // Monta o objeto Person
      const person: Person = {
        id: '', // Se você estiver criando um novo Person
        cpf: formValues.cpf.replace(/\D/g, ''),
        dob: new Date(formValues.nascimento),
        gender: formValues.sexo,
        phone: formValues.telefone.replace(/\D/g, ''),
        address: address,
        name: {
          first: formValues.nome.split(' ')[0] || '',
          last: formValues.nome.split(' ').slice(1).join(' ') || ''
        }
      };

      // Monta o objeto UserTime
      const userTime: UserTime = {
        createdAt: new Date(),
        lastLoginAt: new Date(0),
        updatedAt: new Date()
      };

      // Monta o objeto User
      this.user = {
        id: '',
        email: formValues.email,
        username: formValues.username,
        isActive: true,
        password: password,
        person: person,
        role: 'user',
        time: userTime
      };

      return this.user;
    }
    return null; // Retorna null caso o formulário não esteja definido
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

  // Alterna a visibilidade da senha
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Verifica se o cep é válido
  onVerifyCep(): void {
    this.showNotification = false; // Reseta a notificação ao verificar o CEP
    const cep = this.registerForm?.controls['cep']?.value || '';

    // Verifica se o CEP tem 8 dígitos
    const cepPattern = /^\d{5}-?\d{3}$/;
    if (!cepPattern.test(cep)) {
      this.isCepValid = false;
      return;
    }

    // Busca as informações do CEP
    this.userService.validateCep(cep.replace('-', '')).subscribe({
      next: (address) => {
        if (address) {
          // Se o CEP for válido, preenche os campos de endereço
          if (this.registerForm && this.registerForm.controls) {
            this.registerForm.controls['logradouro']?.setValue(address.street);
            this.registerForm.controls['bairro']?.setValue(address.neighborhood);
            this.registerForm.controls['cidade']?.setValue(address.city);
            this.registerForm.controls['uf']?.setValue(address.state);
            this.registerForm.controls['complemento']?.setValue(address.complement || '');
          }
          this.isCepValid = true; // CEP válido
          console.log('CEP válido:', address);
        } else {
          this.message = 'CEP não encontrado.';
          this.showNotification = true;
          this.isCepValid = false; // CEP inválido
        }
      },
      error: (err) => {
        this.message = err.message || 'Erro ao buscar CEP. Verifique sua conexão ou tente novamente mais tarde.';
        this.showNotification = true;
        this.isCepValid = false; // Erro na busca do CEP
      }
    });
  }
}
