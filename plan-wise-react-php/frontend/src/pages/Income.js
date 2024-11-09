import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import income from '../services/income-service';
import '../assets/components.css';
import '../assets/budgeting-app.css';
import './Expenses.css';
import ConfirmationModal from '../components/ConfirmationModal';


function Income() {
    const [selectedOptionHeader, setSelectedOptionHeader] = useState('Select Interval');
    const [selectedClassHeader, setSelectedClassHeader] = useState('');
    const [showInput, setShowInput] = useState(false);
    const [confirmationModal, setConfirmationModal] = useState(null);
    const [deleteBodyMessage, setDeleteBodyMessage] = useState('');
    const [selectedIncomeIndex, setSelectedIncomeIndex] = useState(-1);
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
        fetchIncome();
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

    const fetchIncome = async () => {
        try {
            let response = await income.getAll();
            setRows(response.income || []);
        } catch(exception){
            console.log(exception);
        }
    };
    
    const updateIncome = async (index) => {
        let response = await income.update(rows[index].id, rows[index]);
        console.log(response);
    };
    
    const deleteConfirmation = (index) => {
        setSelectedIncomeIndex(index);
        setDeleteBodyMessage(`Are you sure you want to delete ${rows[index].source}?`);
        confirmationModal.show();
    };
      
    const deleteIncome = async () => {
        let index = selectedIncomeIndex;
        let response = await income.delete(rows[index].id);
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
    
    function HeaderRow({ options, selectOptionHeader }) {
        const [headerSource, setheaderSource] = useState(sessionStorage.getItem('headerSource') ||  "");
        const [headerAmount, setHeaderAmount] = useState(sessionStorage.getItem('headerAmount') || 0);
        const [headerDate, setHeaderDate] = useState(sessionStorage.getItem('headerDate') || new Date());
        useEffect(() => {
            sessionStorage.setItem('headerSource', headerSource);
            sessionStorage.setItem('headerAmount', headerAmount);
            sessionStorage.setItem('headerDate', headerDate);
        }, [headerSource, headerAmount, headerDate]); 
        const createIncome = async () => {
            if (headerSource) {
              let body = {
                source: headerSource,
                amount: headerAmount,
                start_date: headerDate,
                frequency: options.findIndex(x => selectedClassHeader === x["class"])
              };
              try {
                let response = await income.create(body);
                if (response.success) {
                  setRows([...rows, response.income]);
                  setheaderSource("");
                  setHeaderAmount(0);
                  setHeaderDate(new Date());
                  selectOptionHeader('Select Interval');
                  sessionStorage.removeItem('headerSource');
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
                    <input type="text" className="expense-input" value={headerSource} onChange={e => {
                        setheaderSource(e.target.value);
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
                    <button type="button" className="btn btn-primary add-button" onClick={createIncome}>Add</button>
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
    
    function Row({ row, index, options, selectOption, updateIncome, deleteConfirmation }) {
        const [source, setSource] = useState(sessionStorage.getItem(`source-${index}`) || row.source);
        const [amount, setAmount] = useState(sessionStorage.getItem(`amount-${index}`) || row.amount);
        const [startDate, setStartDate] = useState(sessionStorage.getItem(`start_date-${index}`) || row.start_date);

        useEffect(() => {
            sessionStorage.setItem(`source-${index}`, source);
            sessionStorage.setItem(`amount-${index}`, amount);
            sessionStorage.setItem(`start_date-${index}`, startDate);
        }, [source, amount, startDate]); 
        return (
            <div className={`w-layout-grid uui-table_row ${index % 2 === 1 ? 'background-color-gray50' : ''}`}>
                <div className="uui-table_feature">
                    <input type="text" className="expense-input" value={source} onChange={e => setSource(e.target.value)} />
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
                    <div className="action">
                        <button type="button" className="btn btn-warning" onClick={() => {
                            rows[index].source = source;
                            rows[index].amount = amount;
                            rows[index].start_date = startDate;
                            sessionStorage.removeItem(`source-${index}`);
                            sessionStorage.removeItem(`amount-${index}`);
                            sessionStorage.removeItem(`start_date-${index}`);
                            updateIncome(index);
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
                            <h2 className="uui-heading-medium">Income</h2>
                            <div className="uui-space-xsmall"></div>
                                <div class="uui-text-size-large">Add and manage your repeating <strong>Income</strong></div>
                            <a href="#" className="button w-button" onClick={inputToggle}>{showInput ? "-" : "+"}</a>
                        </div>
                        {showInput && (
                                <HeaderRow
                                    options={options}
                                    selectOptionHeader={selectOptionHeader}
                                />
                            )}
                    </div>
                    <div class="uui-table">
                        <div class="uui-table_heading-row">
                            <div class="uui-table_heading-row-text">Income Source</div>
                            <div class="uui-table_heading-row-text">Amount</div>
                            <div class="uui-table_heading-row-text">Start Date</div>
                            <div class="uui-table_heading-row-text">Frequency</div>
                            <div class="uui-table_heading-row-text">Action</div>
                        </div>    
                    </div>
                    {rows.map((row, index) => (
                        <Row 
                            key={index} 
                            row={row} 
                            index={index} 
                            options={options} 
                            selectOption={selectOption} 
                            updateIncome={updateIncome} 
                            deleteConfirmation={deleteConfirmation} 
                        />
                    ))}

                </div>  
            </div>
            <ConfirmationModal 
                ref={confirmationModalRef}
                headerMessage="Delete Expense"
                bodyMessage={deleteBodyMessage}
                confirmationAction={deleteIncome}
                actionMessage="Delete"
                actionClass="btn-danger"
            />
        </div>
    );
}

export default Income;
