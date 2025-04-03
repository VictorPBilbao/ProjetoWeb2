import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

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
  @Input() activeSection: string = 'home';
  logoPath: string = '/images/byte.png';
  companyName: string = 'Byte Assist';
  public window = window;
  
  navItems = [
    { path: '/', icon: 'bi-house-door', label: 'Home', section: 'home' },
    { path: '/', icon: 'bi-tools', label: 'Serviços', section: 'servicos' },
    { path: '/', icon: 'bi-people', label: 'Clientes', section: 'clientes' },
    { path: '/sobre', icon: 'bi-building', label: 'Sobre Nós', section: 'sobre' },
    { path: '/contato', icon: 'bi-envelope', label: 'Contato', section: 'contato' },
    { path: '/login', icon: 'bi-box-arrow-in-right', label: 'Login' }
  ];

  constructor(private router: Router) {}

  handleNavClick(item: any, event: MouseEvent): void {
    if (!item.section) return;
    
    event.preventDefault();
    
    // Navega para a rota com fragmento
    this.router.navigate([item.path], { 
      fragment: item.section,
      replaceUrl: true
    }).then(() => {
      // Scroll suave após navegação
      const element = document.getElementById(item.section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  shouldUseRouterLinkActive(item: any): boolean {
    // Usa routerLinkActive apenas para itens sem seção ou quando está na rota exata
    return !item.section || (item.path !== '/' && this.router.url.split('#')[0] === item.path);
  }
}