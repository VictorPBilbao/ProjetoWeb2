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

  // Variáveis do componente
  user: User = new User(); // Objeto do usuário
  message: string = ''; // Mensagem de notificação
  showNotification: boolean = false; // Controle de exibição de notificação
  currentStep: number = 1; // Passo atual do formulário
  showPassword: boolean = false; // Controle de visibilidade da senha

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  /**
   * Método chamado ao submeter o formulário.
   */
  onSubmit() {
    this.resetNotification();

    if (this.isFormValid()) {
      this.user = this.verifyFieldsAndCreateUser() as User;

      if (!this.user) {
        return;
      }

      this.createUser();
    } else {
      this.showErrorMessage('Preencha todos os campos obrigatórios.');
    }
  }

  /**
   * Reseta a notificação e a mensagem.
   */
  private resetNotification(): void {
    this.showNotification = false;
    this.message = '';
  }

  /**
   * Verifica se o formulário é válido.
   */
  private isFormValid(): boolean {
    return this.registerForm?.valid || false;
  }

  /**
   * Cria o usuário chamando o serviço.
   */
  private createUser(): void {
    this.userService.createUser(this.user).subscribe({
      next: (response) => this.handleSuccessResponse(response),
      error: (err) => this.handleErrorResponse(err)
    });
  }

  /**
   * Lida com a resposta de sucesso do serviço.
   */
  private handleSuccessResponse(response: any): void {
    if (response) {
      this.showSuccessMessage('Cadastro realizado com sucesso!');
      this.router.navigate(['/login']);
    } else {
      this.showErrorMessage('Erro ao fazer cadastro. Verifique sua conexão ou tente novamente mais tarde.');
    }
  }

  /**
   * Lida com a resposta de erro do serviço.
   */
  private handleErrorResponse(err: any): void {
    const errorMessage = err.error?.message || 'Erro desconhecido.';
    this.showErrorMessage(`Ocorreu um erro ao fazer o cadastro. Erro: ${errorMessage}`);
  }

  /**
   * Exibe uma mensagem de sucesso.
   */
  private showSuccessMessage(message: string): void {
    this.message = message;
    this.showNotification = true;
  }

  /**
   * Exibe uma mensagem de erro.
   */
  private showErrorMessage(message: string): void {
    this.message = message;
    this.showNotification = true;
  }

  /**
   * Verifica os campos do formulário e cria o objeto User.
   */
  verifyFieldsAndCreateUser(): User | null {
    if (this.registerForm) {
      const formValues = this.registerForm.value;

      // Alimenta o objeto User com os dados do formulário
      this.user.username = formValues.username;
      this.user.password = formValues.password;
      this.user.fullName = formValues.nome;
      this.user.cpf = this.cleanInput(formValues.cpf);
      this.user.dateOfBirth = new Date(formValues.nascimento);
      this.user.gender = formValues.sexo;
      this.user.email = formValues.email;
      this.user.phone = this.cleanInput(formValues.telefone);
      this.user.zip = this.cleanInput(formValues.cep);
      this.user.state = formValues.uf;
      this.user.city = formValues.cidade;
      this.user.neighborhood = formValues.bairro;
      this.user.street = formValues.logradouro;
      this.user.number = formValues.numero;
      this.user.complement = formValues.complemento;

      return this.user;
    }

    return null;
  }

  /**
   * Remove caracteres não numéricos de uma string.
   */
  private cleanInput(input: string): string {
    return input.replace(/\D/g, '');
  }

  /**
   * Avança para o próximo passo do formulário.
   */
  goToNextStep(): void {
    if (this.currentStep < 2) {
      this.currentStep++;
    }
  }

  /**
   * Retorna ao passo anterior do formulário.
   */
  goToPreviousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Máscaras de entrada
  applyCpfMask(event: Event): void {
    this.applyMask(event, [
      { regex: /(\d{3})(\d)/, replacement: '$1.$2' },
      { regex: /(\d{3})(\d)/, replacement: '$1.$2' },
      { regex: /(\d{3})(\d{1,2})$/, replacement: '$1-$2' }
    ]);
  }

  applyDateMask(event: Event): void {
    this.applyMask(event, [
      { regex: /(\d{2})(\d)/, replacement: '$1/$2' },
      { regex: /(\d{2})(\d)/, replacement: '$1/$2' }
    ]);
  }

  applyPhoneMask(event: Event): void {
    this.applyMask(event, [
      { regex: /(\d{2})(\d)/, replacement: '($1) $2' },
      { regex: /(\d{5})(\d)/, replacement: '$1-$2' }
    ]);
  }

  applyCepMask(event: Event): void {
    this.applyMask(event, [
      { regex: /(\d{5})(\d)/, replacement: '$1-$2' }
    ]);
  }

  /**
   * Aplica uma máscara genérica a um campo de entrada.
   */
  private applyMask(event: Event, patterns: { regex: RegExp; replacement: string }[]): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é número

    patterns.forEach((pattern) => {
      value = value.replace(pattern.regex, pattern.replacement);
    });

    input.value = value;
  }

  /**
   * Alterna a visibilidade da senha.
   */
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
}
