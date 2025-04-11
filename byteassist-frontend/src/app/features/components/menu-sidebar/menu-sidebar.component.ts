import { Component } from '@angular/core';

@Component({
  selector: 'app-menu-sidebar',
  imports: [],
  templateUrl: './menu-sidebar.component.html',
  styleUrl: './menu-sidebar.component.css'
})
export class MenuSidebarComponent {
  userName: string = 'Victor Bilbao';
  searchTerm : string = '';

  getUserInitals(): string {
    if (!this.userName) return '';
    return this.userName
      .split(' ')
      .map(name => name[0])
      .join('')
      .toUpperCase();
  }
}
