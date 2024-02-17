import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { CategoryService } from '../../../services/category.service';
import { IncomeService } from '../../../services/income.service';

@Component({
  selector: 'app-income-modal',
  templateUrl: './income-modal.component.html',
  styleUrls: ['./income-modal.component.css', '../../../assets/components.css', '../../../assets/budgeting-app.css']
})
export class IncomeModalComponent implements OnInit {
  @Input() headerSource: string = '';
  @Input() headerAmount: number = -1;
  @Input() selectedDate: string = '';
  @Input() selectedClassHeader: string = '';
  @Input() selectedOptionHeader: string = '';
  @Input() headerDate: any;
  @Input() onModalClosed: any;
  @ViewChild('incomeModal') incomeModal!: ElementRef;
  localHeaderSource: string = '';
  localHeaderAmount: number = -1;
  localSelectedDate: string = '';
  localSelectedClassHeader: string = '';
  localSelectedOptionHeader: string = '';
  options: any[] = [
    { text: 'Daily', class: 'daily' },
    { text: 'Weekly', class: 'weekly' },
    { text: 'Every Other Week', class: 'every-other-week' },
    { text: 'Monthly', class: 'monthly' },
    { text: 'Quarterly', class: 'quarterly' },
    { text: 'Every 6 Months', class: 'every-6-months' },
    { text: 'Annually', class: 'annually' },
    { text: 'One Time', class: 'one-time-expense' }
  ];
  categories: any[] = [];
  modalInstance: any;

  constructor(private categoryService: CategoryService, private incomeService: IncomeService) { }

  ngOnInit(): void {
    this.categoryService.getAll().then((response: any)=> {
      this.categories = response.category || [];
    });
    this.onShow();
  }

  onShow(): void {
    this.localHeaderSource = this.headerSource;
    this.localHeaderAmount = this.headerAmount;
    this.localSelectedDate = new Date(this.selectedDate).toISOString().substring(0, 10);
    this.localSelectedClassHeader = this.selectedClassHeader;
    this.localSelectedOptionHeader = this.selectedOptionHeader;
  }

  selectOptionHeader(option: any): void {
    this.localSelectedOptionHeader = option.text;
    this.localSelectedClassHeader = option.class;
  }

  async createIncome(): Promise<void> {
    try {
      let body = {
        source: this.localHeaderSource,
        amount: this.localHeaderAmount,
        start_date: this.localSelectedDate,
        frequency: this.options.findIndex(x => this.localSelectedClassHeader === x.class)
      };
      console.log(body);
      let response: any = await this.incomeService.create(body);
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
    this.modalInstance = new bootstrap.Modal(this.incomeModal.nativeElement);
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
  }
}
