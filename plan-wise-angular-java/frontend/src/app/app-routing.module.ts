import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
// import { CategoriesComponent } from './pages/categories/categories.component';
// import { ExpensesComponent } from './pages/expenses/expenses.component';
// import { IncomeComponent } from './pages/income/income.component';
// import { BudgetCalendarComponent } from './pages/budget-calendar/budget-calendar.component';
// import { BudgetTableComponent } from './pages/budget-table/budget-table.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registration', component: RegisterComponent },
  { path: '', component: HomeComponent },
  // { path: 'categories', component: CategoriesComponent },
  // { path: 'expenses', component: ExpensesComponent },
  // { path: 'income', component: IncomeComponent },
  // { path: 'budget-table', component: BudgetTableComponent },
  // { path: 'budget-calendar', component: BudgetCalendarComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
