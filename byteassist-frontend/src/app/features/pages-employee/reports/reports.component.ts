import { Component, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationComponent } from '../../components/notification/notification.component';
import { BudgetService } from '../../services/budget/budget.service'; // Usaremos BudgetService para o endpoint do PDF
import { HttpParams } from '@angular/common/http'; // Importe HttpParams
import localeData from '@angular/common/locales/pt';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

registerLocaleData(localeData);

@Component({
  selector: 'app-reports',
  imports: [
    NotificationComponent,
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  standalone: true // Manter esta linha se seu projeto usa componentes standalone
})
export class ReportsComponent {
  message: string = '';
  showNotification: boolean = false;
  startDate: string = ''; // Campo para a data inicial
  endDate: string = '';   // Campo para a data final

  private readonly budgetService = inject(BudgetService);

  constructor() { }

  generateRevenueReportByPeriod(): void {
    // Validação: não pode ter apenas uma data preenchida
    if ((this.startDate && !this.endDate) || (!this.startDate && this.endDate)) {
      Swal.fire({
        icon: 'error',
        title: 'Datas incompletas',
        text: 'Por favor, selecione tanto a data inicial quanto a data final.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validação: se ambas preenchidas, a inicial não pode ser maior que a final
    if (this.startDate && this.endDate && new Date(this.startDate) > new Date(this.endDate)) {
      this.showMessage('A data inicial não pode ser maior que a data final.', true);
      return;
    }

    // Monta params só se as duas existirem
    let params = new HttpParams();
    if (this.startDate && this.endDate) {
      params = params.set('start', this.startDate).set('end', this.endDate);
    }

    this.showMessage('Gerando Relatório de Receitas por Período...', false);

    this.budgetService.getReportPdf('/api/report/pdf', params).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.showMessage('Relatório gerado com sucesso!', false);
      },
      error: (error) => {
        console.error('Erro ao gerar relatório por período:', error);
        this.showMessage('Erro ao gerar relatório de Receitas por Período.', true);
      }
    });
  }

  // Método para gerar o Relatório de Receitas por Categoria (RF020)
  generateRevenueReportByCategory(): void {
    let params = new HttpParams();
    // Adiciona um parâmetro para indicar o tipo de relatório, se o backend espera isso
    // Ex: params = params.set('reportType', 'revenueByCategory');

    this.showMessage('Gerando Relatório de Receitas por Categoria...', false);

    // Chama o método do service com a URL do endpoint e os parâmetros (se houver para este tipo)
    this.budgetService.getReportPdf('/api/report/pdf', params).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank'); // Abre o PDF em uma nova aba
        this.showMessage('Relatório de Receitas por Categoria gerado com sucesso!', false);
      },
      error: (error) => {
        console.error('Erro ao gerar relatório por categoria:', error);
        this.showMessage('Erro ao gerar relatório de Receitas por Categoria.', true);
      }
    });
  }

  showMessage(message: string, isError: boolean = false): void {
    this.message = message;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 5000); // Esconde a notificação após 5 segundos
  }
}