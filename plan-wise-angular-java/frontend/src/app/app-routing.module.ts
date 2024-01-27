import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
// import { IncomeComponent } from './pages/income/income.component';
// import { BudgetCalendarComponent } from './pages/budget-calendar/budget-calendar.component';
// import { BudgetTableComponent } from './pages/budget-table/budget-table.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegisterComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'categories', component: CategoriesComponent, canActivate: [AuthGuard] },
  { path: 'expenses', component: ExpensesComponent },
  // { path: 'income', component: IncomeComponent, canActivate: [AuthGuard] },
  // { path: 'budget-table', component: BudgetTableComponent, canActivate: [AuthGuard] },
  // { path: 'budget-calendar', component: BudgetCalendarComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
