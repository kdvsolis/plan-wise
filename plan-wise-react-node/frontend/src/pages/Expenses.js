import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import expense from '../services/expense-service';
import category from '../services/category-service';
import '../assets/components.css';
import '../assets/budgeting-app.css';
import './Expenses.css';
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
    
  
    const selectOption = (option, index) => {
        const newRows = [...rows];
        newRows[index].frequency = options.findIndex(x => option["class"] === x["class"]);
        setRows(newRows);
    };
      
    const selectOptionHeader = (option) => {
        setSelectedOptionHeader(option.text);
        setSelectedClassHeader(option["class"]);
    };
      
    const selectCategoryOption = (category, index) => {
        const newRows = [...rows];
        newRows[index].category = category ? category.id : null;
        setRows(newRows);
    };
      
    const selectCategoryHeader = (category) => {
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
    
    const updateExpense = async (index) => {
        let response = await expense.update(rows[index].id, rows[index]);
        console.log(response);
    };
    
    const deleteConfirmation = (index) => {
        setSelectedExpenseIndex(index);
        setDeleteBodyMessage(`Are you sure you want to delete ${rows[index].expenses}?`);
        confirmationModal.show();
    };
      
    const deleteExpense = async () => {
        let index = selectedExpenseIndex;
        let response = await expense.delete(rows[index].id);
        if(response.success){
            setRows(rows.filter((_, i) => i !== index));
            confirmationModal.hide();
        }
    };
    
    const inputToggle = () => {
        setShowInput(!showInput);
    };

    const conditionalLayoutGrid = `${windowWidth > 600? 'w-layout-grid' : ''} uui-table_row new-row`;

    function FrequencyDropdownHeader({ options, selectedOption, selectOption }) {
        const [isOpen, setIsOpen] = useState(false);
    
        const handleToggle = () => {
            setIsOpen(!isOpen);
        };
    
        return (
            <div className={`dropdown dropdown-border ${isOpen ? 'show' : ''}`} onClick={handleToggle}>
                <button className={`btn frequency-width dropdown-toggle ${selectedOption["class"]}`} type="button">
                    {selectedOption.text}
                </button>
                <span className="dropdown-icon">▼</span>
                {isOpen && (
                    <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        {options.map((option) => (
                            <li key={option.text}>
                                <a className={`dropdown-item ${option["class"]}`} onClick={() => { selectOption(option); setIsOpen(false); }}>{option.text}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
    
    function CategoryDropdownHeader({ categories, selectedOption, selectOption }) {
        const [isOpen, setIsOpen] = useState(false);
    
        const handleToggle = () => {
            setIsOpen(!isOpen);
        };
    
        return (
            <div className={`dropdown dropdown-border ${isOpen ? 'show' : ''}`} onClick={handleToggle}>
                <button className={`btn dropdown-toggle frequency-width ${selectedOption ? 'btn-primary' : ''}`} type="button">
                    {selectedOption?.category_name || 'Select Category'}
                </button>
                <span className="dropdown-icon">▼</span>
                {isOpen && (
                    <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        <li>
                            <a className="dropdown-item" onClick={() => { selectOption(null); setIsOpen(false); }}>Select Category</a>
                        </li>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <a className="dropdown-item one-time-expense frequency-width" onClick={() => { selectOption(category); setIsOpen(false); }}>{category.category_name}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
    
    function HeaderRow({ options, categories, selectOptionHeader, selectCategoryOptionHeader }) {
        const [headerExpense, setHeaderExpense] = useState(sessionStorage.getItem('headerExpense') ||  "");
        const [headerAmount, setHeaderAmount] = useState(sessionStorage.getItem('headerAmount') || 0);
        const [headerDate, setHeaderDate] = useState(sessionStorage.getItem('headerDate') || new Date());
        useEffect(() => {
            sessionStorage.setItem('headerExpense', headerExpense);
            sessionStorage.setItem('headerAmount', headerAmount);
            sessionStorage.setItem('headerDate', headerDate);
        }, [headerExpense, headerAmount, headerDate]); 
        const createExpense = async () => {
            if (headerExpense) {
              let body = {
                expenses: headerExpense,
                amount: headerAmount,
                start_date: headerDate,
                frequency: options.findIndex(x => selectedClassHeader === x["class"]),
                category: selectedOptionCategoryHeader.id
              };
              try {
                let response = await expense.create(body);
                if (response.success) {
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
            <div className={conditionalLayoutGrid}>

                <div className="uui-table_feature input-header">
                    <input type="text" className="expense-input" value={headerExpense} onChange={e => {
                        setHeaderExpense(e.target.value);
                    }} />
                </div>
                <div className="uui-table_row-content input-header">
                    <div className="expense-input">
                        <span className="input-group-addon">$</span>
                        <input type="number" className="no-border-input" value={headerAmount} onChange={e =>{ 
                                setHeaderAmount(e.target.value);
                            }
                        } />
                    </div>
                </div>
                <div className="uui-table_row-content input-header">
                    <input type="date" pattern="\d{4}-\d{2}-\d{2}" className="expense-input" value={headerDate} onChange={e => {
                        setHeaderDate(e.target.value);
                    }} />
                </div>
                <div className="uui-table_row-content input-header">
                    <FrequencyDropdownHeader options={options} selectedOption={options.find(option => option.text === selectedOptionHeader) || {"text": "Select Interval", "class": ""}} selectOption={selectOptionHeader} />
                </div>
                <div className="uui-table_row-content input-header">
                    <CategoryDropdownHeader categories={categories} selectedOption={categories.find(category => category.category_name === selectedOptionCategoryHeader.category_name)} selectOption={selectCategoryOptionHeader} />
                </div>
                <div className="uui-table_row-content input-header">
                    <button type="button" className="btn btn-primary add-button" onClick={createExpense}>Add</button>
                </div>
            </div>
        );
    }

    function FrequencyDropdown({ options, row, index, selectOption }) {
        const [isOpen, setIsOpen] = useState(false);
    
        const handleToggle = () => {
            setIsOpen(!isOpen);
        };
    
        return (
            <div className={`dropdown dropdown-border ${isOpen ? 'show' : ''}`} onClick={handleToggle}>
                <button className={`btn frequency-width dropdown-toggle ${isNaN(row.frequency) ? '' : options[row.frequency]["class"]}`} type="button">
                    {isNaN(row.frequency) ? 'Select Frequency' : options[row.frequency].text}
                </button>
                <span className="dropdown-icon">▼</span>
                {isOpen && (
                    <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        {options.map((option) => (
                            <li key={option.text}>
                                <a className={`dropdown-item ${option["class"]}`} onClick={() => { selectOption(option, index); setIsOpen(false); }}>{option.text}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
    
    function CategoryDropdown({ categories, row, index, selectCategoryOption }) {
        const [isOpen, setIsOpen] = useState(false);
    
        const handleToggle = () => {
            setIsOpen(!isOpen);
        };
    
        const selectedCategory = categories.find(category => category.id === row.category);
    
        return (
            <div className={`dropdown dropdown-border ${isOpen ? 'show' : ''}`} onClick={handleToggle}>
                <button className={`btn dropdown-toggle frequency-width ${selectedCategory ? 'btn-primary' : ''}`} type="button">
                    {selectedCategory?.category_name || 'Select Category'}
                </button>
                <span className="dropdown-icon">▼</span>
                {isOpen && (
                    <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                        <li>
                            <a className="dropdown-item" onClick={() => { selectCategoryOption(null, index); setIsOpen(false); }}>Select Category</a>
                        </li>
                        {categories.map((category) => (
                            <li key={category.id}>
                                <a className="dropdown-item one-time-expense frequency-width" onClick={() => { selectCategoryOption(category, index); setIsOpen(false); }}>{category.category_name}</a>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        );
    }
    
    function Row({ row, index, options, categories, selectOption, selectCategoryOption, updateExpense, deleteConfirmation }) {
        const [expenses, setExpenses] = useState(sessionStorage.getItem(`expenses-${index}`) || row.expenses);
        const [amount, setAmount] = useState(sessionStorage.getItem(`amount-${index}`) || row.amount);
        const [startDate, setStartDate] = useState(sessionStorage.getItem(`start_date-${index}`) || row.start_date);

        useEffect(() => {
            sessionStorage.setItem(`expenses-${index}`, expenses);
            sessionStorage.setItem(`amount-${index}`, amount);
            sessionStorage.setItem(`start_date-${index}`, startDate);
        }, [expenses, amount, startDate]); 
        return (
            <div className={`w-layout-grid uui-table_row ${index % 2 === 1 ? 'background-color-gray50' : ''}`}>
                <div className="uui-table_feature">
                    <input type="text" className="expense-input" value={expenses} onChange={e => setExpenses(e.target.value)} />
                </div>
                <div className="uui-table_row-content">
                    <div className="expense-input">
                        <span className="input-group-addon">$</span>
                        <input type="number" className="no-border-input" value={amount} onChange={e => setAmount(e.target.value)} />
                    </div>
                </div>
                <div className="uui-table_row-content">
                    <input type="date" pattern="\d{4}-\d{2}-\d{2}" className="expense-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <div className="uui-table_row-content">
                    <FrequencyDropdown options={options} row={row} index={index} selectOption={selectOption} />
                </div>
                <div className="uui-table_row-content">
                    <CategoryDropdown categories={categories} row={row} index={index} selectCategoryOption={selectCategoryOption} />
                </div>
                <div className="uui-table_row-content">
                    <div className="action">
                        <button type="button" className="btn btn-warning" onClick={() => {
                            rows[index].expenses = expenses;
                            rows[index].amount = amount;
                            rows[index].start_date = startDate;
                            sessionStorage.removeItem(`expenses-${index}`);
                            sessionStorage.removeItem(`amount-${index}`);
                            sessionStorage.removeItem(`start_date-${index}`);
                            updateExpense(index);
                        }}>Save</button>
                        <button type="button" className="btn btn-danger" onClick={() => deleteConfirmation(index)}>Delete</button>
                    </div>
                </div>
            </div>
        );
    }
    
    return (
        <div class="uui-page-padding">
            <div class="uui-container-large">
                <div class="uui-padding-vertical-xhuge">
                    <div class="uui-text-align-center">
                        <div className="uui-max-width-large align-center">
                            <h2 className="uui-heading-medium">Expenses</h2>
                            <div className="uui-space-xsmall"></div>
                            <div className="uui-text-size-large">Add and manage your repeating <strong>expenses</strong></div>
                            <a href="#" className="button w-button" onClick={inputToggle}>{showInput ? "-" : "+"}</a>
                        </div>
                        {showInput && (
                                <HeaderRow
                                    options={options}
                                    categories={categories}
                                    selectOptionHeader={selectOptionHeader}
                                    selectCategoryOptionHeader={selectCategoryHeader}
                                />
                            )}
                    </div>
                    <div class="uui-table">
                        <div class="uui-table_heading-row">
                            <div class="uui-table_heading-row-text">Expense</div>
                            <div class="uui-table_heading-row-text">Amount</div>
                            <div class="uui-table_heading-row-text">Start Date</div>
                            <div class="uui-table_heading-row-text">Frequency</div>
                            <div class="uui-table_heading-row-text">Category</div>
                            <div class="uui-table_heading-row-text">Action</div>
                        </div>    
                    </div>
                    {rows.map((row, index) => (
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
            <ConfirmationModal 
                ref={confirmationModalRef}
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
