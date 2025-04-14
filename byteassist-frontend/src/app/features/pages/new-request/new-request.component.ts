import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css']
})
export class NewRequestComponent {
  // Dados para os combobox
  categories = ['Desktop', 'Notebook', 'Smartphone', 'Tablet'];
  brands = ['Acer', 'Dell', 'Lenovo', 'LG', 'Samsung', 'Vaio'];
  //equipments = ['Acer Aspire', 'Dell inspiron', 'Ideapad', 'Galaxy Book', 'Shell Efi'];
  services = ['Atualização', 'Formatação', 'Configuração', 'Limpeza', 'Manutenção', 'Troca de peças'];
  
  // Modelo do formulário
  solicitation = {
    id: this.generateId(),
    date: this.getCurrentDate(),
    time: this.getCurrentTime(),
    status: 'Aberto', // Definido como 'Aberto' por padrão
    budget: '',
    category: '',
    brand: '',
    //equipment: '',
    service: '',
    description: '',
    defect: ''
  };

  // Gerar ID automático
  private generateId(): number {
    return Math.floor(Math.random() * 90000) + 10000;
  }

  // Obter data atual
  private getCurrentDate(): string {
    return new Date().toLocaleDateString('pt-BR');
  }

  // Obter hora atual
  private getCurrentTime(): string {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  // Método para cadastrar
  register() {
    console.log('Solicitação cadastrada:', this.solicitation);
    alert(`Solicitação ${this.solicitation.id} cadastrada com sucesso!`);
    this.resetForm();
  }

  // Limpar formulário
  private resetForm() {
    this.solicitation = {
      id: this.generateId(),
      date: this.getCurrentDate(),
      time: this.getCurrentTime(),
      status: 'Aberto',
      budget: '',
      category: '',
      brand: '',
      //equipment: '',
      service: '',
      description: '',
      defect: ''
    };
  }
}