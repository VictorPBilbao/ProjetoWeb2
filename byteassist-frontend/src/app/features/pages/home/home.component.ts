import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterModule} from '@angular/router';  // Adicione esta importação
import { ModalComponent } from '../../../features/components/modal/modal.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports:[RouterModule, ModalComponent],
})
export class HomeComponent implements OnInit, OnDestroy {
  activeSection: string = 'home';
  private scrollTimeout: any;
  private sections = ['home', 'servicos', 'clientes', 'sobre', 'contato', 'localizacao'];
 
  activeModal: 'contact' | 'help' | null = null;
  isConfirmed = false;

  constructor(private router: Router) {}

  redirectToLogin() {
    this.router.navigate(['/login']);
  }

  openModal(modalType: 'contact' | 'help') {
    this.activeModal = modalType;
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    this.activeModal = null;
    document.body.style.overflow = 'auto';
  }

  confirmAndClose() {
    this.isConfirmed = true;
    setTimeout(() => {
      this.closeModal();
      this.isConfirmed = false;
    }, 300);
  }

  servicos = [
    {
      titulo: "Manutenção",
      descricao: "Manutenção preventiva e corretiva para todos os tipos de equipamentos.",
      imagem: "/images/manutencao.png" 
    },
    {
      titulo: "Assistência Técnica",
      descricao: "Serviços especializados de assistência técnica autorizada.",
      imagem: "images/assistencia.png"
    },
    {
      titulo: "Servidores e Redes",
      descricao: "Instalação, configuração e manutenção de servidores e redes.",
      imagem: "images/base-de-dados.png"
    },
    {
      titulo: "Suporte",
      descricao: "Suporte técnico remoto e presencial para sua empresa.",
      imagem: "/images/suporte.png"
    },
    {
      titulo: "Equipamentos",
      descricao: "Venda e manutenção de equipamentos especializados.",
      imagem: "/images/equipamentos.png"
    }
  ];
  
  ngOnInit() {
    // Verifica o hash ao inicializar
    this.checkInitialHash();
    
    // Configura um listener para mudanças de hash
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
  }

  ngOnDestroy() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    window.removeEventListener('hashchange', this.handleHashChange.bind(this));
  }

  private checkInitialHash() {
    if (window.location.hash) {
      const sectionFromHash = window.location.hash.replace('#', '');
      if (this.sections.includes(sectionFromHash)) {
        this.scrollTo(sectionFromHash, false); // false para não atualizar a URL novamente
      }
    }
  }

  private handleHashChange() {
    const sectionFromHash = window.location.hash.replace('#', '');
    if (sectionFromHash && this.sections.includes(sectionFromHash) && sectionFromHash !== this.activeSection) {
      this.scrollTo(sectionFromHash, false);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (this.scrollTimeout) {
      clearTimeout(this.scrollTimeout);
    }
    
    this.scrollTimeout = setTimeout(() => {
      this.checkActiveSection();
    }, 100);
  }

  checkActiveSection() {
    const scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
    
    let maxVisibleRatio = 0;
    let mostVisibleSection = 'home';

    for (const section of this.sections) {
      const element = document.getElementById(section);
      if (element) {
        const rect = element.getBoundingClientRect();
        const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
        const visibleRatio = visibleHeight / element.offsetHeight;
        
        if (visibleRatio > maxVisibleRatio) {
          maxVisibleRatio = visibleRatio;
          mostVisibleSection = section;
        }
      }
    }

    // Atualiza a URL apenas se mudou a seção
    if (mostVisibleSection !== this.activeSection) {
      this.updateUrlHash(mostVisibleSection);
    }
    
    this.activeSection = mostVisibleSection;
  }

  private updateUrlHash(section: string) {
    // Usa o Router do Angular para atualizar o hash
    this.router.navigate([], { 
      fragment: section,
      replaceUrl: true 
    });
  }

  scrollTo(section: string, updateUrl: boolean = true) {
    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      this.activeSection = section;
      
      if (updateUrl) {
        this.updateUrlHash(section);
      }
    }
  }
}