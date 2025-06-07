import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { Task } from '../../shared/models/task.model';
import { Equipment } from '../../shared/models/equipment.model';
import { RecordIdPipe } from '../../shared/pipes/record-id.pipe';
import { EquipmentFieldPipe } from '../../shared/pipes/equipment-field.pipe';

declare var bootstrap: any;

@Component({
  selector: 'app-modal-employee-visualizar',
  standalone: true,
  imports: [CommonModule, RecordIdPipe, EquipmentFieldPipe],
  templateUrl: './modal-listmytask-visualizar.component.html',
  styleUrls: ['./modal-listmytask-visualizar.component.css'],
})
export class ModalListMyTaskVisualizarComponent {
  @Input() selecionado: Task = {} as Task;

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
      case 'orcada':
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

  getEquipmentInfo(field: keyof Equipment): string {
    if (typeof this.selecionado.equipment === 'object' && this.selecionado.equipment !== null) {
      return this.selecionado.equipment[field] || '';
    }
    return '';
  }

  getTaskId(): string {
    return this.selecionado.id ? this.selecionado.id.split('_').pop() || this.selecionado.id : '';
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
    this.selecionado.status = 'APROVADA';
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

  formatarData(data: Date | string | undefined): string {
    if (!data) return '';

    let dt: Date;

    if (typeof data === 'string') {
      // Se for uma string no formato 'yyyy-MM-dd', transforma em Date
      if (/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        const [ano, mes, dia] = data.split('-');
        dt = new Date(+ano, +mes - 1, +dia);
      } else {
        dt = new Date(data);
      }
    } else {
      dt = new Date(data);
    }

    return dt.toLocaleDateString('pt-BR');
  }

  formatarHora(data: Date | string | undefined): string {
    if (!data) return '';

    const dt = typeof data === 'string' ? new Date(data) : data;
    return dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
}
