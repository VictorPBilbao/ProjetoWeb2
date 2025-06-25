import { Component, inject, LOCALE_ID } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../services/report/report.service';
import localeData from '@angular/common/locales/pt';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

registerLocaleData(localeData);

@Component({
  selector: 'app-reports',
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
  ],
  providers: [{ provide: LOCALE_ID, useValue: 'pt' }],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
  standalone: true
})
export class ReportsComponent {
  message: string = '';
  showNotification: boolean = false;
  isError: boolean = false;
  startDate: string = ''; // Campo para a data inicial
  endDate: string = '';   // Campo para a data final

  private readonly reportService = inject(ReportService);

  constructor() { }

  generateReport(): void {
    // Validação: não pode ter apenas uma data preenchida
    if ((this.startDate && !this.endDate) || (!this.startDate && this.endDate)) {
      Swal.fire({
        icon: 'error',
        title: 'Datas incompletas',
        text: 'Por favor, selecione tanto a data inicial quanto a data final, ou deixe ambas vazias para gerar o relatório completo.',
        confirmButtonText: 'OK'
      });
      return;
    }

    // Validação: se ambas preenchidas, a inicial não pode ser maior que a final
    if (this.startDate && this.endDate && new Date(this.startDate) > new Date(this.endDate)) {
      this.showMessage('A data inicial não pode ser maior que a data final.', true);
      return;
    }

    this.showMessage('Gerando relatório de receitas...', false);

    this.reportService.generateReportPdf(this.startDate || undefined, this.endDate || undefined).subscribe({
      next: (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        this.showMessage('Relatório gerado com sucesso!', false);
      },
      error: (error: any) => {
        console.error('Erro ao gerar relatório:', error);
        this.showMessage('Erro ao gerar relatório. Tente novamente.', true);
      }
    });
  }

  showMessage(message: string, isError: boolean = false): void {
    this.message = message;
    this.isError = isError;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 5000); // Esconde a notificação após 5 segundos
  }
}
