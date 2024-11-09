import React, { useEffect, useState, useLayoutEffect } from 'react';
import accountAPI from '../services/account-service';
import budgetTableAPI from '../services/budget-table-service';
import moment from 'moment';
import './BudgetCalendar.css';

function BudgetCalendar() {
    useEffect(() => {
        document.title = "Plan Wise - Budget Calendar";
    }, []);
    const [expense, setExpense] = useState([]);
    const [income, setIncome] = useState([]);
    const [currMonth, setCurrMonth] = useState(-1);
    const [currYear, setCurrYear] = useState(-1);
    const [total, setTotal] = useState(365);
    const [initialBalance, setInitialBalance] = useState(0);
    const [monthDailyData, setMonthDailyData] = useState({});
    const [monthlyData, setMonthlyData] = useState({});
    const [monthlyBalances, setMonthlyBalances] = useState({});
    const [pages, setPages] = useState([]);
    const [balanceHistory, setBalanceHistory] = useState([]);
    const [months] = useState([
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
    ]);
    const [calendar, setCalendar] = useState([]);
    const [mediaQuery, setMediaQuery] = useState(window.matchMedia("(min-width: 724px)"));
    const [daysOfWeek] = useState([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ]);
    const [isLargeScreen, setIsLargeScreen] = useState(mediaQuery.matches);

    useEffect(() => {
        document.title = "Plan Wise - Budget Calendar";
        initializeData();
    }, []);

    const initializeData = async () => {
        const user = (await accountAPI.getUser()).user;
        setInitialBalance(user?.balance || 0);
        const monthDailyData = (await budgetTableAPI.getBudgetsInDateRange()).budgets || {};
        //setMonthDailyData(monthDailyData);
        const currMonth = moment(Object.keys(monthDailyData)[0]).month();
        const currYear = moment(Object.keys(monthDailyData)[0]).year();
        setCurrMonth(currMonth);
        setCurrYear(currYear);
        const calendar = getDaysInMonth(new Date(currYear, currMonth, 1), new Date(currYear, currMonth + 1, 0));
        setCalendar(calendar);
        await generate(monthDailyData, user?.balance || 0);
    };
    
    const generate = async (monthDailyData, initialBalance) => {
        let prevKey = Object.keys(monthDailyData)[0];
        for (let key of Object.keys(monthDailyData)) {
            const income = monthDailyData[key].income.reduce((total, current) => total + current.amount, 0);
            const expense = monthDailyData[key].expense.reduce((total, current) => total + current.amount, 0);
            const currentBalance = (monthDailyData[prevKey].currentBalance || initialBalance) + income - expense;
            monthDailyData[key].previousBalance = monthDailyData[prevKey].currentBalance ? monthDailyData[prevKey].currentBalance : initialBalance;
            monthDailyData[key].currentBalance = currentBalance;
            prevKey = key;
        }
        setMonthDailyData(monthDailyData);
    };
    

    const generateDates = (startDate, frequency, duration) => {
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
    };

    const groupByDate = (items) => {
        let result = {}
        for (let item of items) {
            let startDate = item.start_date
            let frequency = item.frequency
            let duration = 365
            let dates = generateDates(startDate, frequency, duration)
            for (let date of dates) {
                if (result[date]) {
                    result[date].push(item)
                } else {
                    result[date] = [item]
                }
            }
        }
        return result
    };
    
    const getMonthlyData = async (month, year, initialBalance) => {
        console.log(initialBalance);
        setCurrMonth(month);
        setCurrYear(year);
        console.log(new Date(year, month, 1))
        const result = await budgetTableAPI.getBudgetsInDateRange(moment(new Date(year, month, 1)).format("YYYY-MM-DD"));
        const monthDailyData = result.budgets || {};
        setMonthDailyData(monthDailyData);
        let prevKey = Object.keys(monthDailyData)[0];
        for (let key of Object.keys(monthDailyData)) {
            const income = monthDailyData[key].income.reduce((total, current) => total + current.amount, 0);
            const expense = monthDailyData[key].expense.reduce((total, current) => total + current.amount, 0);
            const currentBalance = (monthDailyData[prevKey].currentBalance || initialBalance) + income - expense;
            monthDailyData[key].previousBalance = monthDailyData[prevKey].currentBalance ? monthDailyData[prevKey].currentBalance : initialBalance;
            monthDailyData[key].currentBalance = currentBalance;
            prevKey = key;
        }
        setMonthDailyData(monthDailyData);
        const calendar = getDaysInMonth(new Date(year, month, 1), new Date(year, month + 1, 0));
        setCalendar(calendar);
        const firstDay = calendar[0].dayOfWeek;
        for (let i = 0; i < firstDay && mediaQuery.matches; i++) {
            calendar.unshift({});
        }
        setCalendar(calendar);
    };

    const combineByDate = (expenses, incomes) => {
        let result = {}
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
    };

    const groupByMonth = (items) => {
        let result = {}
        for (let item of items) {
            let startDate = item.start_date
            let frequency = item.frequency
            let duration = 365
            let dates = generateDates(startDate, frequency, duration)
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
    };

    const changeMonth = (direction) => {
        if (direction === 'next') {
            incrementMonth()
        } else if (direction === 'prev') {
            decrementMonth() 
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
        setInitialBalance(newInitialBalance);
        const newCurrentBalance = newInitialBalance;
        setInitialBalance(newCurrentBalance);
        await getMonthlyData(newMonth, newYear, newInitialBalance);
        const firstDay = calendar[0].dayOfWeek;
        for (let i = 0; i < firstDay && mediaQuery.matches; i++) {
            calendar.unshift({});
        }
        setCalendar(calendar);
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
            newInitialBalance = balanceHistory.pop();
            setInitialBalance(newInitialBalance);
        }
        setInitialBalance(newInitialBalance);
        const firstDay = calendar[0].dayOfWeek;
        for (let i = 0; i < firstDay; i++) {
            calendar.unshift({});
        }
        setCalendar(calendar);
        await getMonthlyData(newMonth, newYear, newInitialBalance);
    };

    const getDaysInMonth = (start, end) => {
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
    };

    const totalIncome = (date) => {
        return monthDailyData[date]?.income.reduce((total, current) => total + current.amount, 0);
    };

    const totalExpense = (date) => {
        return monthDailyData[date]?.expense.reduce((total, current) => total + current.amount, 0);
    };

    const getBalanceClass = (date, type, balance) => {
        return ((monthDailyData[date] || {[balance]: 0})[balance] < 0) ? 'expense' : (monthDailyData[date] || {[balance]: 0})[balance] > 0? `${type}-balance` : 'hide-dash';
    };

    const updateMediaQuery = (event) => {
        setMediaQuery(event.target);
        setIsLargeScreen(window.matchMedia("(min-width: 724px)").matches);
    };

    useLayoutEffect(() => {
        mediaQuery.addEventListener("change", updateMediaQuery);
        return () => {
            mediaQuery.removeEventListener("change", updateMediaQuery);
        };
    }, [mediaQuery]);

    return (
        <section class="uui-section_table">
            <div class="uui-page-padding">
                <div class="uui-container-large">
                    <div class="uui-padding-vertical-xhuge">
                    <div class="uui-text-align-center">
                        <div class="uui-max-width-large align-center">
                        <h2 class="uui-heading-medium">Budget Calendar</h2>
                        <div class="uui-space-xsmall"></div>
                        <div class="uui-text-size-large">Calendar view of your budget per day<strong></strong></div>
                        </div>
                    </div>
                    <div class="uui-table">
                        
                        <div className="fixed-headers" style={{ display: isLargeScreen ? 'block' : 'none' }}>
                            <div className="uui-table_heading-row_calendar">
                                <div className="uui-table_heading-row-text">Sunday</div>
                                <div className="uui-table_heading-row-text">Monday</div>
                                <div className="uui-table_heading-row-text">Tuesday</div>
                                <div className="uui-table_heading-row-text">Wednesday</div>
                                <div className="uui-table_heading-row-text">Thursday</div>
                                <div className="uui-table_heading-row-text">Friday</div>
                                <div className="uui-table_heading-row-text">Saturday</div>
                            </div>
                            <div className="div-block">
                                <ul className="pagination">
                                    <li className="page-item">
                                        <a className="text-block-3 page-link-budget" href="#" onClick={decrementMonth}>{"<<"}</a>
                                    </li>
                                    <li>
                                        <div className="text-block-3 px-2">{months[currMonth]} {currYear < 0 ? '' : currYear}</div>
                                    </li>
                                    <li className="page-item">
                                        <a className="text-block-3 page-link-budget" href="#" onClick={incrementMonth}>{">>"}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div style={{ display: isLargeScreen ? 'grid' : 'none' }} className="w-layout-grid uui-table_row_calendar background-color-gray50">
                            {calendar.map((dayData, index) => (
                                <div key={index} className="w-layout-grid uui-table-row-day-of-month_calendar border-day">
                                    <div className="uui-text-size-medium">{dayData.date || ""}</div>
                                    <div className={'uui-text-size-medium ' + getBalanceClass(dayData.date, 'starting', 'previousBalance')}>
                                        {monthDailyData[dayData.date]?.previousBalance ?
                                            "Start Bal: " + (monthDailyData[dayData.date]?.previousBalance > 0 ?
                                                `$${monthDailyData[dayData.date]?.previousBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                `-$${Math.abs(monthDailyData[dayData.date]?.previousBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) :
                                                '-'}
                                    </div>
                                    <div className={'uui-text-size-medium ' + (totalIncome(dayData.date) > 0 ? 'income' : 'hide-dash')}>
                                        {monthDailyData[dayData.date]?.income.length > 0 ? "Income: $" + totalIncome(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                    </div>
                                    <div className={'uui-text-size-medium ' + (totalExpense(dayData.date) > 0 ? 'expense' : 'hide-dash')}>
                                        {monthDailyData[dayData.date]?.expense.length > 0 ? "Expense: $" + totalExpense(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                    </div>
                                    <div className={'uui-text-size-medium ' + getBalanceClass(dayData.date, 'ending', 'currentBalance')}>
                                        {monthDailyData[dayData.date]?.currentBalance ?
                                            "End Bal: " + (monthDailyData[dayData.date].currentBalance > 0 ?
                                                `$${monthDailyData[dayData.date].currentBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                `-$${Math.abs(monthDailyData[dayData.date].currentBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) : '-'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: !isLargeScreen ? 'block' : 'none' }}>
                            <div className="div-block">
                                <ul className="pagination">
                                    <li className="page-item">
                                        <a className="text-block-3 page-link-budget" href="#" onClick={decrementMonth}>&lt;&lt;</a>
                                    </li>
                                    <li>
                                        <div className="text-block-3 px-2">{months[currMonth]} {currYear < 0 ? '' : currYear}</div>
                                    </li>
                                    <li className="page-item">
                                        <a className="text-block-3 page-link-budget" href="#" onClick={incrementMonth}>&gt;&gt;</a>
                                    </li>
                                </ul>
                            </div>
                            {calendar.map((dayData, index) => (
                                <div key={index} className="w-layout-grid-calendar-mobile background-color-gray50 calendar-mobile">
                                    {dayData.date && (
                                        <div className="uui-table_row_mobile">
                                            <div className="w-layout-grid uui-table-row-day-of-month_mobile">
                                                <div className="div-block-3">
                                                    <div className="uui-pricing07_row-lead-text date-column">{dayData.date}</div>
                                                    <div className="uui-pricing07_row-lead-text date-column">{daysOfWeek[dayData.dayOfWeek]}</div>
                                                </div>
                                                <div className="w-layout-grid uui-table-row-day-of-month">
                                                    <div className={'uui-text-size-medium ' + getBalanceClass(dayData.date, 'starting', 'previousBalance')}>
                                                        {monthDailyData[dayData.date]?.previousBalance ?
                                                            "Start Bal: " + (monthDailyData[dayData.date]?.previousBalance > 0 ?
                                                                `$${monthDailyData[dayData.date]?.previousBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                                `-$${Math.abs(monthDailyData[dayData.date]?.previousBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) :
                                                                '-'}
                                                    </div>
                                                    <div className={'uui-text-size-medium ' + (totalIncome(dayData.date) > 0 ? 'income' : 'hide-dash')}>
                                                        {monthDailyData[dayData.date]?.income.length > 0 ? "Income: $" + totalIncome(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                                    </div>
                                                    <div className={'uui-text-size-medium ' + (totalExpense(dayData.date) > 0 ? 'expense' : 'hide-dash')}>
                                                        {monthDailyData[dayData.date]?.expense.length > 0 ? "Expense: $" + totalExpense(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                                    </div>
                                                    <div className={'uui-text-size-medium ' + getBalanceClass(dayData.date, 'ending', 'currentBalance')}>
                                                        {monthDailyData[dayData.date]?.currentBalance ?
                                                            "End Bal: " + (monthDailyData[dayData.date].currentBalance > 0 ?
                                                                `$${monthDailyData[dayData.date].currentBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                                `-$${Math.abs(monthDailyData[dayData.date].currentBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="center-pagination">
                            <nav aria-label="Page navigation example">
                                <ul className="pagination">
                                    <li className="page-item">
                                        <a className="page-link" href="#" onClick={decrementMonth}>Previous</a>
                                    </li>
                                    <li className="page-item">
                                        <a className="page-link" href="#" onClick={incrementMonth}>Next</a>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </section>
  );
}

export default BudgetCalendar;
