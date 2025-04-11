import { Component, ViewChild } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd} from '@angular/router';
import { HeaderComponent } from './features/components/header/header.component';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    CommonModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'byteassist-frontend';
  activeSection: string = 'home';
  showHeader: boolean = true;

  constructor(private router: Router) {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        //const noHeaderRoutes = ['/dashboard', '/register']; // Rotas sem header
        const noHeaderRoutes = ['/dashboard','/new-request'];
        this.showHeader = !noHeaderRoutes.some(route => 
          event.urlAfterRedirects.includes(route)
        );
      });
  }
}

//export class AppComponent {
  //title = 'byteassist-frontend';
  //activeSection: string = 'home';

  //constructor(private router: Router) {}

//}
