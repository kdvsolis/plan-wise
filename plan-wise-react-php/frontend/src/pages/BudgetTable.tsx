import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'boot... Remove this comment to see the full error message
import { Modal } from 'bootstrap';
import accountAPI from '../services/account-service';
import budgetTableAPI from '../services/budget-table-service';
import notesAPI from '../services/notes-service';
// @ts-expect-error TS(6142): Module '../components/NotesModal' was resolved to ... Remove this comment to see the full error message
import NotesModal from '../components/NotesModal';
// @ts-expect-error TS(6142): Module '../components/ExpenseModal' was resolved t... Remove this comment to see the full error message
import ExpenseModal from '../components/ExpenseModal';
// @ts-expect-error TS(6142): Module '../components/IncomeModal' was resolved to... Remove this comment to see the full error message
import IncomeModal from '../components/IncomeModal';
// @ts-expect-error TS(6142): Module '../components/ModifyInstanceModal' was res... Remove this comment to see the full error message
import ModifyInstanceModal from '../components/ModifyInstanceModal';
import moment from 'moment';
import './BudgetTable.css';

function BudgetTable() {
    const [currMonth, setCurrMonth] = useState(-1);
    const [currYear, setCurrYear] = useState(-1);
    const [initialBalance, setInitialBalance] = useState(0);
    const [monthDailyData, setMonthDailyData] = useState({});
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
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
    const [isLargeScreen, setIsLargeScreen] = useState(mediaQuery.matches);
    const [currentNotes, setCurrentNotes] = useState({
        notes: ""
    });

    const [selectedOptionCategoryHeader, setSelectedOptionCategoryHeader] = useState("");
    const [selectedClassCategoryHeader, setSelectedClassCategoryHeader] = useState("");
    const [selectedOptionHeader, setSelectedOptionHeader] = useState("");
    const [selectedClassHeader, setSelectedClassHeader] = useState("");
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedClass, setSelectedClass] = useState("");
    const [headerExpense, setHeaderExpense] = useState("");
    const [headerSource, setHeaderSource] = useState("");
    const [headerAmount, setHeaderAmount] = useState(0);
    const [headerDate, setHeaderDate] = useState("");
    const [selectedInstance, setSelectedInstance] = useState({
        expense: [],
        income: []
    });

    const noteModalRef = useRef();
    const expenseModalRef = useRef();
    const incomeModalRef = useRef();
    const modifyInstanceModalRef = useRef();
    const [noteModal, setNoteModal] = useState(null);
    const [expenseModal, setExpenseModal] = useState(null);
    const [incomeModal, setIncomeModal] = useState(null);
    const [modifyInstanceModal, setModifyInstanceModal] = useState(null);
    
    const conditionalLayoutGrid = `${mediaQuery.matches? 'w-layout-grid' : ''} uui-table_row new-row`;

    useEffect(() => {
        document.title = "Plan Wise - Budget Table";
        initializeData();
    }, []);
    useEffect(() => {
        if (noteModalRef.current) {
            setNoteModal(new Modal(noteModalRef.current));
        }
    }, [noteModalRef.current]);
    useEffect(() => {
        if (expenseModalRef.current) {
            setExpenseModal(new Modal(expenseModalRef.current));
        }
    }, [expenseModalRef.current]);
    useEffect(() => {
        if (incomeModalRef.current) {
            setIncomeModal(new Modal(incomeModalRef.current));
        }
    }, [incomeModalRef.current]);
    useEffect(() => {
        if (modifyInstanceModalRef.current) {
            setModifyInstanceModal(new Modal(modifyInstanceModalRef.current));
        }
    }, [modifyInstanceModalRef.current]);

    const initializeData = async () => {
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const user = (await accountAPI.getUser()).user;
        setInitialBalance(user?.balance || 0);
        // @ts-expect-error TS(2554): Expected 1 arguments, but got 0.
        const monthDailyData = (await budgetTableAPI.getBudgetsInDateRange()).budgets || {};
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

    const updateMediaQuery = (event: any) => {
        setMediaQuery(event.target);
        setIsLargeScreen(window.matchMedia("(min-width: 724px)").matches);
    };

    const changeInitialBalance = async () => {
        await accountAPI.updateUser({
            balance: initialBalance
        });
        await initializeData();
    }

    const addIncomeModal = async (date: any) => {
        setSelectedDate(date);
        setHeaderDate(date);
        setSelectedOptionHeader('Select Interval');
        setSelectedClassHeader('');
        setSelectedOption('Select Interval');
        setSelectedClass('');
        setHeaderSource('');
        setHeaderAmount(0);
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        incomeModal.show();
    }

    const addExpenseModal = async (date: any) => {
        setSelectedDate(date);
        setHeaderDate(date);
        // @ts-expect-error TS(2345): Argument of type '{ category_name: string; }' is n... Remove this comment to see the full error message
        setSelectedOptionCategoryHeader({ category_name: 'Select Category' });
        setSelectedClassCategoryHeader('');
        setSelectedOptionHeader('Select Interval');
        setSelectedClassHeader('');
        setSelectedOption('Select Interval');
        setSelectedClass('');
        setHeaderExpense('');
        setHeaderAmount(0);
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        expenseModal.show();
    }

    const selectedInstanceModal = async (date: any) => {
        setSelectedDate(date);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        setSelectedInstance(monthDailyData[date]);
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        modifyInstanceModal.show();
    }

    const notesModal = async (date: any) => {
        try{
            let noteResponse = await notesAPI.getByDate(date);
            setCurrentNotes(noteResponse.notes || {
                notes: ""
            });
        } catch(e){
            setCurrentNotes({
                notes: ""
            });
        }
        setSelectedDate(date);
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        noteModal.show();
    }

    const refreshTable = async () => {
        const month = moment(selectedDate).month();
        const year = moment(selectedDate).year();
        const calendar = getDaysInMonth(new Date(year, month, 1), new Date(year, month + 1, 0));
        // @ts-expect-error TS(2345): Argument of type '{ date: string; dayOfWeek: numbe... Remove this comment to see the full error message
        setCalendar(calendar);
        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const initBalance = monthDailyData[selectedDate].previousBalance;
        setInitialBalance(initBalance);
        await getMonthlyData(month, year, initBalance);
        // @ts-expect-error TS(2345): Argument of type '{ date: string; dayOfWeek: numbe... Remove this comment to see the full error message
        setCalendar(calendar);
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        expenseModal.hide();
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        incomeModal.hide();
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        modifyInstanceModal.hide();
    }

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
                        <h2 class="uui-heading-medium">Budget Table</h2>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div class="uui-space-xsmall"></div>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div class="uui-text-size-large">See where you&#x27;ll be if you stick to your budget<strong></strong></div>
                        </div>
                    </div>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div class="uui-table">
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div className="">
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div className={conditionalLayoutGrid}>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="uui-table_row-content input-header">
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <span>Initial Balance:</span>
                                    </div>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="uui-table_row-content input-header">
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <input type="number" className="expense-input" value={initialBalance} onChange={e => setInitialBalance(e.target.value)} />
                                    </div>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="uui-table_row-content input-header">
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <button type="button" className="btn btn-primary" onClick={changeInitialBalance}>Change</button>
                                    </div>
                                </div>
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div className="uui-table_heading-row">
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="uui-table_heading-row-text">Date</div>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="uui-table_heading-row-text">Balance</div>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="uui-table_heading-row-text">Income</div>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="uui-table_heading-row-text">Expense</div>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="uui-table_heading-row-text">Amount</div>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="uui-table_heading-row-text">Action</div>
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

                            {isLargeScreen && calendar.map((dayData, index) => (
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <div key={index} className="w-layout-grid uui-table_row background-color-gray50">
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="w-layout-grid uui-table-row-day-of-month">
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="div-block-2">
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <div className="uui-pricing07_row-lead-text date-column">{dayData.date}</div>
                                        </div>
                                    </div>
                                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                    {monthDailyData[dayData.date] && monthDailyData[dayData.date].previousBalance && monthDailyData[dayData.date].currentBalance ? (
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="w-layout-grid uui-table-row-day-of-month balance-column">
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <div className="uui-text-size-medium starting-balance">
                                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                {(monthDailyData[dayData.date].previousBalance || 0) > 0 ?
                                                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                    `$${monthDailyData[dayData.date].previousBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                    !isNaN(monthDailyData[dayData.date].previousBalance) ?
                                                        // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                        `-$${Math.abs(monthDailyData[dayData.date].previousBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                                            </div>
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <div className="uui-text-size-medium ending-balance">
                                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                {monthDailyData[dayData.date].currentBalance > 0 ?
                                                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                    `$${monthDailyData[dayData.date].currentBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                    `-$${Math.abs(monthDailyData[dayData.date].currentBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                            </div>
                                        </div>
                                    ) : (
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="w-layout-grid uui-table-row-day-of-month">
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <div className="div-block-2"></div>
                                        </div>
                                    )}

                                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                    {monthDailyData[dayData.date] ? (
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="w-layout-grid uui-table-row-day-of-month income-column">
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <div className={(monthDailyData[dayData.date].income || []).length > 0 ? 'uui-text-size-medium income' : 'uui-text-size-medium'}>
                                                // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                                {(monthDailyData[dayData.date].income || []).length > 0 ? `$${(monthDailyData[dayData.date].income || []).reduce((total: any, current: any) => total + current.amount, 0).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                                            </div>
                                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                            {Array(Math.max((monthDailyData[dayData.date].expense || []).length - 1, 0)).fill().map((_, i) => (
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <div key={i} className="uui-text-size-medium">
                                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                    <div>{i > (monthDailyData[dayData.date].income || []).length ? '' : ''}</div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="w-layout-grid uui-table-row-day-of-month">
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <div className="div-block-2"></div>
                                        </div>
                                    )}

                                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                    {monthDailyData[dayData.date] ? (
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="w-layout-grid uui-table-row-day-of-month expense-column">
                                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                            {(monthDailyData[dayData.date].expense || []).map((expense: any, index: any) => (
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <div key={index} className="uui-text-size-medium expense-cell">{expense.expenses}</div>
                                            ))}
                                        </div>
                                    ) : (
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="w-layout-grid uui-table-row-day-of-month">
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <div className="div-block-2"></div>
                                        </div>
                                    )}

                                    // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                    {monthDailyData[dayData.date] ? (
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="w-layout-grid uui-table-row-day-of-month expense-price-column">
                                            // @ts-expect-error TS(7053): Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
                                            {(monthDailyData[dayData.date].expense || []).map((expense: any, index: any) => (
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <div key={index} className="uui-text-size-medium expense-cell">
                                                    $ {expense.amount.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="w-layout-grid uui-table-row-day-of-month">
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <div className="div-block-2"></div>
                                        </div>
                                    )}

                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <div className="w-layout-grid uui-table-row-day-of-month action-column">
                                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                        <div className="action">
                                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                            <div className="action-data">
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <button type="button" className="btn btn-primary" onClick={() => addIncomeModal(dayData.date)}>Add Income</button>
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <button type="button" className="btn btn-primary" onClick={() => addExpenseModal(dayData.date)}>Add Expense</button>
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <button type="button" className="btn btn-primary" disabled={!monthDailyData[dayData.date]} onClick={() => selectedInstanceModal(dayData.date)}>Modify Instance</button>
                                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                                <button type="button" className="btn btn-primary" onClick={() => notesModal(dayData.date)}>Notes</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

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
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <NotesModal 
                ref={noteModalRef} 
                // @ts-expect-error TS(2322): Type '{ ref: MutableRefObject<undefined>; modalClo... Remove this comment to see the full error message
                modalClosed={refreshTable} 
                currentNotes={currentNotes} 
                selectedDate={selectedDate} 
            />
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <ExpenseModal
                ref={expenseModalRef}
                // @ts-expect-error TS(2322): Type '{ ref: MutableRefObject<undefined>; onModalC... Remove this comment to see the full error message
                onModalClosed={refreshTable}
                selectedOptionCategoryHeader={selectedOptionCategoryHeader}
                selectedClassCategoryHeader={selectedClassCategoryHeader}
                selectedOptionHeader={selectedOptionHeader}
                selectedClassHeader={selectedClassHeader}
                selectedOption={selectedOption}
                selectedClass={selectedClass}
                headerExpense={headerExpense}
                headerAmount={headerAmount}
                headerDate={headerDate}
                selectedDate={selectedDate}
            />
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <IncomeModal
                ref={incomeModalRef}
                // @ts-expect-error TS(2322): Type '{ ref: MutableRefObject<undefined>; onModalC... Remove this comment to see the full error message
                onModalClosed={refreshTable}
                selectedOptionHeader={selectedOptionHeader}
                selectedClassHeader={selectedClassHeader}
                selectedOption={selectedOption}
                selectedClass={selectedClass}
                headerSource={headerSource}
                headerAmount={headerAmount}
                headerDate={headerDate}
                selectedDate={selectedDate}
            />
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <ModifyInstanceModal
                ref={modifyInstanceModalRef}
                // @ts-expect-error TS(2322): Type '{ ref: MutableRefObject<undefined>; onModalC... Remove this comment to see the full error message
                onModalClosed={refreshTable}
                selectedDate={selectedDate}
                selectedInstance={selectedInstance}
            />
        </section>
    );
}

export default BudgetTable;
