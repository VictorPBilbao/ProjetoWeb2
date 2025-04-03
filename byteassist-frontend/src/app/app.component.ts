import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './features/components/header/header.component';
import { NgIf } from '@angular/common';
import { HomeComponent } from './features/pages/home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    NgIf,
    HomeComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'byteassist-frontend';
  @ViewChild('home') home?: HomeComponent;
  activeSection: string = 'home';

  constructor(private router: Router) {}

  shouldShowHeader(): boolean {
    const currentUrl = this.router.url;
    return true;
    // Descomente quando quiser esconder o header em certas rotas:
    // return !currentUrl.includes('/login') && 
    //        !currentUrl.includes('/register') &&
    //        !currentUrl.includes('/reset-password');
  }
}