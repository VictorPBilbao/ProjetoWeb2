import { Routes } from '@angular/router';
import { LoginComponent } from './features/pages/login/login.component';
import { HomeComponent } from './features/pages/home/home.component';
import { AboutComponent } from './features/pages/about/about.component';
import { HelpComponent } from './features/pages/help/help.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login',component: LoginComponent},
  { path: 'sobre', component: AboutComponent },
  { path: 'ajuda', component: HelpComponent },
  { path: '**', redirectTo: '' } // Redireciona para home se rota não existir

];
