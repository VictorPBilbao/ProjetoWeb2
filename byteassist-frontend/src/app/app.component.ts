import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './features/components/header/header.component';
import { MenuSidebarComponent } from './features/components/menu-sidebar/menu-sidebar.component';
import { AuthService } from './features/services/auth/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MenuSidebarComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'byteassist-frontend';
  activeSection: string = 'home';

  constructor(private router: Router, private auth: AuthService) {}

  getIsAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

  shouldShowHeader(): boolean {
    const currentRoute = this.router.url;
    return !(currentRoute.includes('login') || currentRoute.includes('register'));
  }
}
