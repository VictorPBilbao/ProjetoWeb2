import { Component, Input } from '@angular/core';
import { Employee } from '../../shared/models/employee.model';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-employee-visualizar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal-employee-visualizar.component.html',
  styleUrls: ['./modal-employee-visualizar.component.css'],
})
export class ModalEmployeeVisualizarComponent {
  @Input() selecionado: Employee = {} as Employee;

  constructor(private router: Router) {}

  abrirModal() {
    const modal = new bootstrap.Modal(document.getElementById('visualizarModal'));
    modal.show();
  }

  fecharModal() {
    const modalElement = document.getElementById('visualizarModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  getEstadoClass(estado: string): string {
  switch (estado?.toLowerCase()) {
    case 'aberta':
      return 'text-secondary';    // cinza
    case 'orçada':
      return 'text-brown';        // marrom
    case 'rejeitada':
      return 'text-danger';       // vermelho
    case 'aprovada':
      return 'text-warning';      // amarelo
    case 'redirecionada':
      return 'text-purple';       // roxo
    case 'arrumada':
      return 'text-primary';      // azul
    case 'paga':
      return 'text-orange';       // laranja
    case 'finalizada':
      return 'text-success';      // verde
    default:
      return '';
  }
}
  realizarAcao(acao: string): void {
    switch (acao) {
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

  aprovarOrcamento(): void {
    console.log('Orçamento aprovado');
    this.router.navigate(['/orcamentos']).then(() => window.location.reload());
  }

  rejeitarOrcamento(): void {
    console.log('Orçamento rejeitado');
    this.router.navigate(['/orcamentos']).then(() => window.location.reload());
  }

  resgatarServico(): void {
    this.selecionado.estado = 'APROVADA';
    Swal.fire({
      title: 'Serviço Resgatado!',
      text: 'O serviço foi resgatado, solicitação APROVADA.',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#198754'
    });
  }

  pagarServico(): void {
    Swal.fire({
      title: 'Confirme o pagamento!\nValor: R$100,00',
      text: 'Redirecionando para a tela de pagamento...',
      icon: 'success',
      confirmButtonText: 'OK',
      confirmButtonColor: '#0d6efd'
    }).then(() => {
      this.router.navigateByUrl('/pagamentos').then(() => window.location.reload());
    });
  }

 formatarData(data: string | Date): string {
  if (!data) return '';

  let dt: Date;

  // Se for uma string no formato 'yyyy-MM-dd', transforma em Date
  if (typeof data === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(data)) {
    const [ano, mes, dia] = data.split('-');
    dt = new Date(+ano, +mes - 1, +dia);
  } else {
    dt = new Date(data);
  }

  return dt.toLocaleDateString('pt-BR');
}

}
