import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { BudgetTableService } from '../../../services/budget-table.service';
import * as moment from 'moment';

@Component({
  selector: 'app-budget-calendar',
  templateUrl: './budget-calendar.component.html',
  styleUrls: ['./budget-calendar.component.css', '../../../assets/components.css', '../../../assets/budgeting-app.css']
})

export class BudgetCalendarComponent implements OnInit {
  expense = [];
  income = [];
  currMonth = -1;
  currYear = -1;
  total = 365;
  initialBalance = 0;
  monthDailyData: any = {};
  monthlyData: any = {};
  monthlyBalances: any = {};
  pages: any = [];
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
  daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  isLargeScreen = this.mediaQuery.matches;

  constructor(private accountService: AccountService, private budgetTableService: BudgetTableService) { }

  ngOnInit() {
    this.initializeData();
    this.mediaQuery.addEventListener("change", this.updateMediaQuery.bind(this));
  }

  async initializeData() {
    const userResponse: any = await this.accountService.getUser();
    const user = userResponse?.user;
    this.initialBalance = user?.balance ?? 0;
    const budgetResponse: any = await this.budgetTableService.getBudgetsInDateRange('');
    const monthDailyData = budgetResponse?.budgets ?? {};
    
    const currMonth = moment(Object.keys(monthDailyData)[0]).month();
    const currYear = moment(Object.keys(monthDailyData)[0]).year();
    this.currMonth = currMonth;
    this.currYear = currYear;
    const calendar = this.getDaysInMonth(new Date(currYear, currMonth, 1), new Date(currYear, currMonth + 1, 0));
    this.calendar = calendar;
    await this.generate(monthDailyData, user?.balance || 0);
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

  generateDates(startDate: any, frequency: any, duration: any) {
      let dates = []
      let date = moment(startDate)
      while (date.diff(moment(startDate), 'days') <= duration) {
          dates.push(date.format('YYYY-MM-DD'))
          switch (frequency) {
              case 0:
                  date.add(1, 'days')
                  break
              case 1:
                  date.add(7, 'days')
                  break
              case 2:
                  date.add(14, 'days')
                  break
              case 3:
                  date.add(1, 'months')
                  break
              case 4:
                  date.add(3, 'months')
                  break
              case 5:
                  date.add(6, 'months')
                  break
              case 6:
                  date.add(1, 'years')
                  break
              default:
                  break
          }
      }
      return dates
  }

  groupByDate(items: any) {
      let result: any = {}
      for (let item of items) {
          let startDate = item.start_date
          let frequency = item.frequency
          let duration = 365
          let dates = this.generateDates(startDate, frequency, duration)
          for (let date of dates) {
              if (result[date]) {
                  result[date].push(item)
              } else {
                  result[date] = [item]
              }
          }
      }
      return result
  }
  async getMonthlyData(month: any, year: any, initialBalance: any) {
    console.log(initialBalance);
    this.currMonth = month;
    this.currYear = year;
    console.log(new Date(year, month, 1))
    const result: any = await this.budgetTableService.getBudgetsInDateRange(moment(new Date(year, month, 1)).format("YYYY-MM-DD"));
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
    const calendar: any = this.getDaysInMonth(new Date(year, month, 1), new Date(year, month + 1, 0));
    this.calendar = calendar;
    const firstDay = calendar[0].dayOfWeek;
    for (let i = 0; i < firstDay && this.mediaQuery.matches; i++) {
        calendar.unshift({});
    }
    this.calendar = calendar;
  }

  combineByDate(expenses: any, incomes: any) {
      let result: any = {}
      let expenseKeys = Object.keys(expenses)
      for (let key of expenseKeys) {
          if (result[key]) {
              result[key].expense = expenses[key]
          } else {
              result[key] = {
                  expense: expenses[key],
                  income: []
              }
          }
      }
      let incomeKeys = Object.keys(incomes)
      for (let key of incomeKeys) {
          if (result[key]) {
              result[key].income = incomes[key]
          } else {
              result[key] = {
                  expense: [],
                  income: incomes[key]
              }
          }
      }
      return result
  }

  groupByMonth(items: any) {
      let result: any = {}
      for (let item of items) {
          let startDate = item.start_date
          let frequency = item.frequency
          let duration = 365
          let dates = this.generateDates(startDate, frequency, duration)
          for (let date of dates) {
              let month = moment(date).format('MMMM') // format the date as month name using moment
              if (result[month]) {
                  result[month].push(item)
              } else {
                  result[month] = [item]
              }
          }
      }
      return result
  }

  changeMonth(direction: any) {
      if (direction === 'next') {
          this.incrementMonth()
      } else if (direction === 'prev') {
          this.decrementMonth() 
      }
  }
  async incrementMonth() {
    const monthData = Object.keys(this.monthDailyData);
    const newMonth = moment(monthData[0]).add(1, 'M').month();
    const newYear = moment(monthData[0]).add(1, 'M').year();
    this.currMonth = newMonth;
    this.currYear = newYear;
    this.balanceHistory.push(this.initialBalance);
    const calendar: any = this.getDaysInMonth(new Date(newYear, newMonth, 1), new Date(newYear, newMonth + 1, 0));
    this.calendar = calendar;
    const newInitialBalance = this.monthDailyData[monthData[monthData.length - 1]].currentBalance;
    this.initialBalance = newInitialBalance;
    const newCurrentBalance = newInitialBalance;
    this.initialBalance = newCurrentBalance;
    await this.getMonthlyData(newMonth, newYear, newInitialBalance);
    const firstDay = calendar[0].dayOfWeek;
    for (let i = 0; i < firstDay && this.mediaQuery.matches; i++) {
        calendar.unshift({});
    }
    this.calendar = calendar;
}

async decrementMonth() {
    const monthData = Object.keys(this.monthDailyData);
    const newMonth = moment(monthData[0]).subtract(1, 'M').month();
    const newYear = moment(monthData[0]).subtract(1, 'M').year();
    let newInitialBalance = 0;
    this.currMonth = newMonth;
    this.currYear = newYear;
    const calendar: any = this.getDaysInMonth(new Date(newYear, newMonth, 1), new Date(newYear, newMonth + 1, 0));
    this.calendar = calendar;
    if (this.balanceHistory.length > 0) {
        newInitialBalance = this.balanceHistory.pop();
        this.initialBalance = newInitialBalance;
    }
    this.initialBalance = newInitialBalance;
    const firstDay = calendar[0].dayOfWeek;
    for (let i = 0; i < firstDay; i++) {
        calendar.unshift({});
    }
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

  totalIncome(date: any) {
      return this.monthDailyData[date]?.income.reduce((total: any, current: any) => total + current.amount, 0);
  }

  totalExpense(date: any) {
      return this.monthDailyData[date]?.expense.reduce((total: any, current: any) => total + current.amount, 0);
  }

  getBalanceClass(date: any, type: any, balance: any) {
      return ((this.monthDailyData[date] || {[balance]: 0})[balance] < 0) ? 'expense' : (this.monthDailyData[date] || {[balance]: 0})[balance] > 0? `${type}-balance` : 'hide-dash';
  }

  updateMediaQuery(event: any) {
      this.mediaQuery = event.target;
      this.isLargeScreen = window.matchMedia("(min-width: 724px)").matches;
  }

  getStartBalance(dayData: any) {
    if (this.monthDailyData[dayData.date]?.previousBalance) {
        if (this.monthDailyData[dayData.date]?.previousBalance > 0) {
            return "Start Bal: $" + this.monthDailyData[dayData.date]?.previousBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        } else {
            return "Start Bal: -$" + Math.abs(this.monthDailyData[dayData.date]?.previousBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
    } else {
        return "-";
    }
  }

  getIncome(dayData: any) {
      if (this.monthDailyData[dayData.date]?.income.length > 0) {
          return "Income: $" + this.totalIncome(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
          return "-";
      }
  }

  getExpense(dayData: any) {
      if (this.monthDailyData[dayData.date]?.expense.length > 0) {
          return "Expense: $" + this.totalExpense(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
          return "-";
      }
  }

  getEndBalance(dayData: any) {
      if (this.monthDailyData[dayData.date]?.currentBalance) {
          if (this.monthDailyData[dayData.date].currentBalance > 0) {
              return "End Bal: $" + this.monthDailyData[dayData.date].currentBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          } else {
              return "End Bal: -$" + Math.abs(this.monthDailyData[dayData.date].currentBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 });
          }
      } else {
          return "-";
      }
  }


  ngOnDestroy() {
      this.mediaQuery.removeEventListener("change", this.updateMediaQuery.bind(this));
  }

}
