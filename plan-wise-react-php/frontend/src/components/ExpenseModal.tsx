import React, { useState, useEffect, forwardRef } from "react";
import categoryAPI from '../services/category-service';
import expenseAPI from '../services/expense-service';
import './ExpenseModal.css'

const ExpenseModal = forwardRef((props, ref) => {
    const [localHeaderExpense, setLocalHeaderExpense] = useState("");
    const [localHeaderAmount, setLocalHeaderAmount] = useState(0);
    // @ts-expect-error TS(2339): Property 'selectedDate' does not exist on type '{}... Remove this comment to see the full error message
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
                    // @ts-expect-error TS(2531): Object is possibly 'null'.
                    if(ref.current.className.includes("show")){
                        onShow();
                    }
                }
            }
        });
    
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        observer.observe(ref.current, { attributes: true });
    
        return () => {
            observer.disconnect();
        };
    }, [
        // @ts-expect-error TS(2339): Property 'headerExpense' does not exist on type '{... Remove this comment to see the full error message
        props.headerExpense, 
        // @ts-expect-error TS(2339): Property 'headerAmount' does not exist on type '{}... Remove this comment to see the full error message
        props.headerAmount, 
        // @ts-expect-error TS(2339): Property 'selectedDate' does not exist on type '{}... Remove this comment to see the full error message
        props.selectedDate, 
        // @ts-expect-error TS(2339): Property 'selectedClassHeader' does not exist on t... Remove this comment to see the full error message
        props.selectedClassHeader, 
        // @ts-expect-error TS(2339): Property 'selectedOptionHeader' does not exist on ... Remove this comment to see the full error message
        props.selectedOptionHeader, 
        // @ts-expect-error TS(2339): Property 'selectedClassCategoryHeader' does not ex... Remove this comment to see the full error message
        props.selectedClassCategoryHeader, 
        // @ts-expect-error TS(2339): Property 'selectedOptionCategoryHeader' does not e... Remove this comment to see the full error message
        props.selectedOptionCategoryHeader
    ]);

    const onShow = () => {
        // @ts-expect-error TS(2339): Property 'headerExpense' does not exist on type '{... Remove this comment to see the full error message
        setLocalHeaderExpense(props.headerExpense);
        // @ts-expect-error TS(2339): Property 'headerAmount' does not exist on type '{}... Remove this comment to see the full error message
        setLocalHeaderAmount(props.headerAmount);
        // @ts-expect-error TS(2339): Property 'selectedDate' does not exist on type '{}... Remove this comment to see the full error message
        setLocalSelectedDate((new Date(props.selectedDate)).toISOString().substring(0, 10));
        // @ts-expect-error TS(2339): Property 'selectedClassHeader' does not exist on t... Remove this comment to see the full error message
        setLocalSelectedClassHeader(props.selectedClassHeader);
        // @ts-expect-error TS(2339): Property 'selectedOptionHeader' does not exist on ... Remove this comment to see the full error message
        setLocalSelectedOptionHeader(props.selectedOptionHeader);
        // @ts-expect-error TS(2339): Property 'selectedClassCategoryHeader' does not ex... Remove this comment to see the full error message
        setLocalSelectedClassCategoryHeader(props.selectedClassCategoryHeader);
        // @ts-expect-error TS(2339): Property 'selectedOptionCategoryHeader' does not e... Remove this comment to see the full error message
        setLocalSelectedOptionCategoryHeader(props.selectedOptionCategoryHeader);
    };

    const selectOptionHeader = (option: any) => {
        setLocalSelectedOptionHeader(option.text);
        setLocalSelectedClassHeader(option.class);
    };

    const selectCategoryHeader = (category: any) => {
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
            // @ts-expect-error TS(2339): Property 'id' does not exist on type 'string'.
            category: localSelectedOptionCategoryHeader.id
        };
        console.log(body)
        let response = await expenseAPI.create(body);
        if (response.success) {
            // @ts-expect-error TS(2339): Property 'onModalClosed' does not exist on type '{... Remove this comment to see the full error message
            props.onModalClosed();
        } else {
            console.error(response.message);
        }
        } catch (exception) {
        console.error(exception);
        }
    };

    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div ref={ref} className="modal fade" id="expenseModal" tabIndex="-1" role="dialog" aria-labelledby="expenseModalLabel" aria-hidden="true">
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className="modal-dialog" role="document">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-content">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-header">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <h5 className="modal-title" id="expenseModalLabel">New Expense</h5>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <span aria-hidden="true">&times;</span>
                </button>
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-body">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="income-expense-input">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="income-expense-row">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <span>Expense: </span>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input type="text" className="expense-input modal-input" value={localHeaderExpense} onChange={e => setLocalHeaderExpense(e.target.value)} />
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="income-expense-row">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <span>Amount($): </span>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input type="number" className="expense-input modal-input" value={localHeaderAmount} onChange={e => setLocalHeaderAmount(e.target.value)} />
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="income-expense-row">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <span>Date: </span>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input type="date" pattern="\d{4}-\d{2}-\d{2}" disabled={true} className="expense-input modal-input" value={localSelectedDate} onChange={e => setLocalSelectedDate(e.target.value)} />
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="income-expense-row">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <span>Frequency: </span>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="dropdown dropdown-border modal-input" data-bs-toggle="dropdown" data-bs-display="static">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <button className={`btn dropdown-toggle ${localSelectedClassHeader}`} type="button" id="dropdownMenuButtonHeader" aria-expanded="false">
                        {localSelectedOptionHeader}
                    </button>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <span className="dropdown-icon">▼</span>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <ul className="dropdown-menu" aria-labelledby="dropdownMenuButtonHeader">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <li className="mt-1">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <a className="dropdown-item" href="#" onClick={() => selectOptionHeader({ text: '', class: '' })}>Select Interval</a>
                        </li>
                        {options.map(option => (
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <li key={option.text} className="mt-1">
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <a className={`${option.class} dropdown-item`} href="#" onClick={() => selectOptionHeader(option)}>{option.text}</a>
                        </li>
                        ))}
                    </ul>
                    </div>
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="income-expense-row">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <span>Category: </span>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="dropdown dropdown-border  modal-input" data-bs-toggle="dropdown" data-bs-display="static">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <button className={`btn dropdown-toggle ${localSelectedClassCategoryHeader}`} type="button" id="dropdownCategoryButtonHeader" aria-expanded="false">
                        // @ts-expect-error TS(2339): Property 'category_name' does not exist on type 's... Remove this comment to see the full error message
                        {localSelectedOptionCategoryHeader?.category_name || "Select Category"}
                    </button>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <span className="dropdown-icon">▼</span>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <ul className="dropdown-menu" aria-labelledby="selectCategoryHeader">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <li className="mt-1">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <a className="dropdown-item" href="#" onClick={() => selectCategoryHeader({ category_name: 'Select Category' })}>Select Category</a>
                        </li>
                        {
                            categories.map(category => (
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <li key={category.id}>
                                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                    <a className="one-time-expense dropdown-item" href="#" onClick={() => selectCategoryHeader(category)}>{category.category_name}</a>
                                </li>
                            ))
                        }
                    </ul>
                    </div>
                </div>
                </div>
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-footer">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button type="button" className="btn btn-primary" onClick={createExpense}>Save changes</button>
            </div>
            </div>
        </div>
        </div>
    );
});

export default ExpenseModal;
