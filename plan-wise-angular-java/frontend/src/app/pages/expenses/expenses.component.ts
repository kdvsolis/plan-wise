import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Modal } from 'bootstrap';
import { ExpenseService } from '../../../services/expense.service';
import { CategoryService } from '../../../services/category.service';
import * as moment from 'moment';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-expense',
  providers: [DatePipe],
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.css', '../../../assets/components.css', '../../../assets/budgeting-app.css']
})
export class ExpensesComponent implements OnInit, AfterViewInit {
  @ViewChild(ConfirmationModalComponent) confirmationModal!: ConfirmationModalComponent;
  selectedOptionCategoryHeader = { category_name: 'Select Category', id: -1 };
  selectedClassCategoryHeader = '';
  selectedOptionHeader = 'Select Interval';
  selectedClassHeader = '';
  selectedOption = 'Select Interval';
  selectedClass = '';
  headerExpense = '';
  headerAmount = 0;
  headerDate = new Date();
  selectedDate = new Date();
  showInput = false;
  deleteBodyMessage = '';
  selectedExpenseIndex = -1;
  options = [
    { text: 'Daily', class: 'daily' },
    { text: 'Weekly', class: 'weekly' },
    { text: 'Every Other Week', class: 'every-other-week' },
    { text: 'Monthly', class: 'monthly' },
    { text: 'Quarterly', class: 'quarterly' },
    { text: 'Every 6 Months', class: 'every-6-months' },
    { text: 'Annually', class: 'annually' },
    { text: 'One Time', class: 'one-time-expense' }
  ];
  rows: any = [];
  categories: any = [];

  constructor(private elRef: ElementRef, private expenseService: ExpenseService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.fetchCategories().then(() => {
      this.fetchExpenses();
    });
    document.title = "Plan Wise - Expenses";
  }

  ngAfterViewInit() {
    const dropdownElements = this.elRef.nativeElement.querySelectorAll('[data-bs-toggle="dropdown"]');
    for (let i = 0; i < dropdownElements.length; i++) {
      new Modal(dropdownElements[i]);
    }
  }

  selectOption(option: any, index: number) {
    this.rows[index].frequency = this.options.findIndex(x => option.class === x.class);
  }

  selectOptionHeader(option: any) {
    this.selectedOptionHeader = option.text;
    this.selectedClassHeader = option.class;
  }

  selectCategoryOption(category: any, index: number) {
    if (!category) {
      this.rows[index].category = null;
      return;
    }
    this.rows[index].category = category.id;
  }

  selectCategoryHeader(category: any) {
    this.selectedOptionCategoryHeader = category;
    this.selectedClassCategoryHeader = category ? 'btn-primary' : '';
  }

  formattedDate() {
    return moment(this.selectedDate).format('MM-DD-YYYY');
  }

  async createExpense() {
    if (this.headerExpense) {
      let body = {
        expenses: this.headerExpense,
        amount: this.headerAmount,
        start_date: this.headerDate,
        frequency: this.options.findIndex(x => this.selectedClassHeader === x.class),
        category: this.selectedOptionCategoryHeader.id
      };
      try {
        let response: any = await this.expenseService.create(body);
        if (response.success) {
          this.rows.push(response.expense);
          this.headerExpense = "";
          this.headerAmount = 0;
          this.headerDate = new Date();
          this.selectOptionHeader('Select Interval');
          this.selectCategoryHeader({ categoryName: 'Select Category' });
        } else {
          console.error(response.message);
        }
      } catch (exception) {
        console.error(exception);
      }
    } else {
      console.warn("Please enter a category name");
    }
  }

  async fetchCategories() {
    try {
      let response: any = await this.categoryService.getAll();
      this.categories = response.categories || [];
    } catch (exception) {
      console.log(exception);
    }
  }

  async fetchExpenses() {
    try {
      let response: any = await this.expenseService.getAll();
      this.rows = response.expenses || [];
    } catch (exception) {
      console.log(exception);
    }
  }

  async updateExpense(index: number) {
    let data = Object.assign({}, this.rows[index]);
    delete data.user;
    data.category = data.category.id;
    let response: any = await this.expenseService.update(this.rows[index].id, data);
    console.log(response);
  }

  deleteConfirmation(index: number) {
    this.selectedExpenseIndex = index;
    this.deleteBodyMessage = `Are you sure you want to delete ${this.rows[index].expenses}?`;
    this.confirmationModal.changeModalMessage(`Delete ${this.rows[index].expenses}`, this.deleteBodyMessage, "Confirm", this.deleteExpense, index);
    this.confirmationModal.open();
  }

  deleteExpense = async () => {
    let index = this.selectedExpenseIndex;
    let response: any = await this.expenseService.delete(this.rows[index].id);
    if (response.success) {
      this.rows.splice(index, 1);
      this.confirmationModal.close();
    }
  }

  async inputToggle() {
    this.showInput = !this.showInput;
  }

  getButtonClass(index: number) {
    return this.categories.find((category: any) => category.id === this.rows[index].category.id) ? 'btn-primary' : '';
  }

  getCategoryName(index: number) {
    return this.categories.find((category: any) => category.id === this.rows[index].category.id)?.category_name || 'Select Category';
  }

  isNan(value: any) {
    return isNaN(value);
  }

  get conditionalLayoutGrid() {
    return {
      'w-layout-grid': window.innerWidth > 600,
      'uui-table_row': true,
      'new-row': true
    };
  }
}

