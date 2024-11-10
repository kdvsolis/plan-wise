import React, { useState, useEffect, ForwardedRef } from "react";
import categoryAPI from '../services/category-service';
import expenseAPI from '../services/expense-service';
import './ExpenseModal.css';

interface ExpenseModalProps {
  headerExpense: string;
  headerAmount: number;
  selectedDate: string;
  selectedClassHeader: string;
  selectedOptionHeader: string;
  selectedOption: string;
  selectedClass: string;
  headerDate: Date;
  selectedClassCategoryHeader: string;
  selectedOptionCategoryHeader: any;
  onModalClosed: () => void;
}

const ExpenseModal = React.forwardRef(
  (
    {
      headerExpense,
      headerAmount,
      selectedDate,
      selectedClassHeader,
      selectedOptionHeader,
      selectedOption,
      selectedClass,
      selectedClassCategoryHeader,
      selectedOptionCategoryHeader,
      onModalClosed,
    }: ExpenseModalProps,
    ref: any
  ) => {
    const [localHeaderExpense, setLocalHeaderExpense] = useState<string>('');
    const [localHeaderAmount, setLocalHeaderAmount] = useState<number>(0);
    const [localSelectedDate, setLocalSelectedDate] = useState<string>(selectedDate);
    const [localSelectedClassHeader, setLocalSelectedClassHeader] = useState<string>('');
    const [localSelectedOptionHeader, setLocalSelectedOptionHeader] = useState<string>('');
    const [localSelectedClassCategoryHeader, setLocalSelectedClassCategoryHeader] = useState<string>('');
    const [localSelectedOptionCategoryHeader, setLocalSelectedOptionCategoryHeader] = useState<any>('');
    const [options] = useState([
      { text: 'Daily', class: 'daily' },
      { text: 'Weekly', class: 'weekly' },
      { text: 'Every Other Week', class: 'every-other-week' },
      { text: 'Monthly', class: 'monthly' },
      { text: 'Quarterly', class: 'quarterly' },
      { text: 'Every 6 Months', class: 'every-6-months' },
      { text: 'Annually', class: 'annually' },
      { text: 'One Time', class: 'one-time-expense' }
    ]);
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
      categoryAPI.getAll().then(response => {
        setCategories(response.category || []);
      });
      onShow();
    }, []);

    useEffect(() => {
      const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            if (ref.current?.className.includes("show")) {
              onShow();
            }
          }
        }
      });

      observer.observe(ref.current!, { attributes: true });

      return () => {
        observer.disconnect();
      };
    }, [
      headerExpense, 
      headerAmount, 
      selectedDate, 
      selectedClassHeader, 
      selectedOptionHeader, 
      selectedClassCategoryHeader, 
      selectedOptionCategoryHeader
    ]);

    const onShow = () => {
      setLocalHeaderExpense(headerExpense);
      setLocalHeaderAmount(headerAmount);
      setLocalSelectedDate((new Date(selectedDate)).toISOString().substring(0, 10));
      setLocalSelectedClassHeader(selectedClassHeader);
      setLocalSelectedOptionHeader(selectedOptionHeader);
      setLocalSelectedClassCategoryHeader(selectedClassCategoryHeader);
      setLocalSelectedOptionCategoryHeader(selectedOptionCategoryHeader);
    };

    const selectOptionHeader = (option: { text: string, class: string }) => {
      setLocalSelectedOptionHeader(option.text);
      setLocalSelectedClassHeader(option.class);
    };

    const selectCategoryHeader = (category: any) => {
      setLocalSelectedOptionCategoryHeader(category);
      setLocalSelectedClassCategoryHeader(category.category_name === 'Select Category' ? '' : 'btn-primary');
    };

    const createExpense = async () => {
      try {
        const body = {
          expenses: localHeaderExpense,
          amount: localHeaderAmount,
          start_date: localSelectedDate,
          frequency: options.findIndex(x => localSelectedClassHeader === x.class),
          category: localSelectedOptionCategoryHeader.id
        };
        console.log(body);
        const response = await expenseAPI.create(body);
        if (response.success) {
          onModalClosed();
        } else {
          console.error(response.message);
        }
      } catch (exception) {
        console.error(exception);
      }
    };

    return (
      <div ref={ref} className="modal fade" id="expenseModal" tabIndex={-1} role="dialog" aria-labelledby="expenseModalLabel" aria-hidden="true">
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="expenseModalLabel">New Expense</h5>
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="modal-body">
              <div className="income-expense-input">
                <div className="income-expense-row">
                  <span>Expense: </span>
                  <input type="text" className="expense-input modal-input" value={localHeaderExpense} onChange={e => setLocalHeaderExpense(e.target.value)} />
                </div>
                <div className="income-expense-row">
                  <span>Amount($): </span>
                  <input type="number" className="expense-input modal-input" value={localHeaderAmount} onChange={e => setLocalHeaderAmount(Number(e.target.value))} />
                </div>
                <div className="income-expense-row">
                  <span>Date: </span>
                  <input type="date" pattern="\d{4}-\d{2}-\d{2}" disabled={true} className="expense-input modal-input" value={localSelectedDate} onChange={e => setLocalSelectedDate(e.target.value)} />
                </div>
                <div className="income-expense-row">
                  <span>Frequency: </span>
                  <div className="dropdown dropdown-border modal-input" data-bs-toggle="dropdown" data-bs-display="static">
                    <button className={`btn dropdown-toggle ${localSelectedClassHeader}`} type="button" id="dropdownMenuButtonHeader" aria-expanded="false">
                      {localSelectedOptionHeader}
                    </button>
                    <span className="dropdown-icon">▼</span>
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonHeader">
                      <li className="mt-1">
                        <a className="dropdown-item" href="#" onClick={() => selectOptionHeader({ text: '', class: '' })}>Select Interval</a>
                      </li>
                      {options.map(option => (
                        <li key={option.text} className="mt-1">
                          <a className={`${option.class} dropdown-item`} href="#" onClick={() => selectOptionHeader(option)}>{option.text}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="income-expense-row">
                  <span>Category: </span>
                  <div className="dropdown dropdown-border  modal-input" data-bs-toggle="dropdown" data-bs-display="static">
                    <button className={`btn dropdown-toggle ${localSelectedClassCategoryHeader}`} type="button" id="dropdownCategoryButtonHeader" aria-expanded="false">
                      {localSelectedOptionCategoryHeader?.category_name || "Select Category"}
                    </button>
                    <span className="dropdown-icon">▼</span>
                    <ul className="dropdown-menu" aria-labelledby="selectCategoryHeader">
                      <li className="mt-1">
                        <a className="dropdown-item" href="#" onClick={() => selectCategoryHeader({ category_name: 'Select Category' })}>Select Category</a>
                      </li>
                      {categories.map(category => (
                        <li key={category.id}>
                          <a className="one-time-expense dropdown-item" href="#" onClick={() => selectCategoryHeader(category)}>{category.category_name}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary" onClick={createExpense}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default ExpenseModal;
