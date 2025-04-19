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

  openSidebar(): void {
    const widthScreen = window.innerWidth;

    if (widthScreen <= 768) {
      const sidebar = document.querySelector('.sidebar') as HTMLElement;
      const textsSidebar = document.querySelectorAll('.nav-link-text') as NodeListOf<HTMLElement>;
      const menuUserName = document.querySelector('.menu-user-name') as HTMLElement;
      const menuSearchContainer = document.querySelector('.menu-search-container') as HTMLElement;
      var opacity = "0";
      var width = "0px";

      opacity = sidebar.classList.contains('open') ? '0' : '1';
      width = sidebar.classList.contains('open') ? '0px' : 'auto';
      sidebar.classList.toggle('open');

      textsSidebar.forEach((text) => {
        text.style.opacity = opacity;
        text.style.width = width;
      });

      menuUserName.style.opacity = opacity;
      menuUserName.style.width = width;

      menuSearchContainer.style.opacity = opacity;
      menuSearchContainer.style.width = width;
    }
  }
}
