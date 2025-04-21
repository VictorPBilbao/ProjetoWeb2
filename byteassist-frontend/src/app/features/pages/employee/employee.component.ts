import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employee } from '../../models/employee.model';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';


declare var bootstrap: any; // Importa os modais do Bootstrap

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css'],
})
export class EmployeeComponent implements OnInit {
  solicitacoes: Employee[] = [];
  selecionado: Employee = {} as Employee;
  
  categorias: string[] = ['Desktop', 'Notebook', 'Smartphone', 'Tablet'];
  marcas: string[] = ['Acer', 'Dell', 'Le Novo', 'LG', 'Samsung', 'Vaio', 'Outro'];
  servicos: string[] = ['Atualização', 'Formatação', 'Configuração', 'Limpeza', 'Manutenção', 'Troca de peças']

  constructor(private service: EmployeeService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.service.listar().subscribe(s => {
      console.log('Solicitações recebidas:', s);  // Verifique os dados recebidos
      this.solicitacoes = s;
    });
  }
  
  selecionar(s: Employee) {
    this.selecionado = { ...s };
  }

  abrirFormulario() {
    this.router.navigate(['/new-request']);
  }

  ver(s: Employee) {
    this.selecionado = { ...s };
    this.cdr.detectChanges(); // Força o Angular a atualizar a view
  
    const modal = new bootstrap.Modal(document.getElementById('visualizarModal'));
    modal.show();
  }
  

  editar(s: Employee) {
    this.selecionado = { ...s };
    const modal = new bootstrap.Modal(document.getElementById('editarModal'));
    modal.show();
  }

  salvarEdicao() {
    this.service.editar(this.selecionado);
    this.ngOnInit(); // Atualiza a lista
  }

  remover(id: number) {
    const item = this.solicitacoes.find(s => s.id === id);
    if (item) {
      this.selecionado = { ...item };
      const modal = new bootstrap.Modal(document.getElementById('removerModal'));
      modal.show();
    }
  }

  confirmarRemocao() {
    this.service.remover(this.selecionado.id);
    
    // Fecha o modal manualmente (com Bootstrap JS)
    const modalElement = document.getElementById('removerModal');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  
    // Recarrega a lista de solicitações com delay para garantir sincronia
    setTimeout(() => {
      this.ngOnInit();
    }, 300);
  }
  
  // Função para realizar a ação conforme o estado
  realizarAcao(acao: string): void {
    switch (acao) {
      case 'ok':
        this.processarOk();
        break;
      case 'aprovar':
        this.aprovarOrcamento();
        break;
      case 'rejeitar':
        this.rejeitarOrcamento();
        break;
      case 'resgatar':
        this.resgatarServico();
        break;
      case 'pagar':
        this.pagarServico();
        break;
      case 'finalizar':
        this.finalizarServico();
        break;
      default:
        console.log('Ação desconhecida');
    }
  }

  processarOk(): void {
    console.log('Ação OK realizada');
    // Lógica para processar ação "OK"
  }

  aprovarOrcamento(): void {
    console.log('Orçamento aprovado');
    // Lógica para aprovar orçamento
  }

  rejeitarOrcamento(): void {
    console.log('Orçamento rejeitado');
    // Lógica para rejeitar orçamento
  }

  resgatarServico(): void {
    console.log('Serviço resgatado');
    // Lógica para resgatar serviço
  }

  pagarServico(): void {
    console.log('Serviço pago');
    // Lógica para pagar serviço
  }

  finalizarServico(): void {
    console.log('Serviço finalizado');
    // Lógica para finalizar serviço
  }
}
