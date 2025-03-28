import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './features/components/header/header.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'byteassist-frontend';

  constructor(private router: Router) {}
  shouldShowHeader(): boolean {
    const currentUrl = this.router.url;
    return currentUrl === '/' ||
           (!currentUrl.includes('/login') &&
            !currentUrl.includes('/register') &&
            !currentUrl.includes('/reset-password'));
  }
}
