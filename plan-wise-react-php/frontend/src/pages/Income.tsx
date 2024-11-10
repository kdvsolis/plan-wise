import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import income from '../services/income-service';
import '../assets/components.css';
import '../assets/budgeting-app.css';
import './Expenses.css';
import ConfirmationModal from '../components/ConfirmationModal';

// Define the types for the options
interface Option {
  text: string;
  class: string;
}

// Define the row data structure
interface Row {
  id: number;
  source: string;
  amount: number;
  start_date: string | Date;
  frequency?: number;
}

function Income() {
  const [selectedOptionHeader, setSelectedOptionHeader] = useState<string>('Select Interval');
  const [selectedClassHeader, setSelectedClassHeader] = useState<string>('');
  const [showInput, setShowInput] = useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState<{ show: () => void; hide: () => void }>({ show: () => {}, hide: () => {} });
  const [deleteBodyMessage, setDeleteBodyMessage] = useState<string>('');
  const [selectedIncomeIndex, setSelectedIncomeIndex] = useState<number>(-1);
  
  const options: Option[] = [
    { text: 'Daily', class: 'daily' },
    { text: 'Weekly', class: 'weekly' },
    { text: 'Every Other Week', class: 'every-other-week' },
    { text: 'Monthly', class: 'monthly' },
    { text: 'Quarterly', class: 'quarterly' },
    { text: 'Every 6 Months', class: 'every-6-months' },
    { text: 'Annually', class: 'annually' },
    { text: 'One Time', class: 'one-time-expense' }
  ];
  
  const [rows, setRows] = useState<Row[]>([{ id: 0, source: "", amount: 0, start_date: new Date() }]);
  const [categories, setCategories] = useState<any[]>([]);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
  const confirmationModalRef = useRef<any>();

  useEffect(() => {
    document.title = "Plan Wise - Income";
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

  // Select an option from dropdown (for rows)
  const selectOption = (option: Option, index: number) => {
    const newRows = [...rows];
    newRows[index].frequency = options.findIndex(x => option.class === x.class);
    setRows(newRows);
  };

  // Select an option from dropdown (for header)
  const selectOptionHeader = (option: Option) => {
    setSelectedOptionHeader(option.text);
    setSelectedClassHeader(option.class);
  };

  // Fetch income data
  const fetchIncome = async () => {
    try {
      const response = await income.getAll();
      setRows(response.income || []);
    } catch (exception) {
      console.log(exception);
    }
  };

  // Update income record
  const updateIncome = async (index: number) => {
    let response = await income.update(rows[index].id, rows[index]);
    console.log(response);
  };

  // Trigger delete confirmation
  const deleteConfirmation = (index: number) => {
    setSelectedIncomeIndex(index);
    setDeleteBodyMessage(`Are you sure you want to delete ${rows[index].source}?`);
    confirmationModal.show();
  };

  // Delete income record
  const deleteIncome = async () => {
    const index = selectedIncomeIndex;
    const response = await income.delete(rows[index].id);
    if (response.success) {
      setRows(rows.filter((_, i) => i !== index));
      confirmationModal.hide();
    }
  };

  // Toggle input visibility
  const inputToggle = () => {
    setShowInput(!showInput);
  };

  const conditionalLayoutGrid = `${windowWidth > 600 ? 'w-layout-grid' : ''} uui-table_row new-row`;

  // Frequency dropdown for header
  function FrequencyDropdownHeader({ options, selectedOption, selectOption }: { options: Option[], selectedOption: Option, selectOption: (option: Option) => void }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div className={`dropdown dropdown-border ${isOpen ? 'show' : ''}`} onClick={handleToggle}>
        <button className={`btn frequency-width dropdown-toggle ${selectedOption.class}`} type="button">
          {selectedOption.text}
        </button>
        <span className="dropdown-icon">▼</span>
        {isOpen && (
          <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
            {options.map((option) => (
              <li key={option.text}>
                <a className={`dropdown-item ${option.class}`} onClick={() => { selectOption(option); setIsOpen(false); }}>
                  {option.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Header row for creating income
  function HeaderRow({ options, selectOptionHeader }: { options: Option[], selectOptionHeader: (option: Option) => void }) {
    const [headerSource, setHeaderSource] = useState<string>(sessionStorage.getItem('headerSource') || "");
    const [headerAmount, setHeaderAmount] = useState<number>(sessionStorage.getItem('headerAmount') ? parseFloat(sessionStorage.getItem('headerAmount')!) : 0);
    const [headerDate, setHeaderDate] = useState<string | Date>(sessionStorage.getItem('headerDate') || new Date());

    useEffect(() => {
      sessionStorage.setItem('headerSource', headerSource);
      sessionStorage.setItem('headerAmount', headerAmount.toString());
      sessionStorage.setItem('headerDate', headerDate.toString());
    }, [headerSource, headerAmount, headerDate]);

    const createIncome = async () => {
      if (headerSource) {
        const body = {
          source: headerSource,
          amount: headerAmount,
          start_date: headerDate,
          frequency: options.findIndex((x) => selectedClassHeader === x.class),
        };
        try {
          const response = await income.create(body);
          if (response.success) {
            setRows([...rows, response.income]);
            setHeaderSource("");
            setHeaderAmount(0);
            setHeaderDate(new Date());
            selectOptionHeader({class: 'primary', text: 'Select Interval'});
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
          <input type="text" className="expense-input" value={headerSource} onChange={e => setHeaderSource(e.target.value)} />
        </div>
        <div className="uui-table_row-content input-header">
          <div className="expense-input">
            <span className="input-group-addon">$</span>
            <input type="number" className="no-border-input" value={headerAmount} onChange={e => setHeaderAmount(parseFloat(e.target.value))} />
          </div>
        </div>
        <div className="uui-table_row-content input-header">
          <input type="date" pattern="\d{4}-\d{2}-\d{2}" className="expense-input" value={headerDate.toString()} onChange={e => setHeaderDate(e.target.value)} />
        </div>
        <div className="uui-table_row-content input-header">
          <FrequencyDropdownHeader options={options} selectedOption={options.find((option) => option.text === selectedOptionHeader) || { text: "Select Interval", class: "" }} selectOption={selectOptionHeader} />
        </div>
        <div className="uui-table_row-content input-header">
          <button type="button" className="btn btn-primary add-button" onClick={createIncome}>Add</button>
        </div>
      </div>
    );
  }

  // Frequency dropdown for individual rows
  function FrequencyDropdown({ options, row, index, selectOption }: { options: Option[], row: Row, index: number, selectOption: (option: Option, index: number) => void }) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    const frequencyOption = options.find(option => option.class === row.frequency + "");

    return (
      <div className={`dropdown dropdown-border ${isOpen ? 'show' : ''}`} onClick={handleToggle}>
        <button className={`btn frequency-width dropdown-toggle ${frequencyOption ? frequencyOption.class : ''}`} type="button">
          {frequencyOption ? frequencyOption.text : 'Select Frequency'}
        </button>
        <span className="dropdown-icon">▼</span>
        {isOpen && (
          <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
            {options.map((option) => (
              <li key={option.text}>
                <a className={`dropdown-item ${option.class}`} onClick={() => { selectOption(option, index); setIsOpen(false); }}>
                  {option.text}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // Row for displaying each income entry
  function Row({ row, index, options, selectOption, updateIncome, deleteConfirmation }: { row: Row, index: number, options: Option[], selectOption: (option: Option, index: number) => void, updateIncome: (index: number) => void, deleteConfirmation: (index: number) => void }) {
    const [source, setSource] = useState<string>(sessionStorage.getItem(`source-${index}`) || row.source);
    const [amount, setAmount] = useState<number>(sessionStorage.getItem(`amount-${index}`) ? parseFloat(sessionStorage.getItem(`amount-${index}`)!) : row.amount);
    const [startDate, setStartDate] = useState<string | Date>(sessionStorage.getItem(`start_date-${index}`) || row.start_date);

    useEffect(() => {
      sessionStorage.setItem(`source-${index}`, source);
      sessionStorage.setItem(`amount-${index}`, amount.toString());
      sessionStorage.setItem(`start_date-${index}`, startDate.toString());
    }, [source, amount, startDate]);

    return (
      <div className={`w-layout-grid uui-table_row ${index % 2 === 1 ? 'background-color-gray50' : ''}`}>
        <div className="uui-table_feature">
          <input type="text" className="expense-input" value={source} onChange={e => setSource(e.target.value)} />
        </div>
        <div className="uui-table_row-content">
          <div className="expense-input">
            <span className="input-group-addon">$</span>
            <input type="number" className="no-border-input" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} />
          </div>
        </div>
        <div className="uui-table_row-content">
          <input type="date" pattern="\d{4}-\d{2}-\d{2}" className="expense-input" value={startDate.toString()} onChange={e => setStartDate(e.target.value)} />
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
    <div className="uui-page-padding">
      <div className="uui-container-large">
        <div className="uui-padding-vertical-xhuge">
          <div className="uui-text-align-center">
            <div className="uui-max-width-large align-center">
              <h2 className="uui-heading-medium">Income</h2>
              <div className="uui-space-xsmall"></div>
              <div className="uui-text-size-large">Add and manage your repeating <strong>Income</strong></div>
              <a href="#" className="button w-button" onClick={inputToggle}>{showInput ? "-" : "+"}</a>
            </div>
            {showInput && (
              <HeaderRow
                options={options}
                selectOptionHeader={selectOptionHeader}
              />
            )}
          </div>
          <div className="uui-table">
            <div className="uui-table_heading-row">
              <div className="uui-table_heading-row-text">Income Source</div>
              <div className="uui-table_heading-row-text">Amount</div>
              <div className="uui-table_heading-row-text">Start Date</div>
              <div className="uui-table_heading-row-text">Frequency</div>
              <div className="uui-table_heading-row-text">Action</div>
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
              headerMessage="Delete Income"
              bodyMessage={deleteBodyMessage}
              confirmationAction={deleteIncome}
              actionMessage="Delete"
              actionClass="btn-danger" handleConfirm={undefined}      />
    </div>
  );
}

export default Income;
