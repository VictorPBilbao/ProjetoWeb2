import { Component, Input, OnInit, AfterViewInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Input() variant: 'default' | 'login' = 'default';
  @Input() customButtons: { icon: string, label: string, action: () => void }[] = [];
  @Input() activeSection: string = 'home';
  logoPath: string = '/images/byte.png';
  companyName: string = 'Byte Assist';

  constructor(private router: Router) {}

  ngOnInit(): void {

  }

  // Aplica a classe .active nos links
  ngAfterViewInit(): void {
    this.updateActiveLink();
  }

  private updateActiveLink(): void {
    const navLinks: NodeListOf<HTMLAnchorElement> = document.querySelectorAll('.nav-item');

    if (navLinks.length > 0) {
      navLinks[0].classList.add('active');
    }

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }
}
