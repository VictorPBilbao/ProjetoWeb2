import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { User } from '../../shared/models/user.model';
import { Person } from '../../shared/models/person.model';
import { PersonAddress } from '../../shared/models/person-address.model';
import { UserTime } from '../../shared/models/user-time.model';
import { DateValidatorDirective } from '../../shared/directives/date-validator.directive';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    DateValidatorDirective
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm | undefined;
  user: User = {} as User;
  message: string = '';
  currentStep: number = 1; // Variável para controlar o passo atual do formulário
  showPassword: boolean = false; // Variável para controlar a visibilidade da senha
  isCepValid: boolean = true;
  isUsernameAvailable: boolean = true;
  isEmailAvailable: boolean = true;
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService) {}

  ngOnInit(): void {
    // Verifica se o usuário é um administrador
    this.isAdmin = this.userService.getUserRule() === 'RULE_ADMIN';
  }

  onSubmit() {
    this.message = ''; // Reseta a mensagem ao submeter o formulário

    if (this.isCepValid === false) {
      this.message = 'CEP inválido. Por favor, verifique o CEP informado.';
      Swal.fire({
        icon: 'warning',
        title: 'Erro',
        text: this.message,
        confirmButtonText: 'OK'
      });
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
            this.message = (!this.isAdmin) ? 'Cadastro realizado com sucesso!' : 'Funcionário cadastrado com sucesso!';
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: this.message,
              confirmButtonText: 'OK'
            });
            if (!this.isAdmin) {
              this.router.navigate(['/login/1']);
            } else {
              this.router.navigate(['/admin/funcionarios']);
            }
          } else {
            this.message = 'Erro ao fazer cadastro. Verifique sua conexão ou tente novamente mais tarde.';
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: this.message,
              confirmButtonText: 'OK'
            });
          }
        },
        error: (err) => {
          this.message = 'Ocorreu um erro ao fazer o cadastro. Erro: ' + (err.error?.message || 'Erro desconhecido.');
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: this.message,
            confirmButtonText: 'OK'
          });
        }
      });
    } else {
      this.message = 'Preencha todos os campos obrigatórios.';
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: this.message,
        confirmButtonText: 'OK'
      });
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
        country: 'BR'
      };

      // Monta o objeto Person
      const [day, month, year] = formValues.nascimento.split('/');
      const person: Person = {
        id: '', // Se você estiver criando um novo Person
        cpf: formValues.cpf.replace(/\D/g, ''),
        dob: new Date(`${year}-${month}-${day}`),
        gender: formValues.sexo,
        phone: formValues.telefone.replace(/\D/g, ''),
        address: address,
        name: {
          first: formValues.nome,
          last: formValues.sobrenome
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
        username: formValues.username.toLowerCase(),
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
          Swal.fire({
            icon: 'warning',
            title: 'Erro',
            text: this.message,
            confirmButtonText: 'OK'
          });
          this.isCepValid = false; // CEP inválido
          this.registerForm?.controls['cep']?.setValue(''); // Reseta o campo de CEP
        }
      },
      error: (err) => {
        const status = err?.status;
        console.log('status: ', status);
        if (status >= 500 && status < 600 || status === 0) {
          // Permite continuar mesmo com erro 500
          this.message = 'Erro ao consultar o CEP, mas você pode continuar preenchendo os dados.';
          Swal.fire({
            icon: 'info',
            title: 'Atenção',
            text: this.message,
            confirmButtonText: 'OK'
          });
          this.isCepValid = true; // Permite seguir
          // Não limpa o campo 'cep'
        } else {
          // Outros erros
          this.message = err.message || 'Erro ao buscar CEP. Verifique sua conexão ou tente novamente mais tarde.';
          Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: this.message,
            confirmButtonText: 'OK'
          });
          this.isCepValid = false;
          this.registerForm?.controls['cep']?.setValue('');
        }
      }
    });
  }

  onValidateUsername(): void {
    var username = this.registerForm?.controls['username']?.value || '';
    username = username.replace(/\s+/g, '').toLowerCase();

    if (username.length < 3) {
      this.message = 'O nome de usuário deve ter pelo menos 3 caracteres.';
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: this.message,
        confirmButtonText: 'OK'
      });
      return;
    }

    this.userService.validateUsername(username).subscribe({
      next: () => {
        this.isUsernameAvailable = true; // Nome de usuário disponível
      },
      error: (err) => {
        if (err.status === 409) {
          // HTTP 409 → nome em uso
          this.message = 'Nome de usuário já está em uso. Por favor, escolha outro.';
        } else {
          // Outros erros
          console.log(err.status)
          this.message = 'Erro ao validar nome de usuário: ' + (err.error?.message || 'Erro desconhecido.');
        }
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: this.message,
          confirmButtonText: 'OK'
        });
        this.isUsernameAvailable = false; // Nome de usuário indisponível
        this.registerForm?.controls['username']?.setValue('');
      }
    });
  }

  onValidateEmail(): void {
    const email = this.registerForm?.controls['email']?.value || '';

    if (!email || !email.includes('@')) {
      this.message = 'Por favor, insira um email válido.';
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: this.message,
        confirmButtonText: 'OK'
      });
      return;
    }

    this.userService.validateEmail(email).subscribe({
      next: () => {
        this.isEmailAvailable = true; // Email disponível
      },
      error: (err) => {
        if (err.status === 409) {
          // HTTP 409 → email em uso
          this.message = 'Email já está em uso. Por favor, escolha outro.';
        } else {
          // Outros erros
          this.message = 'Erro ao validar email: ' + (err.error?.message || 'Erro desconhecido.');
        }
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: this.message,
          confirmButtonText: 'OK'
        });
        this.isEmailAvailable = false; // Email indisponível
        this.registerForm?.controls['email']?.setValue('');
      }
    });
  }
}
