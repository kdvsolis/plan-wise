import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/app-header/app-header.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { HomeComponent } from './pages/home/home.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';
import { ExpensesComponent } from './pages/expenses/expenses.component';
import { IncomeComponent } from './pages/income/income.component';
import { BudgetCalendarComponent } from './pages/budget-calendar/budget-calendar.component';
import { NotesModalComponent } from './components/notes-modal/notes-modal.component';
import { ExpenseModalComponent } from './components/expense-modal/expense-modal.component';
import { IncomeModalComponent } from './components/income-modal/income-modal.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    CategoriesComponent,
    ConfirmationModalComponent,
    ExpensesComponent,
    IncomeComponent,
    BudgetCalendarComponent,
    NotesModalComponent,
    ExpenseModalComponent,
    IncomeModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
