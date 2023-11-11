import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import accountAPI from '../services/account-service';
import budgetTableAPI from '../services/budget-table-service';
import notesAPI from '../services/notes-service';
import NotesModal from '../components/NotesModal';
import ExpenseModal from '../components/ExpenseModal';
import IncomeModal from '../components/IncomeModal';
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
        const user = (await accountAPI.getUser()).user;
        setInitialBalance(user?.balance || 0);
        const monthDailyData = (await budgetTableAPI.getBudgetsInDateRange()).budgets || {};
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

    const updateMediaQuery = (event) => {
        setMediaQuery(event.target);
        setIsLargeScreen(window.matchMedia("(min-width: 724px)").matches);
    };

    const changeInitialBalance = async () => {
        await accountAPI.updateUser({
            balance: initialBalance
        });
        await initializeData();
    }

    const addIncomeModal = async (date) => {
        setSelectedDate(date);
        setHeaderDate(date);
        setSelectedOptionHeader('Select Interval');
        setSelectedClassHeader('');
        setSelectedOption('Select Interval');
        setSelectedClass('');
        setHeaderSource('');
        setHeaderAmount(0);
        incomeModal.show();
    }

    const addExpenseModal = async (date) => {
        setSelectedDate(date);
        setHeaderDate(date);
        setSelectedOptionCategoryHeader({ category_name: 'Select Category' });
        setSelectedClassCategoryHeader('');
        setSelectedOptionHeader('Select Interval');
        setSelectedClassHeader('');
        setSelectedOption('Select Interval');
        setSelectedClass('');
        setHeaderExpense('');
        setHeaderAmount(0);
        expenseModal.show();
    }

    const selectedInstanceModal = async (date) => {
        setSelectedDate(date);
        setSelectedInstance(monthDailyData[date]);
        modifyInstanceModal.show();
    }

    const notesModal = async (date) => {
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
        noteModal.show();
    }

    const refreshTable = async () => {
        const month = moment(selectedDate).month();
        const year = moment(selectedDate).year();
        const calendar = getDaysInMonth(new Date(year, month, 1), new Date(year, month + 1, 0));
        setCalendar(calendar);
        const initBalance = monthDailyData[selectedDate].previousBalance;
        setInitialBalance(initBalance);
        await getMonthlyData(month, year, initBalance);
        setCalendar(calendar);
        expenseModal.hide();
        incomeModal.hide();
        modifyInstanceModal.hide();
    }

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
                    <h2 class="uui-heading-medium">Budget Table</h2>
                    <div class="uui-space-xsmall"></div>
                    <div class="uui-text-size-large">See where you&#x27;ll be if you stick to your budget<strong></strong></div>
                    </div>
                </div>
                    <div class="uui-table">
                        <div className="">
                            <div className={conditionalLayoutGrid}>
                                <div className="uui-table_row-content input-header">
                                    <span>Initial Balance:</span>
                                </div>
                                <div className="uui-table_row-content input-header">
                                    <input type="number" className="expense-input" value={initialBalance} onChange={e => setInitialBalance(e.target.value)} />
                                </div>
                                <div className="uui-table_row-content input-header">
                                    <button type="button" className="btn btn-primary" onClick={changeInitialBalance}>Change</button>
                                </div>
                            </div>
                            <div className="uui-table_heading-row">
                                <div className="uui-table_heading-row-text">Date</div>
                                <div className="uui-table_heading-row-text">Balance</div>
                                <div className="uui-table_heading-row-text">Income</div>
                                <div className="uui-table_heading-row-text">Expense</div>
                                <div className="uui-table_heading-row-text">Amount</div>
                                <div className="uui-table_heading-row-text">Action</div>
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

                        {isLargeScreen && calendar.map((dayData, index) => (
                            <div key={index} className="w-layout-grid uui-table_row background-color-gray50">
                                <div className="w-layout-grid uui-table-row-day-of-month">
                                    <div className="div-block-2">
                                        <div className="uui-pricing07_row-lead-text date-column">{dayData.date}</div>
                                    </div>
                                </div>
                                {monthDailyData[dayData.date] && monthDailyData[dayData.date].previousBalance && monthDailyData[dayData.date].currentBalance ? (
                                    <div className="w-layout-grid uui-table-row-day-of-month balance-column">
                                        <div className="uui-text-size-medium starting-balance">
                                            {(monthDailyData[dayData.date].previousBalance || 0) > 0 ?
                                                `$${monthDailyData[dayData.date].previousBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                !isNaN(monthDailyData[dayData.date].previousBalance) ?
                                                    `-$${Math.abs(monthDailyData[dayData.date].previousBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                                        </div>
                                        <div className="uui-text-size-medium ending-balance">
                                            {monthDailyData[dayData.date].currentBalance > 0 ?
                                                `$${monthDailyData[dayData.date].currentBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` :
                                                `-$${Math.abs(monthDailyData[dayData.date].currentBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="w-layout-grid uui-table-row-day-of-month">
                                        <div className="div-block-2"></div>
                                    </div>
                                )}

                                {monthDailyData[dayData.date] ? (
                                    <div className="w-layout-grid uui-table-row-day-of-month income-column">
                                        <div className={(monthDailyData[dayData.date].income || []).length > 0 ? 'uui-text-size-medium income' : 'uui-text-size-medium'}>
                                            {(monthDailyData[dayData.date].income || []).length > 0 ? `$${(monthDailyData[dayData.date].income || []).reduce((total, current) => total + current.amount, 0).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : ''}
                                        </div>
                                        {Array(Math.max((monthDailyData[dayData.date].expense || []).length - 1, 0)).fill().map((_, i) => (
                                            <div key={i} className="uui-text-size-medium">
                                                <div>{i > (monthDailyData[dayData.date].income || []).length ? '' : ''}</div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-layout-grid uui-table-row-day-of-month">
                                        <div className="div-block-2"></div>
                                    </div>
                                )}

                                {monthDailyData[dayData.date] ? (
                                    <div className="w-layout-grid uui-table-row-day-of-month expense-column">
                                        {(monthDailyData[dayData.date].expense || []).map((expense, index) => (
                                            <div key={index} className="uui-text-size-medium expense-cell">{expense.expenses}</div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-layout-grid uui-table-row-day-of-month">
                                        <div className="div-block-2"></div>
                                    </div>
                                )}

                                {monthDailyData[dayData.date] ? (
                                    <div className="w-layout-grid uui-table-row-day-of-month expense-price-column">
                                        {(monthDailyData[dayData.date].expense || []).map((expense, index) => (
                                            <div key={index} className="uui-text-size-medium expense-cell">
                                                $ {expense.amount.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="w-layout-grid uui-table-row-day-of-month">
                                        <div className="div-block-2"></div>
                                    </div>
                                )}

                                <div className="w-layout-grid uui-table-row-day-of-month action-column">
                                    <div className="action">
                                        <div className="action-data">
                                            <button type="button" className="btn btn-primary" onClick={() => addIncomeModal(dayData.date)}>Add Income</button>
                                            <button type="button" className="btn btn-primary" onClick={() => addExpenseModal(dayData.date)}>Add Expense</button>
                                            <button type="button" className="btn btn-primary" disabled={!monthDailyData[dayData.date]} onClick={() => selectedInstanceModal(dayData.date)}>Modify Instance</button>
                                            <button type="button" className="btn btn-primary" onClick={() => notesModal(dayData.date)}>Notes</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

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
        <NotesModal 
            ref={noteModalRef} 
            modalClosed={refreshTable} 
            currentNotes={currentNotes} 
            selectedDate={selectedDate} 
        />
        <ExpenseModal
            ref={expenseModalRef}
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
        <IncomeModal
            ref={incomeModalRef}
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
        <ModifyInstanceModal
            ref={modifyInstanceModalRef}
            onModalClosed={refreshTable}
            selectedDate={selectedDate}
            selectedInstance={selectedInstance}
        />
    </section>
  );
}

export default BudgetTable;
