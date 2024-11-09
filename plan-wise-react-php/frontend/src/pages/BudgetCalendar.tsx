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
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const user = (await accountAPI.getUser()).user;
        setInitialBalance(user?.balance || 0);
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const monthDailyData = (await budgetTableAPI.getBudgetsInDateRange()).budgets || {};
        //setMonthDailyData(monthDailyData);
        const currMonth = moment(Object.keys(monthDailyData)[0]).month();
        const currYear = moment(Object.keys(monthDailyData)[0]).year();
        setCurrMonth(currMonth);
        setCurrYear(currYear);
        const calendar = getDaysInMonth(new Date(currYear, currMonth, 1), new Date(currYear, currMonth + 1, 0));
        // @ts-expect-error TS(2345): Argument of type '{ date: string; dayOfWeek: numbe... Remove this comment to see the full error message
        setCalendar(calendar);
        await generate(monthDailyData, user?.balance || 0);
    };
    
    const generate = async (monthDailyData: any, initialBalance: any) => {
        let prevKey = Object.keys(monthDailyData)[0];
        for (let key of Object.keys(monthDailyData)) {
            const income = monthDailyData[key].income.reduce((total: any, current: any) => total + current.amount, 0);
            const expense = monthDailyData[key].expense.reduce((total: any, current: any) => total + current.amount, 0);
            const currentBalance = (monthDailyData[prevKey].currentBalance || initialBalance) + income - expense;
            monthDailyData[key].previousBalance = monthDailyData[prevKey].currentBalance ? monthDailyData[prevKey].currentBalance : initialBalance;
            monthDailyData[key].currentBalance = currentBalance;
            prevKey = key;
        }
        setMonthDailyData(monthDailyData);
    };
    

    const generateDates = (startDate: any, frequency: any, duration: any) => {
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

    const groupByDate = (items: any) => {
        let result = {}
        for (let item of items) {
            let startDate = item.start_date
            let frequency = item.frequency
            let duration = 365
            let dates = generateDates(startDate, frequency, duration)
            for (let date of dates) {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                if (result[date]) {
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    result[date].push(item)
                } else {
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    result[date] = [item]
                }
            }
        }
        return result
    };
    
    const getMonthlyData = async (month: any, year: any, initialBalance: any) => {
        console.log(initialBalance);
        setCurrMonth(month);
        setCurrYear(year);
        console.log(new Date(year, month, 1))
        const result = await budgetTableAPI.getBudgetsInDateRange(moment(new Date(year, month, 1)).format("YYYY-MM-DD"));
        const monthDailyData = result.budgets || {};
        setMonthDailyData(monthDailyData);
        let prevKey = Object.keys(monthDailyData)[0];
        for (let key of Object.keys(monthDailyData)) {
            const income = monthDailyData[key].income.reduce((total: any, current: any) => total + current.amount, 0);
            const expense = monthDailyData[key].expense.reduce((total: any, current: any) => total + current.amount, 0);
            const currentBalance = (monthDailyData[prevKey].currentBalance || initialBalance) + income - expense;
            monthDailyData[key].previousBalance = monthDailyData[prevKey].currentBalance ? monthDailyData[prevKey].currentBalance : initialBalance;
            monthDailyData[key].currentBalance = currentBalance;
            prevKey = key;
        }
        setMonthDailyData(monthDailyData);
        const calendar = getDaysInMonth(new Date(year, month, 1), new Date(year, month + 1, 0));
        // @ts-expect-error TS(2345): Argument of type '{ date: string; dayOfWeek: numbe... Remove this comment to see the full error message
        setCalendar(calendar);
        const firstDay = calendar[0].dayOfWeek;
        for (let i = 0; i < firstDay && mediaQuery.matches; i++) {
            // @ts-expect-error TS(2345): Argument of type '{}' is not assignable to paramet... Remove this comment to see the full error message
            calendar.unshift({});
        }
        // @ts-expect-error TS(2345): Argument of type '{ date: string; dayOfWeek: numbe... Remove this comment to see the full error message
        setCalendar(calendar);
    };

    const combineByDate = (expenses: any, incomes: any) => {
        let result = {}
        let expenseKeys = Object.keys(expenses)
        for (let key of expenseKeys) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (result[key]) {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                result[key].expense = expenses[key]
            } else {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                result[key] = {
                    expense: expenses[key],
                    income: []
                }
            }
        }
        let incomeKeys = Object.keys(incomes)
        for (let key of incomeKeys) {
            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
            if (result[key]) {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                result[key].income = incomes[key]
            } else {
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                result[key] = {
                    expense: [],
                    income: incomes[key]
                }
            }
        }
        return result
    };

    const groupByMonth = (items: any) => {
        let result = {}
        for (let item of items) {
            let startDate = item.start_date
            let frequency = item.frequency
            let duration = 365
            let dates = generateDates(startDate, frequency, duration)
            for (let date of dates) {
                let month = moment(date).format('MMMM') // format the date as month name using moment
                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                if (result[month]) {
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    result[month].push(item)
                } else {
                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                    result[month] = [item]
                }
            }
        }
        return result
    };

    const changeMonth = (direction: any) => {
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
        // @ts-expect-error TS(2345): Argument of type 'number' is not assignable to par... Remove this comment to see the full error message
        balanceHistory.push(initialBalance);
        setBalanceHistory(balanceHistory);
        const calendar = getDaysInMonth(new Date(newYear, newMonth, 1), new Date(newYear, newMonth + 1, 0));
        // @ts-expect-error TS(2345): Argument of type '{ date: string; dayOfWeek: numbe... Remove this comment to see the full error message
        setCalendar(calendar);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const newInitialBalance = monthDailyData[monthData[monthData.length - 1]].currentBalance;
        setInitialBalance(newInitialBalance);
        const newCurrentBalance = newInitialBalance;
        setInitialBalance(newCurrentBalance);
        await getMonthlyData(newMonth, newYear, newInitialBalance);
        const firstDay = calendar[0].dayOfWeek;
        for (let i = 0; i < firstDay && mediaQuery.matches; i++) {
            // @ts-expect-error TS(2345): Argument of type '{}' is not assignable to paramet... Remove this comment to see the full error message
            calendar.unshift({});
        }
        // @ts-expect-error TS(2345): Argument of type '{ date: string; dayOfWeek: numbe... Remove this comment to see the full error message
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
        // @ts-expect-error TS(2345): Argument of type '{ date: string; dayOfWeek: numbe... Remove this comment to see the full error message
        setCalendar(calendar);
        if (balanceHistory.length > 0) {
            // @ts-expect-error TS(2322): Type 'undefined' is not assignable to type 'number... Remove this comment to see the full error message
            newInitialBalance = balanceHistory.pop();
            setInitialBalance(newInitialBalance);
        }
        setInitialBalance(newInitialBalance);
        const firstDay = calendar[0].dayOfWeek;
        for (let i = 0; i < firstDay; i++) {
            // @ts-expect-error TS(2345): Argument of type '{}' is not assignable to paramet... Remove this comment to see the full error message
            calendar.unshift({});
        }
        // @ts-expect-error TS(2345): Argument of type '{ date: string; dayOfWeek: numbe... Remove this comment to see the full error message
        setCalendar(calendar);
        await getMonthlyData(newMonth, newYear, newInitialBalance);
    };

    const getDaysInMonth = (start: any, end: any) => {
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

    const totalIncome = (date: any) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return monthDailyData[date]?.income.reduce((total: any, current: any) => total + current.amount, 0);
    };

    const totalExpense = (date: any) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return monthDailyData[date]?.expense.reduce((total: any, current: any) => total + current.amount, 0);
    };

    const getBalanceClass = (date: any, type: any, balance: any) => {
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        return ((monthDailyData[date] || {[balance]: 0})[balance] < 0) ? 'expense' : (monthDailyData[date] || {[balance]: 0})[balance] > 0? `${type}-balance` : 'hide-dash';
    };

    const updateMediaQuery = (event: any) => {
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
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <section class="uui-section_table">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div class="uui-page-padding">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div class="uui-container-large">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div class="uui-padding-vertical-xhuge">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div class="uui-text-align-center">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div class="uui-max-width-large align-center">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <h2 class="uui-heading-medium">Budget Calendar</h2>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div class="uui-space-xsmall"></div>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div class="uui-text-size-large">Calendar view of your budget per day<strong></strong></div>
                        </div>
                    </div>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div class="uui-table">
                        
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div className="fixed-headers" style={{ display: isLargeScreen ? 'block' : 'none' }}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div className="uui-table_heading-row_calendar">
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div className="uui-table_heading-row-text">Sunday</div>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div className="uui-table_heading-row-text">Monday</div>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div className="uui-table_heading-row-text">Tuesday</div>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div className="uui-table_heading-row-text">Wednesday</div>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div className="uui-table_heading-row-text">Thursday</div>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div className="uui-table_heading-row-text">Friday</div>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div className="uui-table_heading-row-text">Saturday</div>
                            </div>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div className="div-block">
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <ul className="pagination">
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <li className="page-item">
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <a className="text-block-3 page-link-budget" href="#" onClick={decrementMonth}>{"<<"}</a>
                                    </li>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <li>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="text-block-3 px-2">{months[currMonth]} {currYear < 0 ? '' : currYear}</div>
                                    </li>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <li className="page-item">
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <a className="text-block-3 page-link-budget" href="#" onClick={incrementMonth}>{">>"}</a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div style={{ display: isLargeScreen ? 'grid' : 'none' }} className="w-layout-grid uui-table_row_calendar background-color-gray50">
                            {calendar.map((dayData, index) => (
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div key={index} className="w-layout-grid uui-table-row-day-of-month_calendar border-day">
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="uui-text-size-medium">{dayData.date || ""}</div>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className={'uui-text-size-medium ' + getBalanceClass(dayData.date, 'starting', 'previousBalance')}>
                                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                        {monthDailyData[dayData.date]?.previousBalance ?
                                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                            "Start Bal: " + (monthDailyData[dayData.date]?.previousBalance > 0 ?
                                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                `$${monthDailyData[dayData.date]?.previousBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                `-$${Math.abs(monthDailyData[dayData.date]?.previousBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) :
                                                '-'}
                                    </div>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className={'uui-text-size-medium ' + (totalIncome(dayData.date) > 0 ? 'income' : 'hide-dash')}>
                                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                        {monthDailyData[dayData.date]?.income.length > 0 ? "Income: $" + totalIncome(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                    </div>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className={'uui-text-size-medium ' + (totalExpense(dayData.date) > 0 ? 'expense' : 'hide-dash')}>
                                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                        {monthDailyData[dayData.date]?.expense.length > 0 ? "Expense: $" + totalExpense(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                    </div>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className={'uui-text-size-medium ' + getBalanceClass(dayData.date, 'ending', 'currentBalance')}>
                                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                        {monthDailyData[dayData.date]?.currentBalance ?
                                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                            "End Bal: " + (monthDailyData[dayData.date].currentBalance > 0 ?
                                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                `$${monthDailyData[dayData.date].currentBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                `-$${Math.abs(monthDailyData[dayData.date].currentBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) : '-'}
                                    </div>
                                </div>
                            ))}
                        </div>

                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div style={{ display: !isLargeScreen ? 'block' : 'none' }}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div className="div-block">
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <ul className="pagination">
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <li className="page-item">
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <a className="text-block-3 page-link-budget" href="#" onClick={decrementMonth}>&lt;&lt;</a>
                                    </li>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <li>
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="text-block-3 px-2">{months[currMonth]} {currYear < 0 ? '' : currYear}</div>
                                    </li>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <li className="page-item">
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <a className="text-block-3 page-link-budget" href="#" onClick={incrementMonth}>&gt;&gt;</a>
                                    </li>
                                </ul>
                            </div>
                            {calendar.map((dayData, index) => (
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div key={index} className="w-layout-grid-calendar-mobile background-color-gray50 calendar-mobile">
                                    // @ts-expect-error TS(2339): Property 'date' does not exist on type 'never'.
                                    {dayData.date && (
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="uui-table_row_mobile">
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <div className="w-layout-grid uui-table-row-day-of-month_mobile">
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <div className="div-block-3">
                                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                    <div className="uui-pricing07_row-lead-text date-column">{dayData.date}</div>
                                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                    <div className="uui-pricing07_row-lead-text date-column">{daysOfWeek[dayData.dayOfWeek]}</div>
                                                </div>
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <div className="w-layout-grid uui-table-row-day-of-month">
                                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                    <div className={'uui-text-size-medium ' + getBalanceClass(dayData.date, 'starting', 'previousBalance')}>
                                                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                        {monthDailyData[dayData.date]?.previousBalance ?
                                                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                            "Start Bal: " + (monthDailyData[dayData.date]?.previousBalance > 0 ?
                                                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                                `$${monthDailyData[dayData.date]?.previousBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                                `-$${Math.abs(monthDailyData[dayData.date]?.previousBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) :
                                                                '-'}
                                                    </div>
                                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                    <div className={'uui-text-size-medium ' + (totalIncome(dayData.date) > 0 ? 'income' : 'hide-dash')}>
                                                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                        {monthDailyData[dayData.date]?.income.length > 0 ? "Income: $" + totalIncome(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                                    </div>
                                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                    <div className={'uui-text-size-medium ' + (totalExpense(dayData.date) > 0 ? 'expense' : 'hide-dash')}>
                                                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                        {monthDailyData[dayData.date]?.expense.length > 0 ? "Expense: $" + totalExpense(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-'}
                                                    </div>
                                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                    <div className={'uui-text-size-medium ' + getBalanceClass(dayData.date, 'ending', 'currentBalance')}>
                                                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                        {monthDailyData[dayData.date]?.currentBalance ?
                                                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                            "End Bal: " + (monthDailyData[dayData.date].currentBalance > 0 ?
                                                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                                `$${monthDailyData[dayData.date].currentBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                                `-$${Math.abs(monthDailyData[dayData.date].currentBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`) : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div className="center-pagination">
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <nav aria-label="Page navigation example">
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <ul className="pagination">
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <li className="page-item">
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <a className="page-link" href="#" onClick={decrementMonth}>Previous</a>
                                    </li>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <li className="page-item">
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
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
