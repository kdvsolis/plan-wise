import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { BudgetTableService } from '../../../services/budget-table.service';
import { NoteService } from '../../../services/notes.service';
import { NotesModalComponent } from '../../components/notes-modal/notes-modal.component';
import { ExpenseModalComponent } from '../../components/expense-modal/expense-modal.component';
import { IncomeModalComponent } from '../../components/income-modal/income-modal.component';
import { ModifyInstanceModalComponent } from '../../components/modify-instance-modal/modify-instance-modal.component';
import * as moment from 'moment';

@Component({
  selector: 'app-budget-table',
  templateUrl: './budget-table.component.html',
  styleUrls: ['./budget-table.component.css', '../../../assets/components.css', '../../../assets/budgeting-app.css']
})
export class BudgetTableComponent implements OnInit {
  currMonth = -1;
  currYear = -1;
  initialBalance: any = 0;
  monthDailyData: any = {};
  selectedDate = new Date().toISOString();
  balanceHistory: any = [];
  months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  calendar: any = [];
  mediaQuery = window.matchMedia("(min-width: 724px)");
  isLargeScreen = this.mediaQuery.matches;
  currentNotes = {
    notes: ""
  };

  selectedOptionCategoryHeader: any = "";
  selectedClassCategoryHeader = "";
  selectedOptionHeader = "";
  selectedClassHeader = "";
  selectedOption = "";
  selectedClass = "";
  headerExpense = "";
  headerSource = "";
  headerAmount = 0;
  headerDate = "";
  selectedInstance = {
    expense: [],
    income: []
  };

  @ViewChild('noteModal') noteModal!: NotesModalComponent;
  @ViewChild('expenseModal') expenseModal!: ExpenseModalComponent;
  @ViewChild('incomeModal') incomeModal!: IncomeModalComponent;
  @ViewChild('modifyInstanceModal') modifyInstanceModal!: ModifyInstanceModalComponent;

  constructor(private accountAPI: AccountService, private budgetTableAPI: BudgetTableService, private notesAPI: NoteService) { }

  ngOnInit(): void {
    document.title = "Plan Wise - Budget Table";
    this.initializeData();
  }

  async initializeData() {
    const user: any = (await this.accountAPI.getUser());
    this.initialBalance = user?.balance || 0;
    const monthDailyData: any = (await this.budgetTableAPI.getBudgetsInDateRange(undefined));
    const currMonth = moment(Object.keys(monthDailyData.budgets)[0]).month();
    const currYear = moment(Object.keys(monthDailyData.budgets)[0]).year();
    this.currMonth = currMonth;
    this.currYear = currYear;
    const calendar = this.getDaysInMonth(new Date(currYear, currMonth, 1), new Date(currYear, currMonth + 1, 0));
    this.calendar = calendar;
    await this.generate(monthDailyData.budgets, user?.user.balance || 0);
  }

  async generate(monthDailyData: any, initialBalance: any) {
    let prevKey = Object.keys(monthDailyData)[0];
    for (let key of Object.keys(monthDailyData)) {
      const income = monthDailyData[key].income.reduce((total: any, current: any) => total + current.amount, 0);
      const expense = monthDailyData[key].expense.reduce((total: any, current: any) => total + current.amount, 0);
      const currentBalance = (monthDailyData[prevKey].currentBalance || initialBalance) + income - expense;
      monthDailyData[key].previousBalance = monthDailyData[prevKey].currentBalance ? monthDailyData[prevKey].currentBalance : initialBalance;
      monthDailyData[key].currentBalance = currentBalance;
      prevKey = key;
    }
    this.monthDailyData = monthDailyData;
  }

  async incrementMonth() {
    const monthData = Object.keys(this.monthDailyData);
    const newMonth = moment(monthData[0]).add(1, 'M').month();
    const newYear = moment(monthData[0]).add(1, 'M').year();
    this.currMonth = newMonth;
    this.currYear = newYear;
    this.balanceHistory.push(this.initialBalance);
    this.balanceHistory = this.balanceHistory;
    const calendar = this.getDaysInMonth(new Date(newYear, newMonth, 1), new Date(newYear, newMonth + 1, 0));
    this.calendar = calendar;
    const newInitialBalance = this.monthDailyData[monthData[monthData.length - 1]].currentBalance;
    this.initialBalance = newInitialBalance;
    const newCurrentBalance = newInitialBalance;
    this.initialBalance = newCurrentBalance;
    await this.getMonthlyData(newMonth, newYear, newInitialBalance);
    this.calendar = calendar;
  }
  

  async decrementMonth() {
    const monthData = Object.keys(this.monthDailyData);
    const newMonth = moment(monthData[0]).subtract(1, 'M').month();
    const newYear = moment(monthData[0]).subtract(1, 'M').year();
    let newInitialBalance: any = 0;
    this.currMonth = newMonth;
    this.currYear = newYear;
    const calendar = this.getDaysInMonth(new Date(newYear, newMonth, 1), new Date(newYear, newMonth + 1, 0));
    this.calendar = calendar;
    if (this.balanceHistory.length > 0) {
      newInitialBalance = this.balanceHistory.pop();
      this.initialBalance = newInitialBalance;
    }
    this.initialBalance = newInitialBalance;
    this.calendar = calendar;
    await this.getMonthlyData(newMonth, newYear, newInitialBalance);
  }
  
  getDaysInMonth(start: any, end: any) {
    const dates = [];
    let current = new Date(start);
    let index = 1;
    while (current <= end) {
      dates.push({
        date: moment(current).format('YYYY-MM-DD').toString(),
        dayOfWeek: current.getDay(),
        index: index
      });
      current.setDate(current.getDate() + 1);
      current = new Date(current);
      index++;
    }
    return dates;
  }
  
  async changeInitialBalance() {
    await this.accountAPI.updateUser({
      balance: this.initialBalance
    });
    await this.initializeData();
  }
  
  addIncomeModal(date: any) {
    this.selectedDate = date;
    this.headerDate = date;
    this.selectedOptionHeader = 'Select Interval';
    this.selectedClassHeader = '';
    this.selectedOption = 'Select Interval';
    this.selectedClass = '';
    this.headerSource = '';
    this.headerAmount = 0;
    this.incomeModal.open();
  }
  
  addExpenseModal(date: any) {
    this.selectedDate = date;
    this.headerDate = date;
    this.selectedOptionCategoryHeader = { category_name: 'Select Category' };
    this.selectedClassCategoryHeader = '';
    this.selectedOptionHeader = 'Select Interval';
    this.selectedClassHeader = '';
    this.selectedOption = 'Select Interval';
    this.selectedClass = '';
    this.headerExpense = '';
    this.headerAmount = 0;
    this.expenseModal.open();
  }
  
  selectedInstanceModal(date: any) {
    this.selectedDate = date;
    this.selectedInstance = this.monthDailyData[date];
    this.modifyInstanceModal.open();
  }
  
  async notesModal(date: any) {
    try {
      let noteResponse: any = await this.notesAPI.getByDate(date);
      this.currentNotes = noteResponse.notes[0] || {
        notes: ""
      };
      this.selectedDate = date;
      this.noteModal.open(this.currentNotes, this.selectedDate);
    } catch(e) {
      this.currentNotes = {
        notes: ""
      };
      this.selectedDate = date;
      this.noteModal.open(this.currentNotes, this.selectedDate);
    }
  }
  
  async refreshTable() {
    const month = moment(this.selectedDate).month();
    const year = moment(this.selectedDate).year();
    const calendar = this.getDaysInMonth(new Date(year, month, 1), new Date(year, month + 1, 0));
    this.calendar = calendar;
    const initBalance = this.monthDailyData[this.selectedDate].previousBalance;
    this.initialBalance = initBalance;
    await this.getMonthlyData(month, year, initBalance);
    this.calendar = calendar;
    this.expenseModal.close();
    this.incomeModal.close();
    this.modifyInstanceModal.close();
  }
  async getMonthlyData(month: any, year: any, initialBalance: any) {
    console.log(initialBalance);
    this.currMonth = month;
    this.currYear = year;
    console.log(new Date(year, month, 1));
    const result: any = await this.budgetTableAPI.getBudgetsInDateRange(moment(new Date(year, month, 1)).format("YYYY-MM-DD"));
    const monthDailyData = result.budgets || {};
    this.monthDailyData = monthDailyData;
    let prevKey = Object.keys(monthDailyData)[0];
    for (let key of Object.keys(monthDailyData)) {
      const income = monthDailyData[key].income.reduce((total: any, current: any) => total + current.amount, 0);
      const expense = monthDailyData[key].expense.reduce((total: any, current: any) => total + current.amount, 0);
      const currentBalance = (monthDailyData[prevKey].currentBalance || initialBalance) + income - expense;
      monthDailyData[key].previousBalance = monthDailyData[prevKey].currentBalance ? monthDailyData[prevKey].currentBalance : initialBalance;
      monthDailyData[key].currentBalance = currentBalance;
      prevKey = key;
    }
    this.monthDailyData = monthDailyData;
    const calendar = this.getDaysInMonth(new Date(year, month, 1), new Date(year, month + 1, 0));
    this.calendar = calendar;
  }
  
  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.updateMediaQuery(event);
  }
  
  updateMediaQuery(event: any) {
    this.mediaQuery = event.target;
    this.isLargeScreen = window.matchMedia("(min-width: 724px)").matches;
  }

  getBalanceDisplay(balance: number): string {
    if (balance > 0) {
      return `$${balance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (!isNaN(balance)) {
      return `-$${Math.abs(balance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return '';
    }
  }

  getIncomeDisplay(income: any[]): string {
    if (income.length > 0) {
      const totalIncome = income.reduce((total, current) => total + current.amount, 0);
      return `$${totalIncome.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else {
      return '';
    }
  }

  getArray(length: number): any[] {
    return Array(length);
  }

}
