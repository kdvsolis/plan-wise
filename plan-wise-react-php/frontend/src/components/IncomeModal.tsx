import React, { useState, useEffect, forwardRef } from "react";
import categoryAPI from '../services/category-service';
import incomeAPI from '../services/income-service';
import './IncomeModal.css'

const IncomeModal = forwardRef((props, ref) => {
    const [localHeaderSource, setLocalHeaderSource] = useState("");
    const [localHeaderAmount, setLocalHeaderAmount] = useState(0);
    // @ts-expect-error TS(2339): Property 'selectedDate' does not exist on type '{}... Remove this comment to see the full error message
    const [localSelectedDate, setLocalSelectedDate] = useState(props.selectedDate);
    const [localSelectedClassHeader, setLocalSelectedClassHeader] = useState("");
    const [localSelectedOptionHeader, setLocalSelectedOptionHeader] = useState("");
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
        // @ts-expect-error TS(2339): Property 'headerSource' does not exist on type '{}... Remove this comment to see the full error message
        props.headerSource, 
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
        // @ts-expect-error TS(2339): Property 'headerSource' does not exist on type '{}... Remove this comment to see the full error message
        setLocalHeaderSource(props.headerSource);
        // @ts-expect-error TS(2339): Property 'headerAmount' does not exist on type '{}... Remove this comment to see the full error message
        setLocalHeaderAmount(props.headerAmount);
        // @ts-expect-error TS(2339): Property 'selectedDate' does not exist on type '{}... Remove this comment to see the full error message
        setLocalSelectedDate((new Date(props.selectedDate)).toISOString().substring(0, 10));
        // @ts-expect-error TS(2339): Property 'selectedClassHeader' does not exist on t... Remove this comment to see the full error message
        setLocalSelectedClassHeader(props.selectedClassHeader);
        // @ts-expect-error TS(2339): Property 'selectedOptionHeader' does not exist on ... Remove this comment to see the full error message
        setLocalSelectedOptionHeader(props.selectedOptionHeader);
    };

    const selectOptionHeader = (option: any) => {
        setLocalSelectedOptionHeader(option.text);
        setLocalSelectedClassHeader(option.class);
    };


    const createIncome = async () => {
        try {
        let body = {
            source: localHeaderSource,
            amount: localHeaderAmount,
            start_date: localSelectedDate,
            frequency: options.findIndex(x => localSelectedClassHeader === x.class)
        };
        console.log(body)
        let response = await incomeAPI.create(body);
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
        <div ref={ref} className="modal fade" id="incomeModal" tabIndex="-1" role="dialog" aria-labelledby="incomeModalLabel" aria-hidden="true">
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className="modal-dialog" role="document">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-content">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-header">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <h5 className="modal-title" id="incomeModalLabel">New Income</h5>
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
                    <span>Source: </span>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input type="text" className="expense-input modal-input" value={localHeaderSource} onChange={e => setLocalHeaderSource(e.target.value)} />
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
                </div>
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-footer">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button type="button" className="btn btn-primary" onClick={createIncome}>Save changes</button>
            </div>
            </div>
        </div>
        </div>
    );
});

export default IncomeModal;
