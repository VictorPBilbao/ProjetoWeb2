import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee/employee.service';  // Importando o serviço
import { Router } from '@angular/router';  // Para redirecionar após o cadastro
import { Employee } from '../../shared/models/employee.model';  // Caminho correto da sua interface Employee
import Swal from 'sweetalert2';


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
  brands = ['Acer', 'Apple', 'Dell', 'Lenovo', 'LG', 'Samsung','Outro'];
  services = ['Atualização', 'Formatação', 'Configuração', 'Limpeza', 'Manutenção', 'Troca de peças'];

  // Modelo do formulário
  solicitation: Employee = {
    id: '',  // O ID será gerado automaticamente pelo serviço
    data: this.getCurrentDate(), // A data será gerada aqui, diretamente no componente
    hora: this.getCurrentTime(),
    equipamento: '',
    estado: 'ABERTA',
    orcamento: '',
    categoria: '',
    marca: '',
    descricaoServico: '',
    defeitoRelatado: ''
  };

  solicitacoes: Employee[] = [];  // Defina solicitacoes como um array de Employee
  campoOrdenado: keyof Employee = 'data';  // Campo padrão para ordenar
  ordemCrescente: boolean = true; // Ordenação crescente ou decrescente

  // Injeção de dependências
  constructor(private employeeService: EmployeeService, private router: Router) {}

  // Método de inicialização (ngOnInit)
  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  // Obter hora atual
  private getCurrentTime(): string {
    return new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }

  private getCurrentDate(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];  // 'yyyy-mm-dd'
  }

  // Método para cadastrar
  register() {
    // Chama o serviço para adicionar a solicitação
    this.employeeService.adicionar(this.solicitation);

    Swal.fire({
      title: 'Sucesso!',
      text: `Solicitação ${this.solicitation.id} cadastrada com sucesso!`,
      icon: 'success',
      confirmButtonText: 'OK'
    });

    // Redireciona para a página de lista ou outra página que você escolher
    this.router.navigate(['/solicitacoes']); // Ou o caminho da lista de solicitações

    // Limpar formulário após cadastro
    this.resetForm();
  }

 private carregarSolicitacoes() {
  this.employeeService.listar().subscribe(solicitacoes => {
    this.solicitacoes = solicitacoes;
    this.ordenarPor(this.campoOrdenado);  // Ordena após carregar
  });
}

  // Limpar formulário
  private resetForm() {
    this.solicitation = {
      id: '',  // O ID será gerado automaticamente pelo serviço
      data: this.getCurrentDate(), // A data será gerada aqui, diretamente no componente
      hora: this.getCurrentTime(),
      estado: 'ABERTA',
      orcamento: '',
      categoria: '',
      marca: '',
      equipamento: '',
      descricaoServico: '',
      defeitoRelatado: ''
    };
  }

  // Método de ordenação
  ordenarPor(campo: keyof Employee): void {
    if (this.campoOrdenado === campo) {
      this.ordemCrescente = !this.ordemCrescente;
    } else {
      this.campoOrdenado = campo;
      this.ordemCrescente = true;
    }

    this.solicitacoes.sort((a, b) => {
      let valA: any;
      let valB: any;

      if (campo === 'data') {
        const [diaA, mesA, anoA] = a.data.split('/').map(Number);
        const [horaA, minutoA] = a.hora.split(':').map(Number);
        const [diaB, mesB, anoB] = b.data.split('/').map(Number);
        const [horaB, minutoB] = b.hora.split(':').map(Number);

        valA = new Date(anoA, mesA - 1, diaA, horaA, minutoA);
        valB = new Date(anoB, mesB - 1, diaB, horaB, minutoB);
      }

      if (typeof valA === 'string') {
        valA = valA.toLowerCase();
        valB = valB.toLowerCase();
      }

      if (valA < valB) return this.ordemCrescente ? -1 : 1;
      if (valA > valB) return this.ordemCrescente ? 1 : -1;
      return 0;
    });
  }
}
