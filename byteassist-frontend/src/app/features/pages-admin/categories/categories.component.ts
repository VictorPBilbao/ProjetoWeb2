import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentType } from '../../shared/models/equipmentType.model';
import { EquipmentTypeService } from '../../services/equipment/equipmentType.service';
import { NotificationComponent } from '../../components/notification/notification.component';
import { Router } from '@angular/router';
import { RecordIdPipe } from '../../shared/pipes/record-id.pipe';

interface EquipmentTypeStructure {
  equipmentType: EquipmentType;
  isEditing: boolean;
}

@Component({
  selector: 'app-categories',
  imports: [
    CommonModule,
    FormsModule,
    NotificationComponent,
    RecordIdPipe
  ],

  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})

export class CategoriesComponent {
  equipmentTypeList: EquipmentTypeStructure[] = [];
  newEquipmentType: EquipmentType = {
    description: '',
    active: true,
    createdAt: new Date()
  };
  message: string = '';
  showNotification: boolean = false;

  constructor(
    private equipmentTypeService: EquipmentTypeService,
    private router: Router
  ) { }

  ngOnInit() {
    this.equipmentTypeService.getAllEquipmentTypes().subscribe({
      next: (types) => {
        this.equipmentTypeList = types.map(type => ({
          equipmentType: type,
          isEditing: false
        }));
      },
      error: (error) => {
        console.error('Erro ao carregar categorias:', error);
        this.message = 'Erro ao carregar categorias.';
        this.showNotification = true;
      }
    });
  }

  addEquipmentType() {
    if (this.newEquipmentType.description?.trim() === '' || this.newEquipmentType.id === '') {
      this.message = 'Descrição e nome são obrigatórios.';
      this.showNotification = true;
      return;
    }

    this.equipmentTypeService.createEquipmentType(this.newEquipmentType, this.newEquipmentType.id ?? '').subscribe({
      next: (createdType) => {
        this.equipmentTypeList.push({
          equipmentType: createdType,
          isEditing: false
        });
        this.newEquipmentType = { description: '', active: true, createdAt: new Date() }; // Reset form
        this.message = 'Categoria adicionada com sucesso.';
        this.showNotification = true;
        this.router.navigate(['/admin/categorias']);
      },
      error: (error) => {
        console.error('Erro ao adicionar categoria:', error);
        this.message = 'Erro ao adicionar categoria.';
        this.showNotification = true;
      }
    });
  }

  toggleEdit(row: EquipmentTypeStructure) {
    if (row.isEditing) {
      this.saveEdit(row);
    }
    row.isEditing = !row.isEditing;
  }

  saveEdit(row: EquipmentTypeStructure) {

    if (row.equipmentType.description?.trim() === '') {
      this.message = 'Descrição é obrigatória.';
      this.showNotification = true;
      return;
    }

    this.equipmentTypeService.updateEquipmentType(row.equipmentType).subscribe({
      next: () => {
        row.isEditing = false;
        this.message = 'Categoria atualizada com sucesso.';
        this.showNotification = true;
        this.router.navigate(['/admin/categorias']);
      },
      error: (error) => {
        console.error('Erro ao atualizar categoria:', error);
        this.message = 'Erro ao atualizar categoria.';
        this.showNotification = true;
      }
    });
  }

  toggleStatus(row: EquipmentTypeStructure) {
    row.equipmentType.active = !row.equipmentType.active;
  }

  deleteEquipmentType(rowToDelete: EquipmentTypeStructure) {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return;
    }

    this.equipmentTypeService.deleteEquipmentType(rowToDelete.equipmentType.id ?? '').subscribe({
      next: () => {
        this.equipmentTypeList = this.equipmentTypeList.filter(row => row !== rowToDelete);
        this.message = 'Categoria excluída com sucesso.';
        this.showNotification = true;
      },
      error: (error) => {
        console.error('Erro ao excluir categoria:', error);
        this.message = 'Erro ao excluir categoria.';
        this.showNotification = true;
      }
    });
  }
}
