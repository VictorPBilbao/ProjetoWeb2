import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employee } from '../../shared/models/employee.model';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';

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

  campoOrdenado: string = '';
  ordemCrescente: boolean = true;

  constructor(private service: EmployeeService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.service.listar().subscribe(s => {
      console.log('Solicitações recebidas:', s);  // Verifique os dados recebidos
      this.solicitacoes = s;
      this.ordenarPor('data');
    });
  }

  ordenarPor(campo: keyof Employee): void {  // Garante que 'campo' seja uma chave válida de Employee
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
        valA = new Date(`${a.data}T${a.hora}`);
        valB = new Date(`${b.data}T${b.hora}`);
      } else {
        valA = a[campo];  // Agora 'campo' é garantido como chave válida de 'Employee'
        valB = b[campo];
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

  selecionar(s: Employee) {
    this.selecionado = { ...s };
  }

  abrirFormulario() {
    this.router.navigate(['/nova-solicitacao']);
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
    this.ngOnInit(); // Atualiza a lista exibida
    bootstrap.Modal.getInstance(document.getElementById('editarModal'))?.hide(); // Fecha o modal
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
    this.router.navigate(['/orcamentos']).then(() => {
      window.location.reload(); // força o reload após a navegação
    });
  }

  rejeitarOrcamento(): void {
    console.log('Orçamento rejeitado');
    this.router.navigate(['/orcamentos']).then(() => {
      window.location.reload(); // força o reload após a navegação
    });
  }

  resgatarServico(): void {
    // Atualiza o estado da solicitação
    this.selecionado.estado = 'APROVADA';

    // Atualiza o array principal, se necessário
    const index = this.solicitacoes.findIndex(s => s.id === this.selecionado.id);
    if (index !== -1) {
      this.solicitacoes[index].estado = 'APROVADA';
    }

    // Exibe o popup de sucesso
    Swal.fire({
      title: 'Serviço Resgatado!',
      text: 'O serviço foi resgatado, solicitação APROVADA.',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#198754'
    });
  }

  pagarServico(): void {
    // Exibe o popup de confirmação
    Swal.fire({
      title: 'Confirme o pagamento!\nValor: R$100,00',
      text: 'Redirecionando para a tela de pagamento...',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#0d6efd'
    }).then(() => {
      // Redireciona para /payment e força refresh
      this.router.navigateByUrl('/pagamentos').then(() => {
        window.location.reload();  // Força recarregamento da tela
      });
    });
  }

}
