import React, { useState, useEffect, forwardRef } from "react";
import categoryAPI from '../services/category-service';
import incomeAPI from '../services/income-service';
import './IncomeModal.css';

const IncomeModal = forwardRef<any, any>((props: any, ref: any) => {
    const [localHeaderSource, setLocalHeaderSource] = useState<any>("");
    const [localHeaderAmount, setLocalHeaderAmount] = useState<any>(0);
    const [localSelectedDate, setLocalSelectedDate] = useState<any>(props.selectedDate);
    const [localSelectedClassHeader, setLocalSelectedClassHeader] = useState<any>("");
    const [localSelectedOptionHeader, setLocalSelectedOptionHeader] = useState<any>("");
    const [options] = useState<any>([
        { text: 'Daily', class: 'daily' },
        { text: 'Weekly', class: 'weekly' },
        { text: 'Every Other Week', class: 'every-other-week' },
        { text: 'Monthly', class: 'monthly' },
        { text: 'Quarterly', class: 'quarterly' },
        { text: 'Every 6 Months', class: 'every-6-months' },
        { text: 'Annually', class: 'annually' },
        { text: 'One Time', class: 'one-time-expense' }
    ]);
    const [categories, setCategories] = useState<any>([]);

    useEffect(() => {
        categoryAPI.getAll().then((response: any) => {
            setCategories(response.category || []);
        });
        onShow();
    }, []);

    useEffect(() => {
        const observer = new MutationObserver((mutationsList: any) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (ref.current.className.includes("show")) {
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
        props.headerSource,
        props.headerAmount,
        props.selectedDate,
        props.selectedClassHeader,
        props.selectedOptionHeader,
        props.selectedClassCategoryHeader,
        props.selectedOptionCategoryHeader
    ]);

    const onShow = () => {
        setLocalHeaderSource(props.headerSource);
        setLocalHeaderAmount(props.headerAmount);
        setLocalSelectedDate((new Date(props.selectedDate)).toISOString().substring(0, 10));
        setLocalSelectedClassHeader(props.selectedClassHeader);
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
                frequency: options.findIndex((x: any) => localSelectedClassHeader === x.class)
            };
            console.log(body);
            let response = await incomeAPI.create(body);
            if (response.success) {
                props.onModalClosed();
            } else {
                console.error(response.message);
            }
        } catch (exception: any) {
            console.error(exception);
        }
    };

    return (
        <div ref={ref} className="modal fade" id="incomeModal" tabIndex={-1} role="dialog" aria-labelledby="incomeModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="incomeModalLabel">New Income</h5>
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="income-expense-input">
                            <div className="income-expense-row">
                                <span>Source: </span>
                                <input type="text" className="expense-input modal-input" value={localHeaderSource} onChange={e => setLocalHeaderSource(e.target.value)} />
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
                                        {options.map((option: any) => (
                                            <li key={option.text} className="mt-1">
                                                <a className={`${option.class} dropdown-item`} href="#" onClick={() => selectOptionHeader(option)}>{option.text}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={createIncome}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default IncomeModal;
