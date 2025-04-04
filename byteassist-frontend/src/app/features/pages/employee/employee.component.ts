import { Component } from '@angular/core';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent {
  pendingServices = [
    {
      id: '001',
      cliente: 'João Silva',
      servico: 'Manutenção de Computador',
      status: 'Pendente',
      data: '05/04/2025'
    },
    {
      id: '002',
      cliente: 'Ana Lima',
      servico: 'Instalação de Impressora',
      status: 'Pendente',
      data: '06/04/2025'
    },
    {
      id: '003',
      cliente: 'Pedro Rocha',
      servico: 'Atualização de Sistema',
      status: 'Pendente',
      data: '07/04/2025'
    }
  ];

  concluir(id: string) {
    console.log(`Serviço ${id} concluído!`);

  }

  cancelar(id: string) {
    console.log(`Serviço ${id} cancelado!`);
  
  }
}
