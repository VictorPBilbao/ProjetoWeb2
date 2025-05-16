import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Categoria {
  id: number | null;
  nome: string;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
  ],
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  listaCategorias: Categoria[] = [];
  categoriaAtual: Categoria = { id: null, nome: '' };
  modoEdicao: boolean = false;

  constructor() {
     this.listaCategorias = [
       { id: 1, nome: 'Desktop' },
       { id: 2, nome: 'Notebook' },
       { id: 3, nome: 'Tablet' }
     ];
  }

  ngOnInit(): void {
    this.carregarCategorias();
  }

  carregarCategorias(): void {
    console.log('Buscando categorias da API...');
  }

  salvarCategoria(): void {
    if (!this.categoriaAtual.nome || !this.categoriaAtual.nome.trim()) {
      alert('O nome da categoria não pode estar vazio.');
      return;
    }

    if (this.modoEdicao) {
      console.log('Atualizando categoria:', this.categoriaAtual);
      const index = this.listaCategorias.findIndex(cat => cat.id === this.categoriaAtual.id);
      if (index !== -1) {
        this.listaCategorias[index] = { ...this.categoriaAtual };
      }
      alert('Categoria atualizada com sucesso!');
      this.resetarFormulario();

    } else {
      console.log('Adicionando categoria:', this.categoriaAtual);
      const novaCategoria: Categoria = {
        id: new Date().getTime(),
        nome: this.categoriaAtual.nome.trim()
      };
      this.listaCategorias.push(novaCategoria);
      alert('Categoria adicionada com sucesso!');
      this.resetarFormulario();

    }
  }

  editarCategoria(categoria: Categoria): void {
    console.log('Preparando para editar:', categoria);
    this.modoEdicao = true;
    this.categoriaAtual = { ...categoria };
  }

  excluirCategoria(id: number | null): void {
    if (id === null) return;
  
    const categoria = this.listaCategorias.find(cat => cat.id === id);
    if (!categoria) return;
  
    if (confirm(`Tem certeza que deseja excluir a categoria "${categoria.nome}" (ID: ${categoria.id})? Esta ação não pode ser desfeita.`)) {
      console.log('Excluindo categoria ID:', id);
      this.listaCategorias = this.listaCategorias.filter(cat => cat.id !== id);
      if(this.modoEdicao && this.categoriaAtual.id === id){
        this.resetarFormulario();
      }
      alert('Categoria excluída com sucesso!');

    }
  }

  cancelarEdicao(): void {
    console.log('Edição cancelada.');
    this.resetarFormulario();
  }

  private resetarFormulario(): void {
    this.categoriaAtual = { id: null, nome: '' };
    this.modoEdicao = false;
  }
}