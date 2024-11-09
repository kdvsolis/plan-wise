import React, { useState, useEffect, useRef } from 'react';
// @ts-expect-error TS(7016): Could not find a declaration file for module 'boot... Remove this comment to see the full error message
import { Modal } from 'bootstrap';
import expense from '../services/expense-service';
import category from '../services/category-service';
import '../assets/components.css';
import '../assets/budgeting-app.css';
import './Expenses.css';
// @ts-expect-error TS(6142): Module '../components/ConfirmationModal' was resol... Remove this comment to see the full error message
import ConfirmationModal from '../components/ConfirmationModal';


function Expenses() {
    const [selectedOptionCategoryHeader, setSelectedOptionCategoryHeader] = useState({ category_name: 'Select Category' });
    const [selectedClassCategoryHeader, setSelectedClassCategoryHeader] = useState('');
    const [selectedOptionHeader, setSelectedOptionHeader] = useState('Select Interval');
    const [selectedClassHeader, setSelectedClassHeader] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const [deleteBodyMessage, setDeleteBodyMessage] = useState('');
    const [selectedExpenseIndex, setSelectedExpenseIndex] = useState(-1);
    const options = [
      { text: 'Daily', class: 'daily' },
      { text: 'Weekly', class: 'weekly' },
      { text: 'Every Other Week', class: 'every-other-week' },
      { text: 'Monthly', class: 'monthly' },
      { text: 'Quarterly', class: 'quarterly' },
      { text: 'Every 6 Months', class: 'every-6-months' },
      { text: 'Annually', class: 'annually' },
      { text: 'One Time', class: 'one-time-expense' }
    ];
    const [rows, setRows] = useState([]);
    const [categories, setCategories] = useState([]);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const confirmationModalRef = useRef();
    
    useEffect(() => {
        document.title = "Plan Wise - Expenses";
        const handleResize = () => {
          setWindowWidth(window.innerWidth);
        };
    
        window.addEventListener('resize', handleResize);
    
        fetchCategories().then(() => {
            fetchExpenses();
        });
        return () => {    
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        if (confirmationModalRef.current) {
            setConfirmationModal(new Modal(confirmationModalRef.current));
        }
    }, [confirmationModalRef.current]);
    
  
    const selectOption = (option: any, index: any) => {
        const newRows = [...rows];
        // @ts-expect-error TS(2339): Property 'frequency' does not exist on type 'never... Remove this comment to see the full error message
        newRows[index].frequency = options.findIndex(x => option["class"] === x["class"]);
        setRows(newRows);
    };
      
    const selectOptionHeader = (option: any) => {
        setSelectedOptionHeader(option.text);
        setSelectedClassHeader(option["class"]);
    };
      
    const selectCategoryOption = (category: any, index: any) => {
        const newRows = [...rows];
        // @ts-expect-error TS(2339): Property 'category' does not exist on type 'never'... Remove this comment to see the full error message
        newRows[index].category = category ? category.id : null;
        setRows(newRows);
    };
      
    const selectCategoryHeader = (category: any) => {
        setSelectedOptionCategoryHeader(category);
        setSelectedClassCategoryHeader(category ? 'btn-primary' : '');
    };

      
    const fetchCategories = async () => {
        try {
            let response = await category.getAll();
            setCategories(response.category || []);
        } catch(exception){
            console.log(exception);
        }
    };
    
    const fetchExpenses = async () => {
        try {
            let response = await expense.getAll();
            setRows(response.expense || []);
        } catch(exception){
            console.log(exception);
        }
    };
    
    const updateExpense = async (index: any) => {
        // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
        let response = await expense.update(rows[index].id, rows[index]);
        console.log(response);
    };
    
    const deleteConfirmation = (index: any) => {
        setSelectedExpenseIndex(index);
        // @ts-expect-error TS(2339): Property 'expenses' does not exist on type 'never'... Remove this comment to see the full error message
        setDeleteBodyMessage(`Are you sure you want to delete ${rows[index].expenses}?`);
        // @ts-expect-error TS(2531): Object is possibly 'null'.
        confirmationModal.show();
    };
      
    const deleteExpense = async () => {
        let index = selectedExpenseIndex;
        // @ts-expect-error TS(2339): Property 'id' does not exist on type 'never'.
        let response = await expense.delete(rows[index].id);
        if(response.success){
            setRows(rows.filter((_, i) => i !== index));
            // @ts-expect-error TS(2531): Object is possibly 'null'.
            confirmationModal.hide();
        }
    };
    
    const inputToggle = () => {
        setShowInput(!showInput);
    };

    const conditionalLayoutGrid = `${windowWidth > 600? 'w-layout-grid' : ''} uui-table_row new-row`;

    function FrequencyDropdownHeader({
        options,
        selectedOption,
        selectOption
    }: any) {
        const [isOpen, setIsOpen] = useState(false);
    
        const handleToggle = () => {
            setIsOpen(!isOpen);
        };
    
        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className={`dropdown dropdown-border ${isOpen ? 'show' : ''}`} onClick={handleToggle}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button className={`btn frequency-width dropdown-toggle ${selectedOption["class"]}`} type="button">
                    {selectedOption.text}
                </button>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <span className="dropdown-icon">▼</span>
                {isOpen && (
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        {options.map((option: any) => <li key={option.text}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <a className={`dropdown-item ${option["class"]}`} onClick={() => { selectOption(option); setIsOpen(false); }}>{option.text}</a>
                        </li>)}
                    </ul>
                )}
            </div>
        );
    }
    
    function CategoryDropdownHeader({
        categories,
        selectedOption,
        selectOption
    }: any) {
        const [isOpen, setIsOpen] = useState(false);
    
        const handleToggle = () => {
            setIsOpen(!isOpen);
        };
    
        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className={`dropdown dropdown-border ${isOpen ? 'show' : ''}`} onClick={handleToggle}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button className={`btn dropdown-toggle frequency-width ${selectedOption ? 'btn-primary' : ''}`} type="button">
                    {selectedOption?.category_name || 'Select Category'}
                </button>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <span className="dropdown-icon">▼</span>
                {isOpen && (
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <li>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <a className="dropdown-item" onClick={() => { selectOption(null); setIsOpen(false); }}>Select Category</a>
                        </li>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        {categories.map((category: any) => <li key={category.id}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <a className="dropdown-item one-time-expense frequency-width" onClick={() => { selectOption(category); setIsOpen(false); }}>{category.category_name}</a>
                        </li>)}
                    </ul>
                )}
            </div>
        );
    }
    
    function HeaderRow({
        options,
        categories,
        selectOptionHeader,
        selectCategoryOptionHeader
    }: any) {
        const [headerExpense, setHeaderExpense] = useState(sessionStorage.getItem('headerExpense') ||  "");
        const [headerAmount, setHeaderAmount] = useState(sessionStorage.getItem('headerAmount') || 0);
        const [headerDate, setHeaderDate] = useState(sessionStorage.getItem('headerDate') || new Date());
        useEffect(() => {
            sessionStorage.setItem('headerExpense', headerExpense);
            // @ts-expect-error TS(2345): Argument of type 'string | number' is not assignab... Remove this comment to see the full error message
            sessionStorage.setItem('headerAmount', headerAmount);
            // @ts-expect-error TS(2345): Argument of type 'string | Date' is not assignable... Remove this comment to see the full error message
            sessionStorage.setItem('headerDate', headerDate);
        }, [headerExpense, headerAmount, headerDate]); 
        const createExpense = async () => {
            if (headerExpense) {
              let body = {
                expenses: headerExpense,
                amount: headerAmount,
                start_date: headerDate,
                frequency: options.findIndex((x: any) => selectedClassHeader === x["class"]),
                // @ts-expect-error TS(2339): Property 'id' does not exist on type '{ category_n... Remove this comment to see the full error message
                category: selectedOptionCategoryHeader.id
              };
              try {
                let response = await expense.create(body);
                if (response.success) {
                  // @ts-expect-error TS(2322): Type 'any' is not assignable to type 'never'.
                  setRows([...rows, response.expense]);
                  setHeaderExpense("");
                  setHeaderAmount(0);
                  setHeaderDate(new Date());
                  selectOptionHeader('Select Interval');
                  selectCategoryHeader({ category_name: 'Select Category' });
                  sessionStorage.removeItem('headerExpense');
                  sessionStorage.removeItem('headerAmount');
                  sessionStorage.removeItem('headerDate');
                } else {
                  console.error(response.message);
                }
              } catch (exception) {
                console.error(exception);
              }
            } else {
              console.warn("Please enter a category name");
            }
        };

        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className={conditionalLayoutGrid}>

                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_feature input-header">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input type="text" className="expense-input" value={headerExpense} onChange={e => {
                        setHeaderExpense(e.target.value);
                    }} />
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row-content input-header">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="expense-input">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <span className="input-group-addon">$</span>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <input type="number" className="no-border-input" value={headerAmount} onChange={e =>{ 
                                setHeaderAmount(e.target.value);
                            }
                        } />
                    </div>
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row-content input-header">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input type="date" pattern="\d{4}-\d{2}-\d{2}" className="expense-input" value={headerDate} onChange={e => {
                        setHeaderDate(e.target.value);
                    }} />
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row-content input-header">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <FrequencyDropdownHeader options={options} selectedOption={options.find((option: any) => option.text === selectedOptionHeader) || {"text": "Select Interval", "class": ""}} selectOption={selectOptionHeader} />
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row-content input-header">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <CategoryDropdownHeader categories={categories} selectedOption={categories.find((category: any) => category.category_name === selectedOptionCategoryHeader.category_name)} selectOption={selectCategoryOptionHeader} />
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row-content input-header">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <button type="button" className="btn btn-primary add-button" onClick={createExpense}>Add</button>
                </div>
            </div>
        );
    }

    function FrequencyDropdown({
        options,
        row,
        index,
        selectOption
    }: any) {
        const [isOpen, setIsOpen] = useState(false);
    
        const handleToggle = () => {
            setIsOpen(!isOpen);
        };
    
        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className={`dropdown dropdown-border ${isOpen ? 'show' : ''}`} onClick={handleToggle}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button className={`btn frequency-width dropdown-toggle ${isNaN(row.frequency) ? '' : options[row.frequency]["class"]}`} type="button">
                    {isNaN(row.frequency) ? 'Select Frequency' : options[row.frequency].text}
                </button>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <span className="dropdown-icon">▼</span>
                {isOpen && (
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        {options.map((option: any) => <li key={option.text}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <a className={`dropdown-item ${option["class"]}`} onClick={() => { selectOption(option, index); setIsOpen(false); }}>{option.text}</a>
                        </li>)}
                    </ul>
                )}
            </div>
        );
    }
    
    function CategoryDropdown({
        categories,
        row,
        index,
        selectCategoryOption
    }: any) {
        const [isOpen, setIsOpen] = useState(false);
    
        const handleToggle = () => {
            setIsOpen(!isOpen);
        };
    
        const selectedCategory = categories.find((category: any) => category.id === row.category);
    
        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className={`dropdown dropdown-border ${isOpen ? 'show' : ''}`} onClick={handleToggle}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <button className={`btn dropdown-toggle frequency-width ${selectedCategory ? 'btn-primary' : ''}`} type="button">
                    {selectedCategory?.category_name || 'Select Category'}
                </button>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <span className="dropdown-icon">▼</span>
                {isOpen && (
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <li>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <a className="dropdown-item" onClick={() => { selectCategoryOption(null, index); setIsOpen(false); }}>Select Category</a>
                        </li>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        {categories.map((category: any) => <li key={category.id}>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <a className="dropdown-item one-time-expense frequency-width" onClick={() => { selectCategoryOption(category, index); setIsOpen(false); }}>{category.category_name}</a>
                        </li>)}
                    </ul>
                )}
            </div>
        );
    }
    
    function Row({
        row,
        index,
        options,
        categories,
        selectOption,
        selectCategoryOption,
        updateExpense,
        deleteConfirmation
    }: any) {
        const [expenses, setExpenses] = useState(sessionStorage.getItem(`expenses-${index}`) || row.expenses);
        const [amount, setAmount] = useState(sessionStorage.getItem(`amount-${index}`) || row.amount);
        const [startDate, setStartDate] = useState(sessionStorage.getItem(`start_date-${index}`) || row.start_date);

        useEffect(() => {
            sessionStorage.setItem(`expenses-${index}`, expenses);
            sessionStorage.setItem(`amount-${index}`, amount);
            sessionStorage.setItem(`start_date-${index}`, startDate);
        }, [expenses, amount, startDate]); 
        return (
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div className={`w-layout-grid uui-table_row ${index % 2 === 1 ? 'background-color-gray50' : ''}`}>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_feature">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input type="text" className="expense-input" value={expenses} onChange={e => setExpenses(e.target.value)} />
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row-content">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="expense-input">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <span className="input-group-addon">$</span>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <input type="number" className="no-border-input" value={amount} onChange={e => setAmount(e.target.value)} />
                    </div>
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row-content">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <input type="date" pattern="\d{4}-\d{2}-\d{2}" className="expense-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row-content">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <FrequencyDropdown options={options} row={row} index={index} selectOption={selectOption} />
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row-content">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <CategoryDropdown categories={categories} row={row} index={index} selectCategoryOption={selectCategoryOption} />
                </div>
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div className="uui-table_row-content">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div className="action">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <button type="button" className="btn btn-warning" onClick={() => {
                            // @ts-expect-error TS(2339): Property 'expenses' does not exist on type 'never'... Remove this comment to see the full error message
                            rows[index].expenses = expenses;
                            // @ts-expect-error TS(2339): Property 'amount' does not exist on type 'never'.
                            rows[index].amount = amount;
                            // @ts-expect-error TS(2339): Property 'start_date' does not exist on type 'neve... Remove this comment to see the full error message
                            rows[index].start_date = startDate;
                            sessionStorage.removeItem(`expenses-${index}`);
                            sessionStorage.removeItem(`amount-${index}`);
                            sessionStorage.removeItem(`start_date-${index}`);
                            updateExpense(index);
                        }}>Save</button>
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <button type="button" className="btn btn-danger" onClick={() => deleteConfirmation(index)}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
        <div class="uui-page-padding">
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <div class="uui-container-large">
                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                <div class="uui-padding-vertical-xhuge">
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div class="uui-text-align-center">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div className="uui-max-width-large align-center">
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <h2 className="uui-heading-medium">Expenses</h2>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div className="uui-space-xsmall"></div>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div className="uui-text-size-large">Add and manage your repeating <strong>expenses</strong></div>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <a href="#" className="button w-button" onClick={inputToggle}>{showInput ? "-" : "+"}</a>
                        </div>
                        {showInput && (
                                // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                                <HeaderRow
                                    options={options}
                                    categories={categories}
                                    selectOptionHeader={selectOptionHeader}
                                    selectCategoryOptionHeader={selectCategoryHeader}
                                />
                            )}
                    </div>
                    // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                    <div class="uui-table">
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <div class="uui-table_heading-row">
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div class="uui-table_heading-row-text">Expense</div>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div class="uui-table_heading-row-text">Amount</div>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div class="uui-table_heading-row-text">Start Date</div>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div class="uui-table_heading-row-text">Frequency</div>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div class="uui-table_heading-row-text">Category</div>
                            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                            <div class="uui-table_heading-row-text">Action</div>
                        </div>    
                    </div>
                    {rows.map((row, index) => (
                        // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
                        <Row 
                            key={index} 
                            row={row} 
                            index={index} 
                            options={options} 
                            categories={categories} 
                            selectOption={selectOption} 
                            selectCategoryOption={selectCategoryOption} 
                            updateExpense={updateExpense} 
                            deleteConfirmation={deleteConfirmation} 
                        />
                    ))}

                </div>  
            </div>
            // @ts-expect-error TS(17004): Cannot use JSX unless the '--jsx' flag is provided... Remove this comment to see the full error message
            <ConfirmationModal 
                ref={confirmationModalRef}
                // @ts-expect-error TS(2322): Type '{ ref: MutableRefObject<undefined>; headerMe... Remove this comment to see the full error message
                headerMessage="Delete Expense"
                bodyMessage={deleteBodyMessage}
                confirmationAction={deleteExpense}
                actionMessage="Delete"
                actionClass="btn-danger"
            />
        </div>
    );
}

export default Expenses;
