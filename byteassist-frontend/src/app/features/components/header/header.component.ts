import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  @Input() variant: 'default' | 'login' = 'default';
  @Input() customButtons: { icon: string, label: string, action: () => void }[] = [];
  
  logoPath: string = '/images/byte.png';
  companyName: string = 'Byte Assist';
  
  navItems = [
    { path: '/', icon: 'bi-house-door', label: 'Home' },
    { path: '/sobre', icon: 'bi-building', label: 'Sobre Nós' },
    { path: '/ajuda', icon: 'bi-question-circle', label: 'Ajuda' },
    { path: '/login', icon: 'bi-box-arrow-in-right', label: 'Login' }
  ];

  // Método para destacar o item ativo
  isActive(path: string): boolean {
    return window.location.pathname === path;
  }
}