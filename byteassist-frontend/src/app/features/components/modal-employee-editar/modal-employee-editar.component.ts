import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EmployeeService } from '../../services/employee/employee.service';
import { Employee } from '../../shared/models/employee.model';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

declare const bootstrap: any;

@Component({
  selector: 'app-modal-employee-editar',
  standalone: true,  // Adicione esta linha
  imports: [FormsModule, CommonModule],
  templateUrl: './modal-employee-editar.component.html',
  styleUrl: './modal-employee-editar.component.css'
})
export class ModalEmployeeEditarComponent implements OnInit, AfterViewInit {
  @ViewChild('modalRef') modalRef!: ElementRef;
  private modalInstance: any;

  solicitacoes: Employee[] = [];
  selecionado: Employee = {} as Employee;
  categorias: string[] = [];
  marcas: string[] = [];

  constructor(private service: EmployeeService) {}

  ngOnInit(): void {
    this.carregarDados();
  }

  ngAfterViewInit(): void {
    // Inicializa o modal quando a view estiver pronta
    if (this.modalRef) {
      this.modalInstance = new bootstrap.Modal(this.modalRef.nativeElement);
    }
  }

  carregarDados() {
  this.service.listar().subscribe(s => {
    this.solicitacoes = s;
  });
}

  abrirModal() {
    if (this.modalInstance) {
      this.modalInstance.show();
    } else {
      console.error('Modal não inicializado');
      // Tenta inicializar novamente se falhar
      this.ngAfterViewInit();
      if (this.modalInstance) {
        this.modalInstance.show();
      }
    }
  }

  editar(s: Employee) {
  this.selecionado = { ...s };

  this.service.getEquipamentos().subscribe(equipamentos => {
    const tiposSet = new Set(equipamentos.map(e => e.type));
    const marcasSet = new Set(equipamentos.map(e => e.brand));

    // Garante que o valor atual esteja presente
    if (this.selecionado.categoria && !tiposSet.has(this.selecionado.categoria)) {
      tiposSet.add(this.selecionado.categoria);
    }

    if (this.selecionado.marca && !marcasSet.has(this.selecionado.marca)) {
      marcasSet.add(this.selecionado.marca);
    }

    this.categorias = [...tiposSet].sort();
    this.marcas = [...marcasSet].sort();

    this.abrirModal(); // Chama o modal depois de carregar categorias/marcas
  });
}

  salvarEdicao() {
    this.service.editar(this.selecionado).subscribe(() => {
      this.carregarDados();
      if (this.modalInstance) {
        this.modalInstance.hide();
      }
    });
  }
}