import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    provideCharts(withDefaultRegisterables())
  ]
})
export class DashboardComponent {
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    devicePixelRatio: 2,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#ffffff', // Cor branca para a legenda
          font: {
            size: 14
          }, 
          usePointStyle: true, // Usa ícones ao invés de retângulos
          boxWidth: 10, // Tamanho do ícone da legenda
          padding: 20 // Espaçamento
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (!context.dataset || !context.dataset.data) return '';
            
            const label = context.label || '';
            const value = typeof context.raw === 'number' ? context.raw : 0;
            
            const total = context.dataset.data
              .map(d => typeof d === 'number' ? d : 0)
              .reduce((a: number, b: number) => a + b, 0);
            
            const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        },
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        titleColor: '#4BC0C0',
        bodyColor: '#ffffff',
        borderColor: '#4BC0C0',
      }
    }
  };

  public pieChartType: ChartType = 'pie';

  public equipamentosChartData: ChartData<'pie'> = {
    labels: ['Notebook', 'Celular', 'Tablet'],
    datasets: [{
      data: [45, 30, 25],
      backgroundColor: [
        'rgb(10, 185, 171)',
        'rgba(12, 63, 97, 0.7)',
        'rgb(7, 129, 17)'
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverBackgroundColor: [
        'rgb(8, 165, 151)',
        'rgba(10, 53, 87, 0.8)',
        'rgb(5, 109, 7)'
      ]
    }]
  };

  public servicosChartData: ChartData<'pie'> = {
    labels: ['Solicitação', 'Pagamento', 'Orçamento'],
    datasets: [{
      data: [50, 30, 20],
      backgroundColor: [
        'rgb(92, 233, 226)',
        'rgb(124, 199, 243)',
        'rgb(118, 247, 150)'
      ],
      borderColor: '#ffffff',
      borderWidth: 2,
      hoverBackgroundColor: [
        'rgb(72, 213, 206)',
        'rgb(104, 179, 223)',
        'rgb(98, 227, 130)'
      ]
    }]
  };
}