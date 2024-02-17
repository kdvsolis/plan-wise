import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { CategoryService } from '../../../services/category.service';
import { ExpenseService } from '../../../services/expense.service';

@Component({
  selector: 'app-expense-modal',
  templateUrl: './expense-modal.component.html',
  styleUrls: ['./expense-modal.component.css', '../../../assets/components.css', '../../../assets/budgeting-app.css']
})
export class ExpenseModalComponent implements OnInit {
  @Input() headerExpense: string = '';
  @Input() headerAmount: number = -1;
  @Input() headerDate: any;
  @Input() selectedDate: string = '';
  @Input() selectedClassHeader: string = '';
  @Input() selectedOptionHeader: string = '';
  @Input() selectedClassCategoryHeader: string = '';
  @Input() selectedOptionCategoryHeader: string = '';
  @Input() onModalClosed: any;
  @ViewChild('expenseModal') expenseModal!: ElementRef;
  localHeaderExpense: string = '';
  localHeaderAmount: number = -1;
  localSelectedDate: string = '';
  localSelectedClassHeader: string = '';
  localSelectedOptionHeader: string = '';
  localSelectedClassCategoryHeader: string = '';
  localSelectedOptionCategoryHeader: any = '';
  options = [
    { text: 'Daily', class: 'daily' },
    { text: 'Weekly', class: 'weekly' },
    { text: 'Every Other Week', class: 'every-other-week' },
    { text: 'Monthly', class: 'monthly' },
    { text: 'Quarterly', class: 'quarterly' },
    { text: 'Every 6 Months', class: 'every-6-months' },
    { text: 'Annually', class: 'annually' },
    { text: 'One Time', class: 'one-time-expense' }];
  categories: any = [];
  modalInstance: any;

  constructor(private categoryService: CategoryService, private expenseService: ExpenseService) { }

  ngOnInit(): void {
    this.categoryService.getAll().then((response: any) => {
      this.categories = response.category || [];
    });
    this.onShow();
  }

  onShow(): void {
    this.localHeaderExpense = this.headerExpense;
    this.localHeaderAmount = this.headerAmount;
    this.localSelectedDate = new Date(this.selectedDate).toISOString().substring(0, 10);
    this.localSelectedClassHeader = this.selectedClassHeader;
    this.localSelectedOptionHeader = this.selectedOptionHeader;
    this.localSelectedClassCategoryHeader = this.selectedClassCategoryHeader;
    this.localSelectedOptionCategoryHeader = this.selectedOptionCategoryHeader;
  }

  selectOptionHeader(option: any): void {
    this.localSelectedOptionHeader = option.text;
    this.localSelectedClassHeader = option.class;
  }

  selectCategoryHeader(category: any): void {
    this.localSelectedOptionCategoryHeader = category;
    this.localSelectedClassCategoryHeader = category.category_name === 'Select Category' ? '' : 'btn-primary';
  }

  async createExpense(): Promise<void> {
    try {
      let body = {
        expenses: this.localHeaderExpense,
        amount: this.localHeaderAmount,
        start_date: this.localSelectedDate,
        frequency: this.options.findIndex(x => this.localSelectedClassHeader === x.class),
        category: this.localSelectedOptionCategoryHeader.id
      };
      console.log(body);
      let response: any = await this.expenseService.create(body);
      if (response.success) {
        this.onModalClosed();
      } else {
        console.error(response.message);
      }
    } catch (exception) {
      console.error(exception);
    }
  }

  open() {
    this.modalInstance = new bootstrap.Modal(this.expenseModal.nativeElement);
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
  }
}
