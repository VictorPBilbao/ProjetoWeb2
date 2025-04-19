import { Routes } from '@angular/router';
import { LoginComponent } from './features/pages/login/login.component';
import { HomeComponent } from './features/pages/home/home.component';
import { EmployeeComponent } from './features/pages/employee/employee.component';
import { RegisterComponent } from './features/pages/register/register.component';
import { DashboardComponent } from './features/pages/dashboard/dashboard.component';
import { NewRequestComponent } from './features/pages/new-request/new-request.component';
import { AccountComponent } from './features/pages/account/account.component';
import { BudgetComponent } from './features/pages/budget/budget.component';
import { HelpComponent } from './features/pages/help/help.component';
import { PaymentComponent } from './features/pages/payment/payment.component';

export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login',component: LoginComponent},
  {path: 'employee', component: EmployeeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent },
  {path: 'new-request', component: NewRequestComponent },
  {path: 'account', component: AccountComponent },
  {path: 'budget', component: BudgetComponent },
  {path: 'help', component: HelpComponent },
  {path: 'payment', component: PaymentComponent },
  {path: '**', redirectTo: '' } // Redireciona para home se rota não existir

];
