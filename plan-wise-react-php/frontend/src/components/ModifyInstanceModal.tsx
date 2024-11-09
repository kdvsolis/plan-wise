import React, { useState, useEffect, forwardRef } from 'react';
import budgetTableAPI from '../services/budget-table-service';
import './ModifyInstanceModal.css';

const ModifyInstanceModal = forwardRef((props, ref) => {
    const [expenseInstanceIndex, setExpenseInstanceIndex] = useState(0);
    const [incomeInstanceIndex, setIncomeInstanceIndex] = useState(0);
    const [localSelectedInstance, setLocalSelectedInstance] = useState({ income: [], expense: [] });
    const [localSelectedDate, setLocalSelectedDate] = useState('');
  
    useEffect(() => {
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
        // @ts-expect-error TS(2339): Property 'selectedInstance' does not exist on type... Remove this comment to see the full error message
        props.selectedInstance, 
        // @ts-expect-error TS(2339): Property 'selectedDate' does not exist on type '{}... Remove this comment to see the full error message
        props.selectedDate, 
    ]);

    const onShow = () => {
        setExpenseInstanceIndex(0);
        setIncomeInstanceIndex(0);
        // @ts-expect-error TS(2339): Property 'selectedDate' does not exist on type '{}... Remove this comment to see the full error message
        setLocalSelectedDate(props.selectedDate);
        // @ts-expect-error TS(2339): Property 'selectedInstance' does not exist on type... Remove this comment to see the full error message
        setLocalSelectedInstance(props.selectedInstance);
        // @ts-expect-error TS(2339): Property 'selectedInstance' does not exist on type... Remove this comment to see the full error message
        console.log(props.selectedInstance.expense);
    };
    const handleExpenseChange = (e: any) => {
        let newExpense = [...localSelectedInstance.expense];
        // @ts-expect-error TS(2339): Property 'expenses' does not exist on type 'never'... Remove this comment to see the full error message
        newExpense[expenseInstanceIndex].expenses = e.target.value;
        setLocalSelectedInstance({ ...localSelectedInstance, expense: newExpense });
    };
        
    const handleAmountChange = (e: any) => {
        let newExpense = [...localSelectedInstance.expense];
        // @ts-expect-error TS(2339): Property 'amount' does not exist on type 'never'.
        newExpense[expenseInstanceIndex].amount = e.target.value;
        setLocalSelectedInstance({ ...localSelectedInstance, expense: newExpense });
    };
    
    const handleSourceChange = (e: any) => {
        let newIncome = [...localSelectedInstance.income];
        // @ts-expect-error TS(2339): Property 'source' does not exist on type 'never'.
        newIncome[incomeInstanceIndex].source = e.target.value;
        setLocalSelectedInstance({ ...localSelectedInstance, income: newIncome });
    };
    
    const handleIncomeAmountChange = (e: any) => {
        let newIncome = [...localSelectedInstance.income];
        // @ts-expect-error TS(2339): Property 'amount' does not exist on type 'never'.
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
        <div className="modal fade" id="modifyInstanceModal" ref={ref} tabIndex="-1" role="dialog" aria-labelledby="modifyInstanceModalLabel" aria-hidden="true">
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div className="modal-dialog" role="document">
          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
          <div className="modal-content">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-header">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <h5 className="modal-title" id="modifyInstanceModalLabel">Modify Instance</h5>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-body">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <ul className="nav nav-tabs" id="instanceTabs" role="tablist">
                {localSelectedInstance.expense.length > 0 && (
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <li className="nav-item" role="presentation">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <button className="nav-link active" id="expense-data-tab" data-bs-toggle="tab" data-bs-target="#expense-data" type="button" role="tab" aria-controls="expense-data" aria-selected="true">Expense</button>
                  </li>
                )}
                {localSelectedInstance.income.length > 0 && (
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <li className="nav-item" role="presentation">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <button className="nav-link" id="income-data-tab" data-bs-toggle="tab" data-bs-target="#income-data" type="button" role="tab" aria-controls="income-data" aria-selected="false">Income</button>
                  </li>
                )}
              </ul>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <div className="tab-content" id="instanceTabsContent">
                {localSelectedInstance.expense.length > 0 && (
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <div className="tab-pane fade show active" id="expense-data" role="tabpanel" aria-labelledby="expense-data-tab">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="income-expense-input">
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <div className="income-expense-row">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <span>Expense: </span>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <input type="text" className="expense-input modal-input" value={localSelectedInstance.expense[expenseInstanceIndex].expenses} onChange={handleExpenseChange} />
                      </div>
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <div className="income-expense-row">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <span>Amount($): </span>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <input type="number" className="expense-input modal-input" value={localSelectedInstance.expense[expenseInstanceIndex].amount} onChange={handleAmountChange} />
                      </div>
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <div className="income-expense-row">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <span>Date: </span>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <input type="date" pattern="\d{4}-\d{2}-\d{2}" disabled="true" className="expense-input modal-input" value={localSelectedDate} onChange={handleDateChange} />
                      </div>
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
                            <a className="page-link" onClick={decrementExpenseInstanceIndex}>&lt;&lt; Previous</a>
                          </li>
                          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                          <li className="page-item">
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <a className="page-link" onClick={incrementExpenseInstanceIndex}>Next &gt;&gt;</a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                )}
                {localSelectedInstance.income.length > 0 && (
                  // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                  <div className="tab-pane fade" id="income-data" role="tabpanel" aria-labelledby="income-data-tab">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="income-expense-input">
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <div className="income-expense-row">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <span>Source: </span>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <input type="text" className="expense-input modal-input" value={localSelectedInstance.income[incomeInstanceIndex].source} onChange={handleSourceChange} />
                      </div>
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <div className="income-expense-row">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <span>Amount($): </span>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <input type="number" className="expense-input modal-input" value={localSelectedInstance.income[incomeInstanceIndex].amount} onChange={handleIncomeAmountChange} />
                      </div>
                      // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                      <div className="income-expense-row">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <span>Date: </span>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <input type="date" pattern="\d{4}-\d{2}-\d{2}" disabled="true" className="expense-input modal-input" value={localSelectedDate} onChange={handleDateChange} />
                      </div>
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
                            <a className="page-link" onClick={decrementIncomeInstanceIndex}>&lt;&lt; Previous</a>
                          </li>
                          // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                          <li className="page-item">
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <a className="page-link" onClick={incrementIncomeInstanceIndex}>Next &gt;&gt;</a>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </div>
                )}
              </div>
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className="modal-footer">
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
              <button type="button" className="btn btn-primary" onClick={modifyInstance}>Save changes</button>
            </div>
          </div>
        </div>
      </div>
    );
});

export default ModifyInstanceModal;
