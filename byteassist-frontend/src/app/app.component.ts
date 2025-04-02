import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './features/components/header/header.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    NgIf
  ],
  templateUrl: './app.component.html', // Referência ao arquivo HTML externo
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'byteassist-frontend';

  constructor(private router: Router) {}

  shouldShowHeader(): boolean {
    const currentUrl = this.router.url;
    return true;
    //
    //!currentUrl.includes('/login') && 
      //     !currentUrl.includes('/register') &&
       //    !currentUrl.includes('/reset-password');
           //
  }
}
