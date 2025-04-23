import { Routes } from '@angular/router';

// Páginas padrão
import { LoginComponent } from './features/pages/login/login.component';
import { HomeComponent } from './features/pages/home/home.component';

//Páginas do cliente
import { EmployeeComponent } from './features/pages/employee/employee.component';
import { RegisterComponent } from './features/pages/register/register.component';
import { DashboardComponent } from './features/pages/dashboard/dashboard.component';
import { NewRequestComponent } from './features/pages/new-request/new-request.component';
import { AccountComponent } from './features/pages/account/account.component';
import { BudgetComponent } from './features/pages/budget/budget.component';
import { HelpComponent } from './features/pages/help/help.component';
import { PaymentComponent } from './features/pages/payment/payment.component';

// Páginas do funcionário
import { BudgetingComponent } from './features/pages-employee/budgeting/budgeting.component';
import { RequestsComponent } from './features/pages-employee/requests/requests.component';


export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'login',component: LoginComponent},
  {path: 'solicitacoes', component: EmployeeComponent},
  {path: 'cadastro', component: RegisterComponent},
  {path: 'dashboard', component: DashboardComponent },
  {path: 'nova-solicitacao', component: NewRequestComponent },
  {path: 'conta', component: AccountComponent },
  {path: 'orcamentos', component: BudgetComponent },
  {path: 'ajuda', component: HelpComponent },
  {path: 'pagamentos', component: PaymentComponent },
  {path: 'funcionario/orcamentos', component: BudgetingComponent },
  {path: 'funcionario/solicitacoes', component: RequestsComponent },
  {path: '**', redirectTo: '' } // Redireciona para home se rota não existir

];
