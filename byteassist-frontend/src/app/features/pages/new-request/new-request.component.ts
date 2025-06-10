import { EquipmentService } from './../../services/equipment/equipment.service';
import { Equipment } from './../../shared/models/equipment.model';
import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router'; // Para redirecionar após o cadastro
import { TaskService } from '../../services/task/task.service';
import { Task } from '../../shared/models/task.model';
import { RecordidService } from '../../services/utils/recordid.service';

@Component({
  selector: 'app-new-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css'],
})
export class NewRequestComponent {
  @ViewChild('registerForm') registerForm!: NgForm | undefined;
  taskService = inject(TaskService);
  equipmentService = inject(EquipmentService);
  recordIdService = inject(RecordidService);
  equipment: Equipment = {};
  task: Task = {};

  // Solicitation model for form binding
  solicitation: any = {
    id: '',
    data: '',
    hora: '',
    estado: '',
    orcamento: '',
    categoria: '',
    marca: '',
    equipamento: '',
    cor: '',
    type: '',
    descricaoServico: '',
    defeitoRelatado: '',
  };

  // Dados para os combobox
  categories = ['Desktop', 'Notebook', 'Smartphone', 'Tablet'];
  brands = ['Acer', 'Apple', 'Dell', 'Lenovo', 'LG', 'Samsung', 'Outro'];
  type = [
    'Atualização',
    'Formatação',
    'Configuração',
    'Limpeza',
    'Manutenção',
    'Troca de peças',
  ];

  // Injeção de dependências
  constructor(private readonly router: Router) {}

  // Placeholder for register logic
  createSolicitacao() {
    // You can access form data via this.solicitation
    // and this.registerForm?.value
    // Call your service here later
    //* 1. Criar o equipamento
    const newEquipment: Equipment = {
      brand: this.solicitation.marca,
      color: this.solicitation.cor ?? null,
      model: this.solicitation.equipamento,
      type: this.solicitation.categoria,
    };

    // send a request to create the equipment and log the response as a Equipment object
    this.equipmentService.createEquipment(newEquipment).subscribe({
      next: (createdEquipment) => {
        console.log('Created Equipment:', createdEquipment);
        this.equipment = createdEquipment;

        // Now that equipment is created, create the solicitation (task)
        const newSolicitation: Task = {
          equipment: this.equipment.id ?? '',
          summary: this.solicitation.descricaoServico,
          title: this.solicitation.defeitoRelatado,
          type: this.solicitation.type,
        };

        console.log('Equipment Id: ', this.equipment.id);

        this.taskService.createTask(newSolicitation).subscribe({
          next: (createdTask) => {
            console.log('Created Task:', createdTask);
            this.task = createdTask;
            // Redirect if needed
            // this.router.navigate(['/task', this.recordIdService.getId(createdTask.id)]);
          },
          error: (error) => {
            console.error('Error creating task:', error);
          },
        });
      },
      error: (error) => {
        console.error('Error creating equipment:', error);
      },
    });
  }
}
