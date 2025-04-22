import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employee } from '../../models/employee.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  selecionado: Employee | null = null;
  categorias: string[] = ['Notebook', 'Smartphone', 'Tablet', 'Desktop'];

  constructor(
    private employeeService: EmployeeService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.carregarSolicitacoes();
  }

  carregarSolicitacoes(): void {
    // Usando o método correto do serviço
    this.solicitacoes = this.employeeService.obterSolicitacoes();
    this.filtrarSolicitacoes();
  }

  filtrarSolicitacoes(): void {
    if (this.filtroEstado) {
      this.solicitacoesFiltradas = this.solicitacoes.filter(s => s.estado === this.filtroEstado);
    } else {
      this.solicitacoesFiltradas = [...this.solicitacoes];
    }
  }

  selecionar(solicitacao: Employee): void {
    this.selecionado = { ...solicitacao };
  }

  salvarEdicao(): void {
    if (this.selecionado) {
      // Usando o método editar do serviço
      this.employeeService.editar(this.selecionado);
      this.carregarSolicitacoes();
      this.selecionado = null;
    }
  }

  limitarDescricao(descricao: string): string {
    return descricao.length > 30 ? `${descricao.substring(0, 30)}...` : descricao;
  }

  efetuarOrcamento(s: Employee): void {
    console.log('Efetuar orçamento:', s);
    // Implemente conforme necessário
  }

  manutencao(s: Employee): void {
    console.log('Manutenção:', s);
    // Implemente conforme necessário
  }

  redirecionar(s: Employee): void {
    console.log('Redirecionar:', s);
    // Implemente conforme necessário
  }

  irParaOrcamento(solicitacao: Employee): void {
    this.router.navigate(['funcionario/orcamentos', solicitacao.id]);
  }

  irParaRedirecionamento(solicitacao: Employee): void {
    this.router.navigate(['funcionario/manutencao', solicitacao.id]);
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