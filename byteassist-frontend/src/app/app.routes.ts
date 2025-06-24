import { Routes } from '@angular/router';
import { authGuard } from './features/services/auth/auth.guard';

// Páginas padrão
import { LoginComponent } from './features/pages/login/login.component';
import { HomeComponent } from './features/pages/home/home.component';

//Páginas do cliente
import { ListMyTasksComponent } from './features/pages/list-my-tasks/list-my-tasks.component';
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
import { TaskViewComponent } from './features/pages/task-view/task-view.component';
import { CategoriesComponent } from './features/pages-admin/categories/categories.component';

//Páginas de admin
import { EmployeesComponent } from './features/pages-admin/employees/employees.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  {
    path: 'solicitacoes',
    component: ListMyTasksComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_CLIENT'
    }
  },
  { path: 'cadastro', component: RegisterComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_CLIENT'
    }
  },
  {
    path: 'nova-solicitacao',
    component: NewRequestComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_CLIENT'
    }
  },
  {
    path: 'conta',
    component: AccountComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_CLIENT'
    }
  },
  {
    path: 'orcamentos',
    component: BudgetComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_CLIENT'
    }
  },
  {
    path: 'orcamentos/:taskId',
    component: BudgetComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_CLIENT'
    }
  },
  {
    path: 'ajuda',
    component: HelpComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_CLIENT'
    }
  },
  {
    path: 'pagamentos/:taskId',
    component: PaymentComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_CLIENT'
    }
  },
  {
    path: 'funcionario/orcamentos',
    component: BudgetingComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_EMPLOYEE'
    }
  },
  {
    path: 'funcionario/orcamentos/:taskId',
    component: BudgetingComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_EMPLOYEE'
    }
  },
  {
    path: 'funcionario/solicitacoes',
    component: RequestsComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_EMPLOYEE'
    }
  },
  {
    path: 'admin/categorias',
    component: CategoriesComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_ADMIN'
    }
  },
  {
    path: 'solicitacao/:taskId',
    component: TaskViewComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_CLIENT, RULE_EMPLOYEE'
    }
  },
  {
    path: 'funcionario/solicitacao/:taskId',
    component: TaskViewComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_EMPLOYEE'
    }
  },
  {
    path: 'admin/funcionarios',
    component: EmployeesComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_ADMIN'
    }
  },
  {
    path: 'admin/cadastrar-funcionario',
    component: RegisterComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_ADMIN'
    }
  },
  {
    path: 'admin/funcionario/:id',
    component: AccountComponent,
    canActivate: [authGuard],
    data: {
      role: 'RULE_ADMIN'
    }
  },
  { path: '**', redirectTo: '' } // Redireciona para home se rota não existir
];
