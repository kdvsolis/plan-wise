import { Component, Input, OnInit, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { BudgetTableService } from '../../../services/budget-table.service';

@Component({
  selector: 'app-modify-instance-modal',
  templateUrl: './modify-instance-modal.component.html',
  styleUrls: ['./modify-instance-modal.component.css', '../../../assets/components.css', '../../../assets/budgeting-app.css']
})
export class ModifyInstanceModalComponent implements OnInit {

  @Input() selectedInstance: any;
  @Input() onModalClosed: any;
  @Input() selectedDate!: string;
  @ViewChild('modifyInstanceModal') modifyInstanceModal!: ElementRef;

  expenseInstanceIndex = 0;
  incomeInstanceIndex = 0;
  localSelectedInstance: any = { income: [], expense: [] };
  localSelectedDate = '';
  modalInstance: any;
  activeTab = 'expense';

  constructor(private budgetTableService: BudgetTableService) { }

  ngOnInit() {
    this.onShow();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedInstance'] || changes['selectedDate']) {
      this.onShow();
    }
  }

  onShow() {
    this.expenseInstanceIndex = 0;
    this.incomeInstanceIndex = 0;
    this.localSelectedDate = this.selectedDate;
    this.localSelectedInstance = this.selectedInstance;
    console.log(this.selectedInstance.expense);
  }

  open() {
    this.modalInstance = new bootstrap.Modal(this.modifyInstanceModal.nativeElement);
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
  }

  handleExpenseChange(e: any) {
    let newExpense: any = [...this.localSelectedInstance.expense];
    newExpense[this.expenseInstanceIndex].expenses = e.target.value;
    this.localSelectedInstance = { ...this.localSelectedInstance, expense: newExpense };
  }

  handleAmountChange(e: any) {
    let newExpense: any = [...this.localSelectedInstance.expense];
    newExpense[this.expenseInstanceIndex].amount = e.target.value;
    this.localSelectedInstance = { ...this.localSelectedInstance, expense: newExpense };
  }

  handleSourceChange(e: any) {
    let newIncome: any = [...this.localSelectedInstance.income];
    newIncome[this.incomeInstanceIndex].source = e.target.value;
    this.localSelectedInstance = { ...this.localSelectedInstance, income: newIncome };
  }

  handleIncomeAmountChange(e: any) {
    let newIncome: any = [...this.localSelectedInstance.income];
    newIncome[this.incomeInstanceIndex].amount = e.target.value;
    this.localSelectedInstance = { ...this.localSelectedInstance, income: newIncome };
  }

  handleDateChange(e: any) {
    this.localSelectedDate = e.target.value;
  }

  incrementExpenseInstanceIndex() {
    if (this.expenseInstanceIndex === this.localSelectedInstance.expense.length - 1) {
      return;
    }
    this.expenseInstanceIndex += 1;
  }

  decrementExpenseInstanceIndex() {
    if (this.expenseInstanceIndex === 0) {
      return;
    }
    this.expenseInstanceIndex -= 1;
  }

  incrementIncomeInstanceIndex() {
    if (this.incomeInstanceIndex === this.localSelectedInstance.income.length - 1) {
      return;
    }
    this.incomeInstanceIndex += 1;
  }

  decrementIncomeInstanceIndex() {
    if (this.incomeInstanceIndex === 0) {
      return;
    }
    this.incomeInstanceIndex -= 1;
  }

  async modifyInstance () {
      try {
          let body = {
              date: this.localSelectedDate,
              income: this.localSelectedInstance.income,
              expense: this.localSelectedInstance.expense
          };
          let response: any = await this.budgetTableService.updateBudgets(body);
          if (response.success) {
              this.onModalClosed();
          } else {
              console.error(response.message);
          }
      } catch (exception) {
          console.error(exception);
      }
  };
  
  switchTab(tab: string) {
    this.activeTab = tab;
  }
}
