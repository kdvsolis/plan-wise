import React, { useEffect, useState, useLayoutEffect } from 'react';
import accountAPI from '../services/account-service';
import budgetTableAPI from '../services/budget-table-service';
import moment from 'moment';
import './BudgetCalendar.css';

interface IncomeExpenseData {
  amount: number;
}

interface DayData {
  date: string;
  dayOfWeek: number;
  index: number;
}

interface BudgetDayData {
  income: IncomeExpenseData[];
  expense: IncomeExpenseData[];
  previousBalance?: number;
  currentBalance?: number;
}

function BudgetCalendar() {
  const [expense, setExpense] = useState<IncomeExpenseData[]>([]);
  const [income, setIncome] = useState<IncomeExpenseData[]>([]);
  const [currMonth, setCurrMonth] = useState<number>(-1);
  const [currYear, setCurrYear] = useState<number>(-1);
  const [total, setTotal] = useState<number>(365);
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [monthDailyData, setMonthDailyData] = useState<Record<string, BudgetDayData>>({});
  const [monthlyData, setMonthlyData] = useState<Record<string, any>>({});
  const [monthlyBalances, setMonthlyBalances] = useState<Record<string, any>>({});
  const [pages, setPages] = useState<any[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<number[]>([]);
  const [months] = useState<string[]>([
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]);
  const [calendar, setCalendar] = useState<DayData[]>([]);
  const [mediaQuery, setMediaQuery] = useState<MediaQueryList>(window.matchMedia("(min-width: 724px)"));
  const [daysOfWeek] = useState<string[]>([
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
  ]);
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(mediaQuery.matches);

  useEffect(() => {
    document.title = "Plan Wise - Budget Calendar";
    initializeData();
  }, []);

  const initializeData = async () => {
    const user = (await accountAPI.getUser({})).user;
    setInitialBalance(user?.balance || 0);
    const monthDailyData = (await budgetTableAPI.getBudgetsInDateRange(null)).budgets || {};
    const currMonth = moment(Object.keys(monthDailyData)[0]).month();
    const currYear = moment(Object.keys(monthDailyData)[0]).year();
    setCurrMonth(currMonth);
    setCurrYear(currYear);
    const calendar = getDaysInMonth(new Date(currYear, currMonth, 1), new Date(currYear, currMonth + 1, 0));
    setCalendar(calendar);
    await generate(monthDailyData, user?.balance || 0);
  };

  const generate = async (monthDailyData: Record<string, BudgetDayData>, initialBalance: number) => {
    let prevKey = Object.keys(monthDailyData)[0];
    for (let key of Object.keys(monthDailyData)) {
      const income = monthDailyData[key].income.reduce((total, current) => total + current.amount, 0);
      const expense = monthDailyData[key].expense.reduce((total, current) => total + current.amount, 0);
      const currentBalance = (monthDailyData[prevKey].currentBalance || initialBalance) + income - expense;
      monthDailyData[key].previousBalance = monthDailyData[prevKey].currentBalance || initialBalance;
      monthDailyData[key].currentBalance = currentBalance;
      prevKey = key;
    }
    setMonthDailyData(monthDailyData);
  };

  const generateDates = (startDate: string, frequency: number, duration: number): string[] => {
    let dates: string[] = [];
    let date = moment(startDate);
    while (date.diff(moment(startDate), 'days') <= duration) {
      dates.push(date.format('YYYY-MM-DD'));
      switch (frequency) {
        case 0: date.add(1, 'days'); break;
        case 1: date.add(7, 'days'); break;
        case 2: date.add(14, 'days'); break;
        case 3: date.add(1, 'months'); break;
        case 4: date.add(3, 'months'); break;
        case 5: date.add(6, 'months'); break;
        case 6: date.add(1, 'years'); break;
        default: break;
      }
    }
    return dates;
  };

  const groupByDate = (items: any[]): Record<string, any[]> => {
    let result: Record<string, any[]> = {};
    for (let item of items) {
      let startDate = item.start_date;
      let frequency = item.frequency;
      let duration = 365;
      let dates = generateDates(startDate, frequency, duration);
      for (let date of dates) {
        if (result[date]) {
          result[date].push(item);
        } else {
          result[date] = [item];
        }
      }
    }
    return result;
  };

  const getMonthlyData = async (month: number, year: number, initialBalance: number) => {
    setCurrMonth(month);
    setCurrYear(year);
    const result = await budgetTableAPI.getBudgetsInDateRange(moment(new Date(year, month, 1)).format("YYYY-MM-DD"));
    const monthDailyData = result.budgets || {};
    setMonthDailyData(monthDailyData);
    let prevKey = Object.keys(monthDailyData)[0];
    for (let key of Object.keys(monthDailyData)) {
      const income = monthDailyData[key].income.reduce((total: any, current: { amount: any; }) => total + current.amount, 0);
      const expense = monthDailyData[key].expense.reduce((total: any, current: { amount: any; }) => total + current.amount, 0);
      const currentBalance = (monthDailyData[prevKey].currentBalance || initialBalance) + income - expense;
      monthDailyData[key].previousBalance = monthDailyData[prevKey].currentBalance || initialBalance;
      monthDailyData[key].currentBalance = currentBalance;
      prevKey = key;
    }
    setMonthDailyData(monthDailyData);
    const calendar = getDaysInMonth(new Date(year, month, 1), new Date(year, month + 1, 0));
    setCalendar(calendar);
    const firstDay = calendar[0].dayOfWeek;
    for (let i = 0; i < firstDay && mediaQuery.matches; i++) {
      calendar.unshift({
          date: '',
          dayOfWeek: 0,
          index: 0
      });
    }
    setCalendar(calendar);
  };

  const combineByDate = (expenses: Record<string, any[]>, incomes: Record<string, any[]>): Record<string, BudgetDayData> => {
    let result: Record<string, BudgetDayData> = {};
    let expenseKeys = Object.keys(expenses);
    for (let key of expenseKeys) {
      if (result[key]) {
        result[key].expense = expenses[key];
      } else {
        result[key] = { expense: expenses[key], income: [] };
      }
    }
    let incomeKeys = Object.keys(incomes);
    for (let key of incomeKeys) {
      if (result[key]) {
        result[key].income = incomes[key];
      } else {
        result[key] = { expense: [], income: incomes[key] };
      }
    }
    return result;
  };

  const changeMonth = (direction: string) => {
    if (direction === 'next') {
      incrementMonth();
    } else if (direction === 'prev') {
      decrementMonth();
    }
  };

  const incrementMonth = async () => {
    const monthData = Object.keys(monthDailyData);
    const newMonth = moment(monthData[0]).add(1, 'M').month();
    const newYear = moment(monthData[0]).add(1, 'M').year();
    setCurrMonth(newMonth);
    setCurrYear(newYear);
    balanceHistory.push(initialBalance);
    setBalanceHistory(balanceHistory);
    const calendar = getDaysInMonth(new Date(newYear, newMonth, 1), new Date(newYear, newMonth + 1, 0));
    setCalendar(calendar);
    const newInitialBalance = monthDailyData[monthData[monthData.length - 1]].currentBalance;
    setInitialBalance(newInitialBalance || 0);
    await getMonthlyData(newMonth, newYear, newInitialBalance || 0);
  };

  const decrementMonth = async () => {
    const monthData = Object.keys(monthDailyData);
    const newMonth = moment(monthData[0]).subtract(1, 'M').month();
    const newYear = moment(monthData[0]).subtract(1, 'M').year();
    let newInitialBalance = 0;
    setCurrMonth(newMonth);
    setCurrYear(newYear);
    const calendar = getDaysInMonth(new Date(newYear, newMonth, 1), new Date(newYear, newMonth + 1, 0));
    setCalendar(calendar);
    if (balanceHistory.length > 0) {
      newInitialBalance = balanceHistory.pop()!;
      setInitialBalance(newInitialBalance);
    }
    await getMonthlyData(newMonth, newYear, newInitialBalance);
  };

  const getDaysInMonth = (start: Date, end: Date): DayData[] => {
    let days = [];
    for (let i = 0; i < moment(end).date(); i++) {
      let date = moment(start).add(i, 'days');
      days.push({
        date: date.format('YYYY-MM-DD'),
        dayOfWeek: date.day(),
        index: i,
      });
    }
    return days;
  };

  return (
    <div className="budget-calendar">
      {/* Your JSX rendering the calendar */}
    </div>
  );
}

export default BudgetCalendar;
