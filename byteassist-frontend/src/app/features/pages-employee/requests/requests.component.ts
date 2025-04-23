import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employee } from '../../models/employee.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {
  solicitacoes: Employee[] = [];
  solicitacoesFiltradas: Employee[] = [];
  filtroEstado: string = '';
  filtroDataInicio: string = '';
  filtroDataFim: string = '';
  dataHoraAtual: Date = new Date();
  funcionarioDestino: string = '';

  selecionado: Employee | null = null;
  categorias: string[] = ['Notebook', 'Smartphone', 'Tablet', 'Desktop'];

  funcionarios: string[] = ['Adriano Zandroski Soares','Guilherme Arthur' , 'Iman de Lacerda', 'Patrick Correia Camilo', 'Victor Pasini Bilbao'];

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  )

   {}

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    // Usando o método correto do serviço
    this.solicitacoes = this.employeeService.obterSolicitacoes();
    this.filtrarSolicitacoes();
  }

  filtroData(): void {
    // Chama o método de filtragem sempre que os filtros de data mudarem
    this.filtrarSolicitacoes();
  }

  limparFiltro(): void {
    // Limpa os filtros
    this.filtroDataInicio = '';
    this.filtroDataFim = '';
  
    // Recarrega a lista sem filtros
    this.filtrarSolicitacoes();
  }
  
  selecionar(solicitacao: Employee): void {
    this.selecionado = { ...solicitacao };
  }

  
  nFuncionarioDestinoChange() {
    if (!this.selecionado) return;
  
    // Se o funcionário de destino for diferente do funcionário atual, redirecionar
    if (this.funcionarioDestino && this.funcionarioDestino !== this.selecionado.funcionario) {
      Swal.fire({
        icon: 'info',
        title: 'Redirecionamento em andamento',
        text: `A solicitação será redirecionada para ${this.funcionarioDestino} após salvar.`,
        confirmButtonText: 'Fechar',
        confirmButtonColor: '#3085d6',
        timer: 3000
      });
    }
  }
  
  salvarEdicao() {
    if (!this.selecionado) return;
  
    // Caso a solicitação seja finalizada
    if (this.selecionado.estado === 'ARRUMADA') {
      this.selecionado.dataHoraManutencao = this.dataHoraAtual;
      this.selecionado.historico = (this.selecionado.historico || '') + 
        `\n[${this.dataHoraAtual.toLocaleString()}] Manutenção feita por ${this.selecionado.funcionario}`;
    }
  
    // Caso haja redirecionamento
    if (this.funcionarioDestino && this.funcionarioDestino !== this.selecionado.funcionario) {
      const funcionarioAnterior = this.selecionado.funcionario;
  
      // Atualiza o histórico antes de mudar o funcionário
      this.selecionado.historico = (this.selecionado.historico || '') + 
        `\n[${this.dataHoraAtual.toLocaleString()}] Redirecionado de ${funcionarioAnterior} para ${this.funcionarioDestino}`;
      
      // Atualiza o estado e o funcionário
      this.selecionado.estado = 'REDIRECIONADA';
      this.selecionado.funcionario = this.funcionarioDestino;
    }
  
    // Chama o método para salvar
    this.salvarSolicitacao(this.selecionado);
  
    // Exibe confirmação
    Swal.fire({
      icon: 'success',
      title: 'Alterações Salvas!',
      text: 'A solicitação foi salva com sucesso!',
      confirmButtonText: 'Fechar',
      confirmButtonColor: '#3085d6',
      timer: 3000
    });
  }
  
  salvarSolicitacao(solicitacao: Employee): void {
    this.employeeService.editar(solicitacao);
    this.carregarSolicitacoes();
  }
  

  limitarDescricao(descricao: string): string {
    return descricao.length > 30 ? `${descricao.substring(0, 30)}...` : descricao;
  }

  filtrarSolicitacoes() {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
  
    this.solicitacoesFiltradas = this.solicitacoes.filter(s => {
      const dataSolicitacao = new Date(s.data);
      dataSolicitacao.setHours(0, 0, 0, 0);
  
      // Filtro por estado
      const estadoValido = !this.filtroEstado || s.estado === this.filtroEstado;
  
      // Filtro por intervalo de datas
      const inicioValido = this.filtroDataInicio ? new Date(this.filtroDataInicio) <= dataSolicitacao : true;
      const fimValido = this.filtroDataFim ? dataSolicitacao <= new Date(this.filtroDataFim) : true;
  
      return estadoValido && inicioValido && fimValido;

    });
  }
  
  efetuarOrcamento(s: Employee): void {
    console.log('Efetuar orçamento:', s);
    // Implemente conforme necessário
  }

  manutencao(s: Employee): void {
    console.log('Manutenção:', s);
    // Implemente conforme necessário
  }

  irParaOrcamento(solicitacao: Employee): void {
    this.router.navigate(['funcionario/orcamentos', solicitacao.id]);
  }

  voltar(): void {
    this.router.navigate(['/caminho-para-voltar']);
  }

  finalizarSolicitacao(): void {
    if (this.selecionado) {
      this.selecionado.estado = 'FINALIZADA';
      this.employeeService.editar(this.selecionado);
      this.carregarSolicitacoes();
      this.selecionado = null;
    }
  }
}