import { EquipmentService } from './../../services/equipment/equipment.service';
import { Equipment } from './../../shared/models/equipment.model';
import { Component, inject, ViewChild, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router'; // Para redirecionar após o cadastro
import { TaskService } from '../../services/task/task.service';
import { Task } from '../../shared/models/task.model';
import { RecordidService } from '../../services/utils/recordid.service';
import { EquipmentTypeService } from '../../services/equipment/equipmentType.service';
import { EquipmentType } from '../../shared/models/equipmentType.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-request',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css'],
})
export class NewRequestComponent implements OnInit {
  @ViewChild('registerForm') registerForm!: NgForm | undefined;
  taskService = inject(TaskService);
  equipmentService = inject(EquipmentService);
  equipmentTypeService = inject(EquipmentTypeService);
  recordIdService = inject(RecordidService); // Made public for template access
  equipment: Equipment = {};
  task: Task = {} as Task;

  // Available equipment types from API
  equipmentTypes: EquipmentType[] = [];
  equipmentTypesDisplay: string[] = []; // For display purposes

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
  brands = ['Acer', 'Apple', 'Dell', 'Lenovo', 'LG', 'Samsung', 'Outro'];

  type = [
    'Manutenção',
    'Instalação',
    'Upgrade',
    'Formatação',
    'Limpeza',
    'Atualização',
  ];
  // Injeção de dependências
  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    // Load active equipment types on component initialization
    this.loadEquipmentTypes();
  }

  /**
   * Load active equipment types from the API
   */
  loadEquipmentTypes(): void {
    this.equipmentTypeService.getAllActiveEquipmentTypes().subscribe({
      next: (equipmentTypes) => {
        this.equipmentTypes = equipmentTypes;
        // Create display array with clean IDs for dropdown
        this.equipmentTypesDisplay = equipmentTypes.map((type) =>
          this.recordIdService.getId(type.id ?? '')
        );
        console.log('Equipment Types loaded:', this.equipmentTypes);
      },
      error: (error) => {
        console.error('Error loading equipment types:', error);
        Swal.fire(
          'Erro',
          'Não foi possível carregar os tipos de equipamento.',
          'error'
        );
      },
    });
  }
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
      type: this.solicitation.categoria, // This will now contain the selected EquipmentType ID
    };

    // send a request to create the equipment and log the response as a Equipment object
    this.equipmentService.createEquipment(newEquipment).subscribe({
      next: (createdEquipment) => {
        console.log('Created Equipment:', createdEquipment);
        this.equipment = createdEquipment;        // Now that equipment is created, create the solicitation (task)
        const newSolicitation: Task = {
          equipment: this.equipment.id ?? '',
          title: this.solicitation.descricaoServico, // NOME DO SERVIÇO should be the title
          summary: this.solicitation.defeitoRelatado, // RELATO should be the summary
          type: this.solicitation.type,
        };

        console.log('Equipment Id: ', this.equipment.id);

        this.taskService.createTask(newSolicitation).subscribe({
          next: (createdTask) => {
            console.log('Created Task:', createdTask);
            this.task = createdTask;

            Swal.fire({
              title: 'Sucesso!',
              text: 'Task criada com sucesso.',
              icon: 'success',
              confirmButtonText: 'OK',
            }).then(() => {
              this.router.navigate(['/solicitacoes']);
            });
          },
          error: (error) => {
            console.error('Error creating task:', error);
            Swal.fire('Erro', 'Não foi possível criar a task.', 'error');
          },
        });
      },
      error: (error) => {
        console.error('Error creating equipment:', error);
        Swal.fire('Erro', 'Não foi possível criar o equipamento.', 'error');
      },
    });
  }
}
