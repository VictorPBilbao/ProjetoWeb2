import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { RouterModule, Router } from '@angular/router';

import { DashboardService, Task } from '../../services/dashboard/dashboard.service';

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

export class DashboardComponent implements OnInit {
  public lineChartType: ChartType = 'line';
  public pieChartType: ChartType = 'pie';

  public servicosChartData: ChartData<'pie'> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [],
      hoverBackgroundColor: []
    }]
  };


  public solicitacoesChartData: ChartData<'line'> = {
    labels: [],
    datasets: [{
      data: [],            
      borderColor: 'rgb(92, 233, 226)',
      backgroundColor: 'rgba(92, 233, 226, 0.2)',
      fill: false,
      tension: 0.3,
      pointBackgroundColor: 'rgb(92, 233, 226)',
      pointBorderColor: 'rgb(72, 213, 206)',
      pointRadius: 5
    }]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    devicePixelRatio: 2,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#000',
          font: { size: 14 },
          usePointStyle: true,
          boxWidth: 10,
          padding: 20
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
      }
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'category', 
        ticks: { color: '#000' },
        grid: { display: false }
      },
      y: {
        beginAtZero: true,
        ticks: { color: '#000' },
        grid: { display: true, color: '#eee' }
      }
    },
    plugins: { legend: { display: false } }
  };

  constructor(
    private router: Router,
    private dashboardService: DashboardService
  ) { }

  ngOnInit(): void {
    this.montarGraficoSolicitacao();
    this.montarGraficoServicos();
  }

  shouldShowHeader(): boolean {
    return !this.router.url.includes('/dashboard');
  }

  private montarGraficoSolicitacao(): void {
    this.dashboardService.getMyTasks().subscribe({
      next: (tasks: Task[]) => {
        if (!tasks || tasks.length === 0) {
          console.warn('Nenhuma task para montar o gráfico de linha.');
          return;
        }

        const datasBrutas: string[] = tasks.map(t => {
          const dt = new Date(t.time.createdAt);
          const yyyy = dt.getFullYear();
          const mm = String(dt.getMonth() + 1).padStart(2, '0');
          const dd = String(dt.getDate()).padStart(2, '0');
          return `${yyyy}-${mm}-${dd}`;
        });

        const mapaContagem: Record<string, number> = {};
        datasBrutas.forEach(dataStr => {
          mapaContagem[dataStr] = (mapaContagem[dataStr] || 0) + 1;
        });

        const labelsOrdenadas = Object.keys(mapaContagem).sort();
        console.log('→ labelsOrdenadas:', labelsOrdenadas);
        const valoresOrdenados = labelsOrdenadas.map(label => mapaContagem[label]);

        this.solicitacoesChartData = {
          labels: labelsOrdenadas,
          datasets: [{
            data: valoresOrdenados,
            borderColor: 'rgb(92, 233, 226)',
            backgroundColor: 'rgba(92, 233, 226, 0.2)',
            fill: false,
            tension: 0.3,
            pointBackgroundColor: 'rgb(92, 233, 226)',
            pointBorderColor: 'rgb(72, 213, 206)',
            pointRadius: 5
          }]
        };
      },
      error: err => {
        console.error('Erro ao carregar tasks para gráfico temporal:', err);
      }
    });
  }

  // ********** “Meus Serviços”: agrupa por type **********
  private montarGraficoServicos(): void {
    this.dashboardService.getMyTasks().subscribe({
      next: (tasks: Task[]) => {
        if (!tasks || tasks.length === 0) {
          console.warn('Nenhuma task para montar “Meus Serviços”.');
          return;
        }

        const mapa: Record<string, number> = {};
        tasks.forEach(t => {
          const eq = t.type || 'Sem serviços para mostrar';
          mapa[eq] = (mapa[eq] || 0) + 1;
        });

        const labels = Object.keys(mapa);
        const valores = Object.values(mapa);

        const backgroundColors = labels.map(() => this.getCorAleatoria());
        const hoverColors = labels.map(() => this.getCorAleatoria());

        this.servicosChartData = {
          labels: labels,
          datasets: [{
            data: valores,
            backgroundColor: backgroundColors,
            hoverBackgroundColor: hoverColors
          }]
        };
      },
      error: (err) => {
        console.error('Erro ao carregar tasks para “Meus Serviços”:', err);
      }
    });
  }

  //gera uma cor RGB aleatória (para variar cada fatia)
    private getCorAleatoria(): string {
    const r = Math.floor(Math.random() * 200) + 20;
    const g = Math.floor(Math.random() * 200) + 20;
    const b = Math.floor(Math.random() * 200) + 20;
    return `rgb(${r}, ${g}, ${b})`;
  }
}
