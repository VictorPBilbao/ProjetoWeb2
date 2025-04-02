import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  servicos = [
    {
      titulo: "Manutenção",
      descricao: "Manutenção preventiva e corretiva para todos os tipos de equipamentos.",
      imagem: "/images/manutencao.png" 
    },
    {
      titulo: "Assistência Técnica",
      descricao: "Serviços especializados de assistência técnica autorizada.",
      imagem: "images/assistencia.png"
    },
    {
      titulo: "Servidores e Redes",
      descricao: "Instalação, configuração e manutenção de servidores e redes.",
      imagem: "images/base-de-dados.png"
    },
    {
      titulo: "Suporte",
      descricao: "Suporte técnico remoto e presencial para sua empresa.",
      imagem: "/images/suporte.png"
    },
    {
      titulo: "Equipamentos",
      descricao: "Venda e manutenção de equipamentos especializados.",
      imagem: "/images/equipamentos.png"
    }
  ];

  }