<template>

  <section class="uui-section_table">
    <div class="uui-page-padding">
      <div class="uui-container-large">
        <div class="uui-padding-vertical-xhuge">
          <div class="uui-text-align-center">
            <div class="uui-max-width-large align-center">
              <h2 class="uui-heading-medium">Budget Table</h2>
              <div class="uui-space-xsmall"></div>
              <div class="uui-text-size-large">See where you&#x27;ll be if you stick to your budget<strong></strong></div>
            </div>
          </div>
          <div class="uui-table">
            <div class="">
              <div :class="conditionalLayoutGrid">
                <div class="uui-table_row-content input-header">
                  <span>Initial Balance:</span>
                </div>
                <div class="uui-table_row-content input-header">
                  <input type="number" class="expense-input" v-model="initialBalance">
                </div>
                <div class="uui-table_row-content input-header">
                  <button type="button" class="btn btn-primary" @click="changeInitialBalance">Change</button>
                </div>
              </div>
              <div class="uui-table_heading-row">
                <div class="uui-table_heading-row-text">Date</div>
                <div class="uui-table_heading-row-text">Balance</div>
                <div class="uui-table_heading-row-text">Income</div>
                <div class="uui-table_heading-row-text">Expense</div>
                <div class="uui-table_heading-row-text">Amount</div>
                <div class="uui-table_heading-row-text">Action</div>
              </div>
              <div class="div-block">
                <ul class="pagination">
                  <li class="page-item">
                    <a class="text-block-3 page-link-budget" href="#" @click="decrementMonth">&lt;&lt;</a>
                  </li>
                  <li>
                    <div class="text-block-3 px-2">{{ months[currMonth] }} {{currYear < 0? '' : currYear}}</div>
                  </li>
                  <li class="page-item">
                    <a class="text-block-3 page-link-budget" href="#" @click="incrementMonth">&gt;&gt;</a>
                  </li>
                </ul>
              </div>
            </div>
            <div v-if="isLargeScreen">
              <div v-for="dayData in calendar" :key="dayData.index" class="w-layout-grid uui-table_row background-color-gray50">
                  <div class="w-layout-grid uui-table-row-day-of-month">
                    <div class="div-block-2">
                        <div class="uui-pricing07_row-lead-text date-column">{{ dayData.date }}</div>
                    </div>
                  </div>
                  <div v-if="monthDailyData[dayData.date] && monthDailyData[dayData.date].previousBalance && monthDailyData[dayData.date].currentBalance" class="w-layout-grid uui-table-row-day-of-month balance-column">
                    <div class="uui-text-size-medium starting-balance">
                      {{ ((monthDailyData[dayData.date].previousBalance || 0) > 0? 
                          `$${monthDailyData[dayData.date].previousBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                            !isNaN(monthDailyData[dayData.date].previousBalance)? 
                              `-$${Math.abs(monthDailyData[dayData.date].previousBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '')
                              
                      }}
                    </div>
                    <div class="uui-text-size-medium ending-balance">
                      {{ 
                        (monthDailyData[dayData.date].currentBalance > 0? 
                          `$${monthDailyData[dayData.date].currentBalance
                            .toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 
                            `-$${Math.abs(monthDailyData[dayData.date].currentBalance)
                              .toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}`)
                      }}</div>
                  </div>
                  <div v-else class="w-layout-grid uui-table-row-day-of-month">
                    <div class="div-block-2"></div>
                  </div>

                  <div v-if="monthDailyData[dayData.date]" class="w-layout-grid uui-table-row-day-of-month income-column">
                    <div v-bind:class="(monthDailyData[dayData.date].income  || []).length > 0 ? 'uui-text-size-medium income' : 'uui-text-size-medium'">
                      {{ 
                        ((monthDailyData[dayData.date].income  || []).length > 0 ? `$${(monthDailyData[dayData.date].income  || [])
                          .reduce((total, current) => total + current.amount, 0)
                          .toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '' )
                      }}</div>
                    <div v-for="i in Math.max((monthDailyData[dayData.date].expense || []).length - 1, 0)" :key="i" class="uui-text-size-medium">
                      <div v-if="i > (monthDailyData[dayData.date].income  || []).length"></div>
                    </div>
                  </div>
                  <div v-else class="w-layout-grid uui-table-row-day-of-month">
                    <div class="div-block-2"></div>
                  </div>
                  <div v-if="monthDailyData[dayData.date]" class="w-layout-grid uui-table-row-day-of-month expense-column">
                    <div v-for="(expense, index) in (monthDailyData[dayData.date].expense || [])" :key="index" class="uui-text-size-medium expense-cell">{{ expense.expenses }}</div>
                  </div>
                  <div v-else class="w-layout-grid uui-table-row-day-of-month">
                    <div class="div-block-2"></div>
                  </div>
                  <div v-if="monthDailyData[dayData.date]" class="w-layout-grid uui-table-row-day-of-month expense-price-column">
                    <div v-for="(expense, index) in (monthDailyData[dayData.date].expense || [])" :key="index" class="uui-text-size-medium expense-cell">
                      $ {{ 
                        expense.amount.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
                      }}</div>
                </div>
                  <div v-else class="w-layout-grid uui-table-row-day-of-month">
                    <div class="div-block-2"></div>
                  </div>

                <div class="w-layout-grid uui-table-row-day-of-month action-column">
                  <div class="action">
                    <div class="action-data">
                      <button type="button" class="btn btn-primary" @click="addIncomeModal(dayData.date)">Add Income</button>
                      <button type="button" class="btn btn-primary" @click="addExpenseModal(dayData.date)">Add Expense</button>
                      <button type="button" class="btn btn-primary" :disabled="!monthDailyData[dayData.date]" @click="selectedInstanceModal(dayData.date)">Modify Instance</button>
                      <button type="button" class="btn btn-primary" @click="notesModal(dayData.date)">Notes</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!isLargeScreen">
              <div v-for="dayData in calendar" :key="dayData.index" class="w-layout-grid-calendar-mobile background-color-gray50 calendar-mobile">
                <div v-if="dayData.date" class="uui-table_row_mobile">
                  <div class="w-layout-grid uui-table-row-day-of-month_mobile">
                    <div class="div-block-3">
                        <div class="uui-pricing07_row-lead-text date-column">{{ dayData.date }}</div>
                        <div class="uui-pricing07_row-lead-text date-column">{{ daysOfWeek[dayData.dayOfWeek] }}</div>
                    </div>
                    <div class="w-layout-grid uui-table-row-day-of-month">
                      <div :class="'uui-text-size-medium ' + getBalanceClass(dayData.date, 'starting', 'previousBalance')">
                        {{  
                          monthDailyData[dayData.date]?.previousBalance? 
                            "Start Bal: " + (monthDailyData[dayData.date]?.previousBalance > 0? 
                              `$${monthDailyData[dayData.date]?.previousBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) }` : 
                              `-$${Math.abs(monthDailyData[dayData.date]?.previousBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) }`) : 
                              '-' 
                        }}
                      </div>
                      <div :class="'uui-text-size-medium ' + (totalIncome(dayData.date) > 0? 'income' : 'hide-dash')">
                        {{ monthDailyData[dayData.date]?.income.length > 0?  "Income: $" + totalIncome(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-' }}
                      </div>
                      <div :class="'uui-text-size-medium ' + (totalExpense(dayData.date) > 0? 'expense' : 'hide-dash')">
                        {{  monthDailyData[dayData.date]?.expense.length > 0? "Expense: $" + totalExpense(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '-' }}
                      </div>
                      <div :class="'uui-text-size-medium ' + getBalanceClass(dayData.date, 'ending', 'currentBalance')">
                        {{
                            monthDailyData[dayData.date]?.currentBalance?
                              "End Bal: " + (monthDailyData[dayData.date].currentBalance > 0? 
                                `$${monthDailyData[dayData.date].currentBalance.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) }` : 
                                `-$${Math.abs(monthDailyData[dayData.date].currentBalance).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) }`) : '-' 
                        }}
                      </div>
                    </div>
                  </div>
                </div>
                      <div class="action">
                        <div class="action-data">
                          <button type="button" class="btn btn-primary" @click="addIncomeModal(dayData.date)">Add Income</button>
                          <button type="button" class="btn btn-primary" @click="addExpenseModal(dayData.date)">Add Expense</button>
                          <button type="button" class="btn btn-primary" :disabled="!monthDailyData[dayData.date]" @click="selectedInstanceModal(dayData.date)">Modify Instance</button>
                          <button type="button" class="btn btn-primary" @click="notesModal(dayData.date)">Notes</button>
                        </div>
                      </div>
              </div>
            </div>
            <div class="center-pagination">
              <nav aria-label="Page navigation example">
                <ul class="pagination">
                  <li class="page-item">
                    <a class="page-link" href="#" @click="decrementMonth">&lt;&lt; Previous</a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#" @click="incrementMonth">Next &gt;&gt;</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>

    <income-modal 
      ref="incomeModal"
      @modal-closed="refreshTable"
      :selected-option-category-header="selectedOptionCategoryHeader"
      :selected-class-category-header="selectedClassCategoryHeader"
      :selected-option-header="selectedOptionHeader"
      :selected-class-header="selectedClassHeader"
      :selected-option="selectedOption"
      :selected-class="selectedClass"
      :header-source="headerSource"
      :header-amount="headerAmount"
      :header-date="headerDate"
      :selected-date="selectedDate">
    </income-modal>

    <expense-modal 
      ref="expenseModal"
      @modal-closed="refreshTable"
      :selected-option-category-header="selectedOptionCategoryHeader"
      :selected-class-category-header="selectedClassCategoryHeader"
      :selected-option-header="selectedOptionHeader"
      :selected-class-header="selectedClassHeader"
      :selected-option="selectedOption"
      :selected-class="selectedClass"
      :header-source="headerExpense"
      :header-amount="headerAmount"
      :header-date="headerDate"
      :selected-date="selectedDate">
    </expense-modal>

    <modify-instance-modal
      ref="modifyInstanceModal"
      @modal-closed="refreshTable"
      :selected-instance="selectedInstance"
      :selected-date="selectedDate"
    >
    </modify-instance-modal>

    <notes-modal
      ref="noteModal"
      @modal-closed="refreshTable"
      :current-notes="currentNotes"
      :selected-date="selectedDate"
    >
    </notes-modal>
  </section>
</template>
  
<style scoped>
@import '../assets/components.css';
@import '../assets/budgeting-app.css';
.center-pagination{
  width: 100%;
  padding: 50px;
}
.center-pagination > nav{
  margin: auto;
}
.expense-input{
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, .1);
  background: transparent;
  font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,Oxygen,Fira Sans,Droid Sans,sans-serif;
    font-size: 1.125rem;
}

.modal-input {
  width: 50% !important;
}
.page-link-budget{
  background-color: transparent;
  border: none;
  color: white;
  text-decoration: none;
}
.action{
  padding-left: 10px;
  padding-right: 10px;
}
.action-data{
  display: flex;
  flex-direction: column;
  row-gap: 10px;
}
.expense-cell {
  padding: 15px !important;
}
.income-expense-input{
  display: flex;
  flex-direction: column;
  row-gap: 15px;
}
.income-expense-row{
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}
.dropdown-menu{
  padding-left: 10px !important;
  padding-right: 10px !important;
}
.dropdown-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.btn.dropdown-toggle::after {
  display: none;
}

.hide-dash{
  color: transparent;
}
#instanceTabs {
  padding-left: 0px !important;
}
</style>

<script>
import accountAPI from '../services/account-service';
import budgetTableAPI from '../services/budget-table-service';
import notesAPI from '../services/notes-service';
import IncomeModal from '../components/IncomeModal.vue';
import ExpenseModal from '../components/ExpenseModal.vue';
import mixin from '../utils/mixin';
import moment from 'moment';
import { Modal } from 'bootstrap';
import ModifyInstanceModal from '../components/ModifyInstanceModal.vue';
import NotesModal from '../components/NotesModal.vue';

export default {
  components: { IncomeModal, ExpenseModal, ModifyInstanceModal, NotesModal },
  mixins: [mixin],
  data() {
      return {
        currMonth: -1,
        currYear: -1,
        currentNotes: {
          notes: ""
        },
        total: 365,
        initialBalance: 0,
        currentBalance: 0,
        balanceHistory: [],
        monthDailyData: {},
        selectedDate: "",
        monthlyBalances: {},
        calendar: [],
        months: [
          'January',
          'February',
          'March',
          'April',
          'May',
          'June',
          'July',
          'August',
          'September',
          'October',
          'November',
          'December'
        ],
        noteModal: null,
        incomeModal: null,
        expenseModal: null,
        modifyInstanceModal: null,
        expenseInstanceIndex: 0,
        incomeInstanceIndex: 0,
        selectedInstance: {
          expense: [],
          income: []
        },
        origSelectedIntance: {
          expense: [],
          income: []
        },
        mediaQuery: window.matchMedia("(min-width: 724px)"),
        daysOfWeek: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
      }
    },
    mounted() {
      document.title = "Plan Wise - Budget Table";
      this.initializeData();
      this.noteModal = new Modal(this.$refs.noteModal.$el);
      this.incomeModal = new Modal(this.$refs.incomeModal.$el);
      this.expenseModal = new Modal(this.$refs.expenseModal.$el);
      this.modifyInstanceModal = new Modal(this.$refs.modifyInstanceModal.$el);
      this.$refs.incomeModal.$el.addEventListener('shown.bs.modal', () => {
        this.$refs.incomeModal.onShow();
      });
      this.$refs.expenseModal.$el.addEventListener('shown.bs.modal', () => {
        this.$refs.expenseModal.onShow();
      });
      this.$refs.modifyInstanceModal.$el.addEventListener('shown.bs.modal', () => {
        this.$refs.modifyInstanceModal.onShow();
      });
      this.$refs.noteModal.$el.addEventListener('shown.bs.modal', () => {
        this.$refs.noteModal.onShow();
      });
    },
    methods: {
      generateDates(startDate, frequency, duration) {
          let dates = []
          let date = moment(startDate)
          while (date.diff(moment(startDate), 'days') <= duration) {
              dates.push(date.format('YYYY-MM-DD'))
              switch (frequency) {
                  case 0:
                      date.add(1, 'days')
                      break
                  case 1:
                      date.add(7, 'days')
                      break
                  case 2:
                      date.add(14, 'days')
                      break
                  case 3:
                      date.add(1, 'months')
                      break
                  case 4:
                      date.add(3, 'months')
                      break
                  case 5:
                      date.add(6, 'months')
                      break
                  case 6:
                      date.add(1, 'years')
                      break
                  default:
                    return dates;
              }
          }
          return dates;
      },
      getDaysInMonth(start, end) {
          const dates = [];
          let current = new Date(start);
          let index = 1;
          while (current <= end) {
              dates.push({
                date: moment(current).format('YYYY-MM-DD').toString(),
                dayOfWeek: current.getDay(),
                index: index
              });
              current.setDate(current.getDate() + 1);
              current = new Date(current);
              index++;
          }
          return dates;
      },
      getMonthlyData(month, year) {
          this.currMonth = month;
          this.currYear = year;
          budgetTableAPI.getBudgetsInDateRange(moment(new Date (this.currYear , this.currMonth, 1)).format("YYYY-MM-DD")).then(result => {
            this.monthDailyData = result.budgets || {};
            let prevKey = Object.keys(this.monthDailyData)[0];
            for (let key of Object.keys(this.monthDailyData)) {
              const income = this.monthDailyData[key].income.reduce((total, current) => total + current.amount, 0);
              const expense = this.monthDailyData[key].expense.reduce((total, current) => total + current.amount, 0);
              this.currentBalance += income - expense;
              this.monthDailyData[key].previousBalance = this.monthDailyData[prevKey].currentBalance? this.monthDailyData[prevKey].currentBalance : this.initialBalance;
              this.monthDailyData[key].currentBalance = this.currentBalance;
              prevKey = key;
            }
          });
      },
      changeMonth(direction) {
          if (direction == 'next') {
              this.incrementMonth()
          } else if (direction == 'prev') {
              this.decrementMonth() 
          }
      },
      incrementMonth() {
        const monthData = Object.keys(this.monthDailyData);
        this.currMonth = moment(monthData[0]).add(1, 'month').month();
        this.currYear = moment(monthData[0]).add(1, 'month').year();
        this.calendar = this.getDaysInMonth(new Date (this.currYear , this.currMonth, 1), new Date (this.currYear , this.currMonth + 1, 0));
        this.balanceHistory.push(this.initialBalance);
        this.initialBalance = this.monthDailyData[monthData[monthData.length - 1]].currentBalance;
        this.currentBalance = this.initialBalance;
        this.getMonthlyData(this.currMonth, this.currYear);
      },
      decrementMonth() {
        const monthData = Object.keys(this.monthDailyData);
        this.currMonth = moment(monthData[0]).subtract(1, 'month').month();
        this.currYear = moment(monthData[0]).subtract(1, 'month').year();
        this.calendar = this.getDaysInMonth(new Date (this.currYear , this.currMonth, 1), new Date (this.currYear , this.currMonth + 1, 0));
        if (this.balanceHistory.length > 0) {
          this.initialBalance = this.balanceHistory.pop();
        }
        this.currentBalance = this.initialBalance;
        this.getMonthlyData(this.currMonth, this.currYear);
      },
      getBalanceClass(date) {
        return this.monthlyBalances[date] < 0 ? 'expense' : this.monthlyBalances[date] > 0? 'starting-balance' : 'hide-dash';
      },
      refreshTable(){
        this.calendar = this.getDaysInMonth(new Date (this.currYear , this.currMonth, 1), new Date (this.currYear , this.currMonth + 1, 0));
        this.currentBalance = this.initialBalance;
        this.getMonthlyData(this.currMonth, this.currYear);
        this.incomeModal.hide();
        this.expenseModal.hide();
        this.modifyInstanceModal.hide();
        this.noteModal.hide();
      },
      addIncomeModal(date){
        this.selectedDate = date;
        this.selectedOptionCategoryHeader = { category_name: 'Select Category' };
        this.selectedClassCategoryHeader = '';
        this.selectedOptionHeader = 'Select Interval';
        this.selectedClassHeader = '';
        this.selectedOption = 'Select Interval';
        this.selectedClass = '';
        this.headerSource = '';
        this.headerAmount = 0;
        this.headerExpense = '';
        this.incomeModal.show();
      },
      addExpenseModal(date){
        this.selectedDate = date;
        this.selectedOptionCategoryHeader = { category_name: 'Select Category' };
        this.selectedClassCategoryHeader = '';
        this.selectedOptionHeader = 'Select Interval';
        this.selectedClassHeader = '';
        this.selectedOption = 'Select Interval';
        this.selectedClass = '';
        this.headerExpense = '';
        this.headerAmount = 0;
        this.expenseModal.show();
      },
      selectOptionInstance(type, index) {
        this.selectedInstance[type].frequency = index;
      },
      selectCategoryHeader(category) {
        this.selectedOptionCategoryHeader = category;
        this.selectedClassCategoryHeader = category.category_name === 'Select Category'? '' : 'btn-primary';
      },
      selectedInstanceModal(date){
        if(!this.monthDailyData[date]){
          return;
        }
        this.selectedDate = date;
        this.selectedInstance = this.monthDailyData[date];
        this.modifyInstanceModal.show();
      },
      isLargeScreen() {
        return this.mediaQuery.matches;
      },
      totalIncome(date){
        return this.monthDailyData[date]?.income.reduce((total, current) => total + current.amount, 0) ;
      },
      totalExpense(date){
        return this.monthDailyData[date]?.expense.reduce((total, current) => total + current.amount, 0) ;
      },
      getBalanceClass(date, type, balance) {
        return ((this.monthDailyData[date] || {[balance]: 0})[balance] < 0) ? 'expense' : (this.monthDailyData[date] || {[balance]: 0})[balance] > 0? `${type}-balance` : 'hide-dash';
      },
      updateMediaQuery(event) {
        this.mediaQuery = event.target;
      },
      async initializeData(){
          this.initialBalance = (await accountAPI.getUser()).user?.balance || 0;
          this.currentBalance = this.initialBalance;
          this.previousInitialBalance = this.initialBalance;
          this.monthDailyData = (await budgetTableAPI.getBudgetsInDateRange()).budgets || {};
          this.currMonth = moment(Object.keys(this.monthDailyData)[0]).month();
          this.currYear = moment(Object.keys(this.monthDailyData)[0]).year();
          this.calendar = this.getDaysInMonth(new Date (this.currYear , this.currMonth, 1), new Date (this.currYear , this.currMonth + 1, 0));
          await this.generate();
      },
      async generate() {
          let prevKey = Object.keys(this.monthDailyData)[0];
          for (let key of Object.keys(this.monthDailyData)) {
            const income = this.monthDailyData[key].income.reduce((total, current) => total + current.amount, 0);
            const expense = this.monthDailyData[key].expense.reduce((total, current) => total + current.amount, 0);
            this.currentBalance += income - expense;
            this.monthDailyData[key].previousBalance = this.monthDailyData[prevKey].currentBalance? this.monthDailyData[prevKey].currentBalance : this.initialBalance;
            this.monthDailyData[key].currentBalance = this.currentBalance;
            prevKey = key;
          }
      },
      async notesModal(date){
        this.selectedDate = date;
        let notes = await notesAPI.getByDate(date);
        if(notes.success){
          this.currentNotes = notes.notes;
        } else {
          this.currentNotes = {
            notes: ""
          };
        }
        this.noteModal.show();
      },
      async changeInitialBalance(){
        await accountAPI.updateUser({
          balance: this.initialBalance
        });
        this.currentBalance = this.initialBalance;
        this.monthlyBalances = {};
          for (let key of Object.keys(this.monthDailyData)) {
            const income = this.monthDailyData[key].income.reduce((total, current) => total + current.amount, 0);
            const expense = this.monthDailyData[key].expense.reduce((total, current) => total + current.amount, 0);
            this.currentBalance += income - expense;
            this.monthDailyData[key].currentBalance = this.currentBalance;
          }
      }
    },
    computed: {
      currentMonth () {
        if(this.currMonth > -1 && this.currYear > -1){
          this.getMonthlyData(this.currMonth, this.currYear);
        }
      },
      conditionalLayoutGrid() {
        return {
          'w-layout-grid': window.innerWidth > 600,
          'uui-table_row': true,
          'new-row': true
        }
      },
      isLargeScreen() {
        return this.mediaQuery.matches;
      },
      created() {
        this.mediaQuery.addEventListener("change", this.updateMediaQuery)
      },
      beforeDestroy() {
        this.mediaQuery.removeEventListener("change", this.updateMediaQuery)
      },
    },
    watch: {}
}
</script>