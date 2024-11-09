import React, { useState, useEffect, forwardRef } from "react";
import categoryAPI from '../services/category-service';
import expenseAPI from '../services/expense-service';
import './ExpenseModal.css'

const ExpenseModal = forwardRef((props, ref) => {
    const [localHeaderExpense, setLocalHeaderExpense] = useState("");
    const [localHeaderAmount, setLocalHeaderAmount] = useState(0);
    const [localSelectedDate, setLocalSelectedDate] = useState(props.selectedDate);
    const [localSelectedClassHeader, setLocalSelectedClassHeader] = useState("");
    const [localSelectedOptionHeader, setLocalSelectedOptionHeader] = useState("");
    const [localSelectedClassCategoryHeader, setLocalSelectedClassCategoryHeader] = useState("");
    const [localSelectedOptionCategoryHeader, setLocalSelectedOptionCategoryHeader] = useState("");
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
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        categoryAPI.getAll().then(response => {
        setCategories(response.category || []);
        });
        onShow();
    }, []);
    useEffect(() => {
        const observer = new MutationObserver((mutationsList) => {
            for(let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if(ref.current.className.includes("show")){
                        onShow();
                    }
                }
            }
        });
    
        observer.observe(ref.current, { attributes: true });
    
        return () => {
            observer.disconnect();
        };
    }, [
        props.headerExpense, 
        props.headerAmount, 
        props.selectedDate, 
        props.selectedClassHeader, 
        props.selectedOptionHeader, 
        props.selectedClassCategoryHeader, 
        props.selectedOptionCategoryHeader
    ]);

    const onShow = () => {
        setLocalHeaderExpense(props.headerExpense);
        setLocalHeaderAmount(props.headerAmount);
        setLocalSelectedDate((new Date(props.selectedDate)).toISOString().substring(0, 10));
        setLocalSelectedClassHeader(props.selectedClassHeader);
        setLocalSelectedOptionHeader(props.selectedOptionHeader);
        setLocalSelectedClassCategoryHeader(props.selectedClassCategoryHeader);
        setLocalSelectedOptionCategoryHeader(props.selectedOptionCategoryHeader);
    };

    const selectOptionHeader = (option) => {
        setLocalSelectedOptionHeader(option.text);
        setLocalSelectedClassHeader(option.class);
    };

    const selectCategoryHeader = (category) => {
        setLocalSelectedOptionCategoryHeader(category);
        setLocalSelectedClassCategoryHeader(category.category_name === 'Select Category' ? '' : 'btn-primary');
    };

    const createExpense = async () => {
        try {
        let body = {
            expenses: localHeaderExpense,
            amount: localHeaderAmount,
            start_date: localSelectedDate,
            frequency: options.findIndex(x => localSelectedClassHeader === x.class),
            category: localSelectedOptionCategoryHeader.id
        };
        console.log(body)
        let response = await expenseAPI.create(body);
        if (response.success) {
            props.onModalClosed();
        } else {
            console.error(response.message);
        }
        } catch (exception) {
        console.error(exception);
        }
    };

    return (
        <div ref={ref} className="modal fade" id="expenseModal" tabIndex="-1" role="dialog" aria-labelledby="expenseModalLabel" aria-hidden="true">
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
                    <input type="number" className="expense-input modal-input" value={localHeaderAmount} onChange={e => setLocalHeaderAmount(e.target.value)} />
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
                        {
                            categories.map(category => (
                                <li key={category.id}>
                                    <a className="one-time-expense dropdown-item" href="#" onClick={() => selectCategoryHeader(category)}>{category.category_name}</a>
                                </li>
                            ))
                        }
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
});

export default ExpenseModal;
