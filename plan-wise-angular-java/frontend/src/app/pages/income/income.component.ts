import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Modal } from 'bootstrap';
import { IncomeService } from '../../../services/income.service';
import { CategoryService } from '../../../services/category.service';
import * as moment from 'moment';
import { ConfirmationModalComponent } from '../../components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.css', '../../../assets/components.css', '../../../assets/budgeting-app.css']
})
export class IncomeComponent {

  @ViewChild(ConfirmationModalComponent) confirmationModal!: ConfirmationModalComponent;
  selectedOptionHeader = 'Select Interval';
  selectedClassHeader = '';
  selectedOption = 'Select Interval';
  selectedClass = '';
  headerSource = '';
  headerAmount = 0;
  headerDate = new Date();
  selectedDate = new Date();
  showInput = false;
  deleteBodyMessage = '';
  selectedIncomeIndex = -1;
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

  constructor(private elRef: ElementRef, private incomeService: IncomeService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.fetchIncome();
    document.title = "Plan Wise - Income";
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

  formattedDate() {
    return moment(this.selectedDate).format('MM-DD-YYYY');
  }

  async createIncome() {
    if (this.headerSource) {
      let body = {
        source: this.headerSource,
        amount: this.headerAmount,
        start_date: this.headerDate,
        frequency: this.options.findIndex(x => this.selectedClassHeader === x.class)
      };
      try {
        let response: any = await this.incomeService.create(body);
        if (response.success) {
          this.rows.push(response.expense);
          this.headerSource = "";
          this.headerAmount = 0;
          this.headerDate = new Date();
          this.selectOptionHeader('Select Interval');
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

  async fetchIncome() {
    try {
      let response: any = await this.incomeService.getAll();
      this.rows = response.income || [];
    } catch (exception) {
      console.log(exception);
    }
  }

  async updateIncome(index: number) {
    let data = Object.assign({}, this.rows[index]);
    delete data.user;
    data.category = data.category.id;
    let response: any = await this.incomeService.update(this.rows[index].id, data);
    console.log(response);
  }

  deleteConfirmation(index: number) {
    this.selectedIncomeIndex = index;
    this.deleteBodyMessage = `Are you sure you want to delete ${this.rows[index].source}?`;
    this.confirmationModal.changeModalMessage(`Delete ${this.rows[index].source}`, this.deleteBodyMessage, "Confirm", this.deleteIncome, index);
    this.confirmationModal.open();
  }

  deleteIncome = async () => {
    let index = this.selectedIncomeIndex;
    let response: any = await this.incomeService.delete(this.rows[index].id);
    if (response.success) {
      this.rows.splice(index, 1);
      this.confirmationModal.close();
    }
  }

  async inputToggle() {
    this.showInput = !this.showInput;
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
