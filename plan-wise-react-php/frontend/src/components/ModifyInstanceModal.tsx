import React, { useState, useEffect, forwardRef } from 'react';
import budgetTableAPI from '../services/budget-table-service';
import './ModifyInstanceModal.css';

const ModifyInstanceModal = forwardRef((props: any, ref: any) => {
    const [expenseInstanceIndex, setExpenseInstanceIndex] = useState<any>(0);
    const [incomeInstanceIndex, setIncomeInstanceIndex] = useState<any>(0);
    const [localSelectedInstance, setLocalSelectedInstance] = useState<any>({ income: [], expense: [] });
    const [localSelectedDate, setLocalSelectedDate] = useState<any>('');
  
    useEffect(() => {
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
        props.selectedInstance, 
        props.selectedDate, 
    ]);

    const onShow = () => {
        setExpenseInstanceIndex(0);
        setIncomeInstanceIndex(0);
        setLocalSelectedDate(props.selectedDate);
        setLocalSelectedInstance(props.selectedInstance);
        console.log(props.selectedInstance.expense);
    };
    const handleExpenseChange = (e: any) => {
        let newExpense = [...localSelectedInstance.expense];
        newExpense[expenseInstanceIndex].expenses = e.target.value;
        setLocalSelectedInstance({ ...localSelectedInstance, expense: newExpense });
    };
        
    const handleAmountChange = (e: any) => {
        let newExpense = [...localSelectedInstance.expense];
        newExpense[expenseInstanceIndex].amount = e.target.value;
        setLocalSelectedInstance({ ...localSelectedInstance, expense: newExpense });
    };
    
    const handleSourceChange = (e: any) => {
        let newIncome = [...localSelectedInstance.income];
        newIncome[incomeInstanceIndex].source = e.target.value;
        setLocalSelectedInstance({ ...localSelectedInstance, income: newIncome });
    };
    
    const handleIncomeAmountChange = (e: any) => {
        let newIncome = [...localSelectedInstance.income];
        newIncome[incomeInstanceIndex].amount = e.target.value;
        setLocalSelectedInstance({ ...localSelectedInstance, income: newIncome });
    };
    
    const handleDateChange = (e: any) => {
        setLocalSelectedDate(e.target.value);
    };
    
    const incrementExpenseInstanceIndex = () => {
        if (expenseInstanceIndex === localSelectedInstance.expense.length - 1) {
            return;
        }
        setExpenseInstanceIndex(expenseInstanceIndex + 1);
    };

    const decrementExpenseInstanceIndex = () => {
        if (expenseInstanceIndex === 0) {
            return;
        }
        setExpenseInstanceIndex(expenseInstanceIndex - 1);
    };

    const incrementIncomeInstanceIndex = () => {
        if (incomeInstanceIndex === localSelectedInstance.income.length - 1) {
            return;
        }
        setIncomeInstanceIndex(incomeInstanceIndex + 1);
    };

    const decrementIncomeInstanceIndex = () => {
        if (incomeInstanceIndex === 0) {
            return;
        }
        setIncomeInstanceIndex(incomeInstanceIndex - 1);
    };

    const modifyInstance = async () => {
        try {
            let body = {
                date: localSelectedDate,
                income: localSelectedInstance.income,
                expense: localSelectedInstance.expense
            };
            let response = await budgetTableAPI.updateBudgets(body);
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
        <div className="modal fade" id="modifyInstanceModal" ref={ref} tabIndex={-1} role="dialog" aria-labelledby="modifyInstanceModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="modifyInstanceModalLabel">Modify Instance</h5>
                        <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <ul className="nav nav-tabs" id="instanceTabs" role="tablist">
                            {localSelectedInstance.expense.length > 0 && (
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link active" id="expense-data-tab" data-bs-toggle="tab" data-bs-target="#expense-data" type="button" role="tab" aria-controls="expense-data" aria-selected="true">Expense</button>
                                </li>
                            )}
                            {localSelectedInstance.income.length > 0 && (
                                <li className="nav-item" role="presentation">
                                    <button className="nav-link" id="income-data-tab" data-bs-toggle="tab" data-bs-target="#income-data" type="button" role="tab" aria-controls="income-data" aria-selected="false">Income</button>
                                </li>
                            )}
                        </ul>
                        <div className="tab-content" id="instanceTabsContent">
                            {localSelectedInstance.expense.length > 0 && (
                                <div className="tab-pane fade show active" id="expense-data" role="tabpanel" aria-labelledby="expense-data-tab">
                                    <div className="income-expense-input">
                                        <div className="income-expense-row">
                                            <span>Expense: </span>
                                            <input type="text" className="expense-input modal-input" value={localSelectedInstance.expense[expenseInstanceIndex].expenses} onChange={handleExpenseChange} />
                                        </div>
                                        <div className="income-expense-row">
                                            <span>Amount($): </span>
                                            <input type="number" className="expense-input modal-input" value={localSelectedInstance.expense[expenseInstanceIndex].amount} onChange={handleAmountChange} />
                                        </div>
                                        <div className="income-expense-row">
                                            <span>Date: </span>
                                            <input type="date" pattern="\d{4}-\d{2}-\d{2}" disabled={true} className="expense-input modal-input" value={localSelectedDate} onChange={handleDateChange} />
                                        </div>
                                    </div>
                                    <div className="center-pagination">
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">
                                                <li className="page-item">
                                                    <a className="page-link" onClick={decrementExpenseInstanceIndex}>&lt;&lt; Previous</a>
                                                </li>
                                                <li className="page-item">
                                                    <a className="page-link" onClick={incrementExpenseInstanceIndex}>Next &gt;&gt;</a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            )}
                            {localSelectedInstance.income.length > 0 && (
                                <div className="tab-pane fade" id="income-data" role="tabpanel" aria-labelledby="income-data-tab">
                                    <div className="income-expense-input">
                                        <div className="income-expense-row">
                                            <span>Source: </span>
                                            <input type="text" className="expense-input modal-input" value={localSelectedInstance.income[incomeInstanceIndex].source} onChange={handleSourceChange} />
                                        </div>
                                        <div className="income-expense-row">
                                            <span>Amount($): </span>
                                            <input type="number" className="expense-input modal-input" value={localSelectedInstance.income[incomeInstanceIndex].amount} onChange={handleIncomeAmountChange} />
                                        </div>
                                        <div className="income-expense-row">
                                            <span>Date: </span>
                                            <input type="date" pattern="\d{4}-\d{2}-\d{2}" disabled={true} className="expense-input modal-input" value={localSelectedDate} onChange={handleDateChange} />
                                        </div>
                                    </div>
                                    <div className="center-pagination">
                                        <nav aria-label="Page navigation example">
                                            <ul className="pagination">
                                                <li className="page-item">
                                                    <a className="page-link" onClick={decrementIncomeInstanceIndex}>&lt;&lt; Previous</a>
                                                </li>
                                                <li className="page-item">
                                                    <a className="page-link" onClick={incrementIncomeInstanceIndex}>Next &gt;&gt;</a>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={modifyInstance}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default ModifyInstanceModal;
