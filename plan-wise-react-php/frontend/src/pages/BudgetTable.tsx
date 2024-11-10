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

// Define types for your state variables
interface DailyData {
  income: { amount: number }[];
  expense: { amount: number; expenses: string }[];
  previousBalance: number;
  currentBalance: number;
}

interface BudgetTableProps {}

const BudgetTable: React.FC<BudgetTableProps> = () => {
  const [currMonth, setCurrMonth] = useState<number>(-1);
  const [currYear, setCurrYear] = useState<number>(-1);
  const [initialBalance, setInitialBalance] = useState<number>(0);
  const [monthDailyData, setMonthDailyData] = useState<Record<string, DailyData>>({});
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString());
  const [balanceHistory, setBalanceHistory] = useState<number[]>([]);
  const [months] = useState<string[]>([
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]);
  const [calendar, setCalendar] = useState<any[]>([]);
  const [mediaQuery, setMediaQuery] = useState<MediaQueryList>(window.matchMedia("(min-width: 724px)"));
  const [isLargeScreen, setIsLargeScreen] = useState<boolean>(mediaQuery.matches);
  const [currentNotes, setCurrentNotes] = useState<{ notes: string }>({ notes: "" });

  const noteModalRef = useRef<any>(null);
  const expenseModalRef = useRef<any>(null);
  const incomeModalRef = useRef<any>(null);
  const modifyInstanceModalRef = useRef<any>(null);

  const [noteModal, setNoteModal] = useState<any>(null);
  const [expenseModal, setExpenseModal] = useState<any>(null);
  const [incomeModal, setIncomeModal] = useState<any>(null);
  const [modifyInstanceModal, setModifyInstanceModal] = useState<any>(null);

  const conditionalLayoutGrid = `${mediaQuery.matches ? 'w-layout-grid' : ''} uui-table_row new-row`;

  useEffect(() => {
    document.title = "Plan Wise - Budget Table";
    initializeData();
  }, []);

  useEffect(() => {
    if (noteModalRef.current) setNoteModal(new Modal(noteModalRef.current));
    if (expenseModalRef.current) setExpenseModal(new Modal(expenseModalRef.current));
    if (incomeModalRef.current) setIncomeModal(new Modal(incomeModalRef.current));
    if (modifyInstanceModalRef.current) setModifyInstanceModal(new Modal(modifyInstanceModalRef.current));
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

  const generate = async (monthDailyData: Record<string, DailyData>, initialBalance: number) => {
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
  };

  const getDaysInMonth = (start: Date, end: Date) => {
    const dates: any[] = [];
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

  const updateMediaQuery = (event: MediaQueryListEvent) => {
    const mediaQueryList = event.currentTarget as MediaQueryList;
    setMediaQuery(mediaQueryList); // store the mediaQuery object if needed
    setIsLargeScreen(mediaQueryList.matches); // directly use the matches property
  };
  

  const changeInitialBalance = async () => {
    await accountAPI.updateUser({
      balance: initialBalance
    });
    await initializeData();
  };

  const refreshTable = async () => {
    const month = moment(selectedDate).month();
    const year = moment(selectedDate).year();
    const calendar = getDaysInMonth(new Date(year, month, 1), new Date(year, month + 1, 0));
    setCalendar(calendar);
    const initBalance = monthDailyData[selectedDate].previousBalance;
    setInitialBalance(initBalance);
    await getMonthlyData(month, year, initBalance);
    setCalendar(calendar);
    expenseModal?.hide();
    incomeModal?.hide();
    modifyInstanceModal?.hide();
  };

  useLayoutEffect(() => {
    mediaQuery.addEventListener("change", updateMediaQuery);
    return () => {
      mediaQuery.removeEventListener("change", updateMediaQuery);
    };
  }, [mediaQuery]);

  return (
    <section className="uui-section_table">
      <div className="uui-page-padding">
        <div className="uui-container-large">
          <div className="uui-padding-vertical-xhuge">
            <div className="uui-text-align-center">
              <div className="uui-max-width-large align-center">
                <h2 className="uui-heading-medium">Budget Table</h2>
                <div className="uui-space-xsmall"></div>
                <div className="uui-text-size-large">See where you&#x27;ll be if you stick to your budget<strong></strong></div>
              </div>
            </div>
            <div className="uui-table">
              {/* Table content here */}
              {/* Your table and other JSX goes here */}
            </div>
          </div>
        </div>
      </div>
      {/* Modals */}
      <NotesModal ref={noteModalRef} modalClosed={refreshTable} currentNotes={currentNotes} selectedDate={selectedDate} />
      <ExpenseModal ref={expenseModalRef} onModalClosed={refreshTable} selectedOptionCategoryHeader={""} selectedClassCategoryHeader={""} selectedOptionHeader={""} selectedClassHeader={""} selectedOption={""} selectedClass={""} headerExpense={""} headerAmount={0} headerDate={new Date()} selectedDate={selectedDate} />
      <IncomeModal ref={incomeModalRef} onModalClosed={refreshTable} selectedOptionHeader={""} selectedClassHeader={""} selectedOption={""} selectedClass={""} headerSource={""} headerAmount={""} headerDate={""} selectedDate={selectedDate} />
      <ModifyInstanceModal ref={modifyInstanceModalRef} onModalClosed={refreshTable} selectedDate={selectedDate} selectedInstance={{}} />
    </section>
  );
};

export default BudgetTable;
