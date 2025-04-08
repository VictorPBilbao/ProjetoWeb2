import { Routes } from '@angular/router';
import { LoginComponent } from './features/pages/login/login.component';
import { HomeComponent } from './features/pages/home/home.component';
import { EmployeeComponent } from './features/pages/employee/employee.component';
import { RegisterComponent } from './features/pages/register/register.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login',component: LoginComponent},
  {path: 'employee', component: EmployeeComponent},
  {path: 'register', component: RegisterComponent},
  { path: '**', redirectTo: '' } // Redireciona para home se rota não existir

];
