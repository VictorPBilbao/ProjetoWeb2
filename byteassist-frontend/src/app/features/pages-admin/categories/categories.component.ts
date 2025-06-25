import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EquipmentType } from '../../shared/models/equipmentType.model';
import { EquipmentTypeService } from '../../services/equipment/equipmentType.service';
import { Router } from '@angular/router';
import { RecordIdPipe } from '../../shared/pipes/record-id.pipe';
import Swal from 'sweetalert2';

interface EquipmentTypeStructure {
  equipmentType: EquipmentType;
  isEditing: boolean;
}

@Component({
  selector: 'app-categories',
  imports: [
    CommonModule,
    FormsModule,
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
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: this.message,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  addEquipmentType() {
    if (this.newEquipmentType.description?.trim() === '' || this.newEquipmentType.id === '') {
      this.message = 'Descrição e nome são obrigatórios.';
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: this.message,
        confirmButtonText: 'OK'
      });
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
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: this.message,
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/admin/categorias'], { replaceUrl: true });
        });
      },
      error: (error) => {
        console.error('Erro ao adicionar categoria:', error);
        this.message = 'Erro ao adicionar categoria.';
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: this.message,
          confirmButtonText: 'OK'
        });
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
      Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: this.message,
        confirmButtonText: 'OK'
      });
      return;
    }

    this.equipmentTypeService.updateEquipmentType(row.equipmentType).subscribe({
      next: () => {
        row.isEditing = false;
        this.message = 'Categoria atualizada com sucesso.';
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: this.message,
          confirmButtonText: 'OK'
        }).then(() => {
          this.router.navigate(['/admin/categorias'], { replaceUrl: true });
        });
      },
      error: (error) => {
        console.error('Erro ao atualizar categoria:', error);
        this.message = 'Erro ao atualizar categoria.';
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: this.message,
          confirmButtonText: 'OK'
        });
      }
    });
  }

  toggleStatus(row: EquipmentTypeStructure) {
    row.equipmentType.active = !row.equipmentType.active;
  }

  deleteEquipmentType(rowToDelete: EquipmentTypeStructure) {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Essa ação irá excluir a categoria permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.equipmentTypeService.deleteEquipmentType(rowToDelete.equipmentType.id ?? '').subscribe({
          next: () => {
            this.message = 'Categoria excluída com sucesso.';
            Swal.fire({
              icon: 'success',
              title: 'Sucesso',
              text: this.message,
              confirmButtonText: 'OK'
            }).then(() => {
              this.router.navigate(['/admin/categorias'], { replaceUrl: true });
            });
          },
          error: (error) => {
            console.error('Erro ao excluir categoria:', error);
            this.message = 'Erro ao excluir categoria.';
            Swal.fire({
              icon: 'error',
              title: 'Erro',
              text: this.message,
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }
}
