<template>

<section class="uui-section_table">
    <div class="uui-page-padding">
      <div class="uui-container-large">
        <div class="uui-padding-vertical-xhuge">
          <div class="uui-text-align-center">
            <div class="uui-max-width-large align-center">
              <h2 class="uui-heading-medium">Budget Calendar</h2>
              <div class="uui-space-xsmall"></div>
              <div class="uui-text-size-large">Calendar view of your budget per day<strong></strong></div>
            </div>
          </div>
          <div class="uui-table">
            <div class="fixed-headers" v-if="isLargeScreen">
              <div class="uui-table_heading-row_calendar">
                <div class="uui-table_heading-row-text">Sunday</div>
                <div class="uui-table_heading-row-text">Monday</div>
                <div class="uui-table_heading-row-text">Tuesday</div>
                <div class="uui-table_heading-row-text">Wednesday</div>
                <div class="uui-table_heading-row-text">Thursday</div>
                <div class="uui-table_heading-row-text">Friday</div>
                <div class="uui-table_heading-row-text">Saturday</div>
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
            <div v-if="isLargeScreen" class="w-layout-grid uui-table_row_calendar background-color-gray50">
              <div v-for="dayData in calendar" :key="dayData.index" class="w-layout-grid uui-table-row-day-of-month_calendar border-day">
                <div class="uui-text-size-medium">{{ dayData.date || ""}}</div>
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
                  {{ monthDailyData[dayData.date]?.income.length > 0?  "Income: $" + totalIncome(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })  : '-' }}
                </div>
                <div :class="'uui-text-size-medium ' + (totalExpense(dayData.date) > 0? 'expense' : 'hide-dash')">
                  {{  monthDailyData[dayData.date]?.expense.length > 0? "Expense: $" + totalExpense(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })  : '-' }}
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

            <div v-if="!isLargeScreen">
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
                        {{ monthDailyData[dayData.date]?.income.length > 0?  "Income: $" + totalIncome(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })  : '-' }}
                      </div>
                      <div :class="'uui-text-size-medium ' + (totalExpense(dayData.date) > 0? 'expense' : 'hide-dash')">
                        {{  monthDailyData[dayData.date]?.expense.length > 0? "Expense: $" + totalExpense(dayData.date).toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 })  : '-' }}
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
              </div>
            </div>
            <div class="center-pagination">
              <nav aria-label="Page navigation example">
                <ul class="pagination">
                  <li class="page-item">
                    <a class="page-link" href="#" @click="decrementMonth">Previous</a>
                  </li>
                  <li class="page-item">
                    <a class="page-link" href="#" @click="incrementMonth">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
  
<style scoped>
@import '../assets/components.css';
@import '../assets/budgeting-app.css';
.center-pagination{
  width: 100%;
  padding: 50px;
}
.center-pagination>nav{
  margin: auto;
}
.border-day{
  border: lightgrey solid 1px;
}
.hide-dash{
  color: transparent;
}

.page-link-budget{
  background-color: transparent;
  border: none;
  color: white;
  text-decoration: none;
}
</style>

<script>
import accountAPI from '../services/account-service';
import budgetTableAPI from '../services/budget-table-service';
import moment from 'moment';

export default {
  data() {
      return {
        expense: [],
        income: [],
        currMonth: -1,
        currYear: -1,
        total: 365,
        initialBalance: 0,
        monthDailyData: {},
        monthlyData: {},
        monthlyBalances: {},
        pages: [],
        balanceHistory: [],
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
        calendar: [],
        mediaQuery: window.matchMedia("(min-width: 724px)"),
        daysOfWeek: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ]
      }
    },
    mounted() {
      document.title = "Plan Wise - Budget Calendar";
      this.initializeData();
    },
    methods: {
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
                      break
              }
          }
          return dates
      },
      groupByDate(items) {
          let result = {}
          for (let item of items) {
              let startDate = item.start_date
              let frequency = item.frequency
              let duration = 365
              let dates = this.generateDates(startDate, frequency, duration)
              for (let date of dates) {
                  if (result[date]) {
                      result[date].push(item)
                  } else {
                      result[date] = [item]
                  }
              }
          }
          return result
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
          this.calendar = this.getDaysInMonth(new Date (this.currYear , this.currMonth, 1), new Date (this.currYear , this.currMonth + 1, 0))
          const firstDay = this.calendar[0].dayOfWeek;
          for (let i = 0; i < firstDay && this.mediaQuery.matches; i++) {
            this.calendar.unshift({});
          }
      },
      combineByDate(expenses, incomes) {
          let result = {}
          let expenseKeys = Object.keys(expenses)
          for (let key of expenseKeys) {
              if (result[key]) {
                  result[key].expense = expenses[key]
              } else {
                  result[key] = {
                      expense: expenses[key],
                      income: []
                  }
              }
          }
          let incomeKeys = Object.keys(incomes)
          for (let key of incomeKeys) {
              if (result[key]) {
                  result[key].income = incomes[key]
              } else {
                  result[key] = {
                      expense: [],
                      income: incomes[key]
                  }
              }
          }
          return result
      },
      groupByMonth(items) {
        let result = {}
        for (let item of items) {
            let startDate = item.start_date
            let frequency = item.frequency
            let duration = 365
            let dates = this.generateDates(startDate, frequency, duration)
            for (let date of dates) {
                let month = moment(date).format('MMMM') // format the date as month name using moment
                if (result[month]) {
                    result[month].push(item)
                } else {
                    result[month] = [item]
                }
            }
        }
        return result
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
        this.calendar = this.getDaysInMonth(new Date (this.currYear , this.currMonth, 1), new Date (this.currYear , this.currMonth + 1, 0))
        const firstDay = this.calendar[0].dayOfWeek;
        for (let i = 0; i < firstDay; i++) {
          this.calendar.unshift({});
        }
      },
      decrementMonth() {
        const monthData = Object.keys(this.monthDailyData);
        this.currMonth = moment(monthData[0]).subtract(1, 'month').month();
        this.currYear = moment(monthData[0]).subtract(1, 'month').year();
        this.getMonthlyData(this.currMonth, this.currYear);
        this.calendar = this.getDaysInMonth(new Date (this.currYear , this.currMonth, 1), new Date (this.currYear , this.currMonth + 1, 0))
        if (this.balanceHistory.length > 0) {
          this.initialBalance = this.balanceHistory.pop();
        }
        this.currentBalance = this.initialBalance;
        const firstDay = this.calendar[0].dayOfWeek;
        for (let i = 0; i < firstDay; i++) {
          this.calendar.unshift({});
        }
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
      totalIncome(date){
        return this.monthDailyData[date]?.income.reduce((total, current) => total + current.amount, 0) ;
      },
      totalExpense(date){
        return this.monthDailyData[date]?.expense.reduce((total, current) => total + current.amount, 0);
      },
      getBalanceClass(date, type, balance) {
        return ((this.monthDailyData[date] || {[balance]: 0})[balance] < 0) ? 'expense' : (this.monthDailyData[date] || {[balance]: 0})[balance] > 0? `${type}-balance` : 'hide-dash';
      },
      updateMediaQuery(event) {
        this.mediaQuery = event.target;
      }
    },
    computed: {
      currentMonth () {
        if(this.currMonth > -1 && this.currYear > -1){
          this.getMonthlyData(this.currMonth, this.currYear);
        }
      },
      isLargeScreen() {
        return this.mediaQuery.matches;
      }
    },
    created() {
      this.mediaQuery.addEventListener("change", this.updateMediaQuery)
    },
    beforeDestroy() {
      this.mediaQuery.removeEventListener("change", this.updateMediaQuery)
    },

    watch: {}
}
</script>