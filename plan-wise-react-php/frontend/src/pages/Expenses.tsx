import React, { useState, useEffect, useRef } from 'react';
import { Modal } from 'bootstrap';
import expense from '../services/expense-service';
import category from '../services/category-service';
import '../assets/components.css';
import '../assets/budgeting-app.css';
import './Expenses.css';
import ConfirmationModal from '../components/ConfirmationModal';

interface Category {
    id: number;
    category_name: string;
}

interface Expense {
    id: number;
    expenses: string;
    amount: number;
    start_date: string;
    frequency: number;
    category: number | null;
}

function Expenses() {
    const [selectedOptionCategoryHeader, setSelectedOptionCategoryHeader] = useState<Category>({ category_name: 'Select Category', id: 0 });
    const [selectedClassCategoryHeader, setSelectedClassCategoryHeader] = useState<string>('');
    const [selectedOptionHeader, setSelectedOptionHeader] = useState<string>('Select Interval');
    const [selectedClassHeader, setSelectedClassHeader] = useState<string>('');
    const [showInput, setShowInput] = useState<boolean>(false);
    const [confirmationModal, setConfirmationModal] = useState<Modal | null>(null);
    const [deleteBodyMessage, setDeleteBodyMessage] = useState<string>('');
    const [selectedExpenseIndex, setSelectedExpenseIndex] = useState<number>(-1);
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
    const [rows, setRows] = useState<Expense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);
    const confirmationModalRef = useRef<HTMLDivElement | null>(null);

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

    const selectOption = (option: { text: string, class: string }, index: number) => {
        const newRows = [...rows];
        newRows[index].frequency = options.findIndex(x => option["class"] === x["class"]);
        setRows(newRows);
    };

    const selectOptionHeader = (option: { text: string, class: string }) => {
        setSelectedOptionHeader(option.text);
        setSelectedClassHeader(option["class"]);
    };

    const selectCategoryOption = (category: Category | null, index: number) => {
        const newRows = [...rows];
        newRows[index].category = category ? category.id : null;
        setRows(newRows);
    };

    const selectCategoryHeader = (category: Category | null) => {
        setSelectedOptionCategoryHeader(category || { category_name: 'Select Category', id: 0 });
        setSelectedClassCategoryHeader(category ? 'btn-primary' : '');
    };

    const fetchCategories = async () => {
        try {
            let response = await category.getAll();
            setCategories(response.category || []);
        } catch (exception) {
            console.log(exception);
        }
    };

    const fetchExpenses = async () => {
        try {
            let response = await expense.getAll();
            setRows(response.expense || []);
        } catch (exception) {
            console.log(exception);
        }
    };

    const updateExpense = async (index: number) => {
        let response = await expense.update(rows[index].id, rows[index]);
        console.log(response);
    };

    const deleteConfirmation = (index: number) => {
        setSelectedExpenseIndex(index);
        setDeleteBodyMessage(`Are you sure you want to delete ${rows[index].expenses}?`);
        confirmationModal?.show();
    };

    const deleteExpense = async () => {
        let index = selectedExpenseIndex;
        let response = await expense.delete(rows[index].id);
        if (response.success) {
            setRows(rows.filter((_, i) => i !== index));
            confirmationModal?.hide();
        }
    };

    const inputToggle = () => {
        setShowInput(!showInput);
    };

    const conditionalLayoutGrid = `${windowWidth > 600 ? 'w-layout-grid' : ''} uui-table_row new-row`;

    function FrequencyDropdownHeader({ options, selectedOption, selectOption }: { options: { text: string, class: string }[], selectedOption: { text: string, class: string }, selectOption: (option: { text: string, class: string }) => void }) {
        const [isOpen, setIsOpen] = useState<boolean>(false);

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

    function CategoryDropdownHeader({ categories, selectedOption, selectOption }: { categories: Category[], selectedOption: Category | null, selectOption: (category: Category | null) => void }) {
        const [isOpen, setIsOpen] = useState<boolean>(false);

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

    function Row({ row, index, options, categories, selectOption, selectCategoryOption, updateExpense, deleteConfirmation }: { row: Expense, index: number, options: { text: string, class: string }[], categories: Category[], selectOption: (option: { text: string, class: string }, index: number) => void, selectCategoryOption: (category: Category | null, index: number) => void, updateExpense: (index: number) => void, deleteConfirmation: (index: number) => void }) {
        const [expenses, setExpenses] = useState<string>(sessionStorage.getItem(`expenses-${index}`) || row.expenses);
        const [amount, setAmount] = useState<number>(parseFloat(sessionStorage.getItem(`amount-${index}`) || row.amount.toString()));
        const [startDate, setStartDate] = useState<string>(sessionStorage.getItem(`start_date-${index}`) || row.start_date);

        useEffect(() => {
            sessionStorage.setItem(`expenses-${index}`, expenses);
            sessionStorage.setItem(`amount-${index}`, amount.toString());
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
                        <input type="number" className="no-border-input" value={amount} onChange={e => setAmount(parseFloat(e.target.value))} />
                    </div>
                </div>
                <div className="uui-table_row-content">
                    <input type="date" className="no-border-input" value={startDate} onChange={e => setStartDate(e.target.value)} />
                </div>
                <CategoryDropdownHeader categories={categories} selectedOption={row.category ? categories.find(c => c.id === row.category) || null : null} selectOption={(category) => selectCategoryOption(category, index)} />
                <FrequencyDropdownHeader options={options} selectedOption={options[row.frequency]} selectOption={(option) => selectOption(option, index)} />
                <div className="delete-btn" onClick={() => deleteConfirmation(index)}>Delete</div>
            </div>
        );
    }

    return (
        <>
            <div className={`expenses-container`}>
                <div className="flex-container">
                    <input className="add-expense" type="button" onClick={inputToggle} value="Add Expense" />
                </div>
                <div className={`main-table ${!showInput && 'hidden'}`}>
                    <div className="table-header">
                        <div className="input-container">Expense</div>
                        <div className="input-container">Amount</div>
                        <div className="input-container">Start Date</div>
                        <div className="input-container">Category</div>
                        <div className="input-container">Interval</div>
                    </div>
                    <div className="table-content">
                        {rows.map((row, index) => (
                            <Row key={index} row={row} index={index} options={options} categories={categories} selectOption={selectOption} selectCategoryOption={selectCategoryOption} updateExpense={updateExpense} deleteConfirmation={deleteConfirmation} />
                        ))}
                    </div>
                </div>
            </div>

            <ConfirmationModal ref={confirmationModalRef} bodyMessage={deleteBodyMessage} handleConfirm={deleteExpense} headerMessage={''} confirmationAction={function (): void {
                throw new Error('Function not implemented.');
            } } actionMessage={''} actionClass={''} />
        </>
    );
}

export default Expenses;
