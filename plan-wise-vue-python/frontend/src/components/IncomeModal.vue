<template>
    <div class="modal fade" id="incomeModal" ref="incomeModal" tabindex="-1" role="dialog" aria-labelledby="incomeModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="incomeModalLabel">New Income</h5>
            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="income-expense-input">
              <div class="income-expense-row">
                <span>Source: </span>
                <input type="text" class="expense-input modal-input" v-model="localHeaderSource">
              </div>
              <div class="income-expense-row">
                <span>Amount($): </span>
                <input type="number" class="expense-input modal-input" v-model="localHeaderAmount">
              </div>
              <div class="income-expense-row">
                <span>Date: </span>
                <input type="date" pattern="\d{4}-\d{2}-\d{2}" disabled="true" class="expense-input modal-input" v-model="localSelectedDate">
              </div>
              <div class="income-expense-row">
                <span>Frequency: </span>
                <div class="dropdown dropdown-border modal-input" data-bs-toggle="dropdown" data-bs-display="static">
                  <button :class="['btn', 'dropdown-toggle', localSelectedClassHeader]" type="button" id="dropdownMenuButtonHeader" aria-expanded="false">
                    {{ localSelectedOptionHeader }}
                  </button>
                  <span class="dropdown-icon">▼</span>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonHeader">
                    <li>
                      <a class="dropdown-item" href="#" @click="selectOptionHeader({ text: '', class: '' })">Select Interval</a>
                    </li>
                    <li v-for="option in options" :key="option.text">
                      <a :class="[option.class, 'dropdown-item']" href="#" @click="selectOptionHeader(option)">{{ option.text }}</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="createIncome">Save changes</button>
          </div>
        </div>
      </div>
    </div>
</template>
<style scoped>
@import '../assets/components.css';
@import '../assets/budgeting-app.css';
.expense-input{
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, .1);
  background: transparent;
  font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,Oxygen,Fira Sans,Droid Sans,sans-serif;
    font-size: 1.125rem;
}

.expense-cell {
  padding: 15px !important;
}
.modal-input {
  width: 50% !important;
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
</style>
<script>
import incomeAPI from '../services/income-service';
export default {
    props: [
        'selectedOptionCategoryHeader',
        'selectedClassCategoryHeader',
        'selectedOptionHeader',
        'selectedClassHeader',
        'selectedOption',
        'selectedClass',
        'headerSource',
        'headerAmount',
        'headerDate',
        'selectedDate'
    ],
    data() {
        return {
            localSelectedOptionCategoryHeader: '',
            localSelectedClassCategoryHeader: '',
            localSelectedOptionHeader: '',
            localSelectedClassHeader: '',
            localSelectedOption: '',
            localSelectedClass: '',
            localHeaderSource: '',
            localHeaderAmount: 0,
            localHeaderDate: '',
            localSelectedDate: '',
            options: [
                { text: 'Daily', class: 'daily' },
                { text: 'Weekly', class: 'weekly' },
                { text: 'Every Other Week', class: 'every-other-week' },
                { text: 'Monthly', class: 'monthly' },
                { text: 'Quarterly', class: 'quarterly' },
                { text: 'Every 6 Months', class: 'every-6-months' },
                { text: 'Annually', class: 'annually' },
                { text: 'One Time', class: 'one-time-expense' }
            ],
        };
    },
    mounted() {
        this.onShow();
    },
    methods: {
        async createIncome(){
            try {
                let body = {
                    source: this.localHeaderSource,
                    amount: this.localHeaderAmount,
                    start_date: this.localSelectedDate,
                    frequency: this.options.findIndex(x => this.localSelectedClassHeader === x.class)
                };
                let response = await incomeAPI.create(body);
                if (response.success) {
                    this.$emit('modal-closed');
                } else {
                    console.error(response.message);
                }
            } catch (exception) {
                console.error(exception);
            }
        },
        onShow(){         
            this.localSelectedOptionCategoryHeader = this.selectedOptionCategoryHeader;
            this.localSelectedClassCategoryHeader = this.selectedClassCategoryHeader;
            this.localSelectedOptionHeader = this.selectedOptionHeader;
            this.localSelectedClassHeader = this.selectedClassHeader;
            this.localSelectedOption = this.selectedOption;
            this.localSelectedClass = this.selectedClass;
            this.localHeaderSource = this.headerSource;
            this.localHeaderAmount = this.headerAmount;
            this.localHeaderDate = this.headerDate;
            this.localSelectedDate = this.selectedDate;
        },
        selectOptionHeader(option) {
            this.localSelectedOptionHeader = option.text;
            this.localSelectedClassHeader = option.class;
        }
    },
};
</script>