<template>
    <div class="uui-page-padding">
      <div class="uui-container-large">
        <div class="uui-padding-vertical-xhuge">
          <div class="uui-text-align-center">
            <div class="uui-max-width-large align-center">
              <h2 class="uui-heading-medium">Expenses</h2>
              <div class="uui-space-xsmall"></div>
              <div class="uui-text-size-large">Add and manage your repeating <strong>expenses</strong></div>
              <a href="#" class="button w-button" @click="inputToggle">{{ showInput? "-" : "+" }}</a>
            </div>
          </div>
          <div class="uui-table">
            <div class="uui-table_heading-row">
              <div class="uui-table_heading-row-text">Expense</div>
              <div class="uui-table_heading-row-text">Amount</div>
              <div class="uui-table_heading-row-text">Start Date</div>
              <div class="uui-table_heading-row-text">Frequency</div>
              <div class="uui-table_heading-row-text">Category</div>
              <div class="uui-table_heading-row-text">Action</div>
            </div>
            <div :class="conditionalLayoutGrid" v-if="showInput">
              <div class="uui-table_feature input-header">
                <input type="text" class="expense-input" v-model="headerExpense">
              </div>
              <div class="uui-table_row-content input-header">
                <div class="expense-input">
                  <span class="input-group-addon">$</span>
                <input type="number" class="no-border-input" v-model="headerAmount">
              </div>
              </div>
              <div class="uui-table_row-content input-header">
                <input type="date" pattern="\d{4}-\d{2}-\d{2}" class="expense-input" v-model="headerDate">
              </div>
              <div class="uui-table_row-content input-header">
                <div class="dropdown dropdown-border" data-bs-toggle="dropdown" data-bs-display="static">
                  <button :class="['btn', 'dropdown-toggle', 'frequency-width', selectedClassHeader]" type="button" id="dropdownMenuButtonHeader" aria-expanded="false">
                    {{ selectedOptionHeader }}
                  </button>
                  <span class="dropdown-icon">▼</span>
                  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButtonHeader">
                    <li v-for="option in options" :key="option.text">
                      <a :class="[option.class, 'dropdown-item']" href="#" @click="selectOptionHeader(option)">{{ option.text }}</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="uui-table_row-content input-header">
                <div class="dropdown dropdown-border" data-bs-toggle="dropdown" data-bs-display="static">
                  <button :class="['btn', 'dropdown-toggle', 'frequency-width', selectedClassCategoryHeader]" type="button" id="dropdownCategoryButtonHeader" aria-expanded="false">
                    {{ selectedOptionCategoryHeader?.category_name || "Select Category" }}
                  </button>
                  <span class="dropdown-icon">▼</span>
                  <ul class="dropdown-menu" aria-labelledby="selectCategoryHeader">
                    <li>
                      <a class="dropdown-item" @click="selectCategoryHeader(null)">Select Category</a>
                    </li>
                    <li v-for="category in categories" :key="category.id">
                      <a :class="[category.class, 'dropdown-item']" @click="selectCategoryHeader(category)">{{ category.category_name }}</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="uui-table_row-content input-header">
                <button type="button" class="btn btn-primary add-button" @click="createExpense">Add</button>
              </div>
            </div>
            <div v-for="(row, index) in rows" :key="index" :class="['w-layout-grid', 'uui-table_row', { 'background-color-gray50': index % 2 === 1 }]">
              <div class="uui-table_feature">
                <input type="text" class="expense-input" v-model="rows[index].expenses">
              </div>
              <div class="uui-table_row-content">
                <div class="expense-input">
                  <span class="input-group-addon">$</span>
                  <input type="number" class="no-border-input" v-model="rows[index].amount">
                </div>
              </div>
              <div class="uui-table_row-content">
                <input type="date" pattern="\d{4}-\d{2}-\d{2}" class="expense-input" v-model="rows[index].start_date">
              </div>
              <div class="uui-table_row-content">
                <div class="dropdown dropdown-border" data-bs-toggle="dropdown" data-bs-display="static">
                  <button :class="['btn', 'frequency-width', 'dropdown-toggle', isNaN(rows[index].frequency)? '': options[rows[index].frequency].class]" type="button" :id="'dropdownMenuButton' + index" aria-expanded="false">
                    {{ isNaN(rows[index].frequency)? 'Select Frequency': options[rows[index].frequency].text }}
                  </button>
                  <span class="dropdown-icon">▼</span>
                  <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButton' + index">
                    <li v-for="option in options" :key="option.text">
                      <a :class="[option.class, 'dropdown-item']" href="#" @click="selectOption(option, index)">{{ option.text }}</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="uui-table_row-content">
                <div class="dropdown dropdown-border" data-bs-toggle="dropdown" data-bs-display="static">
                  <button :class="['btn', 'dropdown-toggle', 'frequency-width', categories.find(category => category.id === rows[index].category)? 'btn-primary' : '' ]" type="button" :id="'dropdownCategoryButton' + index" aria-expanded="false">
                    {{ categories.find(category => category.id === rows[index].category)?.category_name || 'Select Category' }}
                  </button>
                  <span class="dropdown-icon">▼</span>
                  <ul class="dropdown-menu" :aria-labelledby="'dropdownCategoryButton' + index">
                    <li>
                      <a class="dropdown-item" @click="selectCategoryOption(null, index)">Select Category</a>
                    </li>
                    <li v-for="category in categories" :key="category.id">
                      <a :class="['one-time-expense', 'dropdown-item', 'frequency-width']" @click="selectCategoryOption(category, index)">{{ category.category_name }}</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="uui-table_row-content">
                <div class="action">
                  <button type="button" class="btn btn-warning" @click="updateExpense(index)">Save</button>
                  <button type="button" class="btn btn-danger" @click="deleteConfirmation(index)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
          <confirmation-modal 
          ref="confirmationModal"
          :header-message="'Delete Expense'"
          :body-message="deleteBodyMessage"
          :confimation-action="deleteExpense"
          :action-message="'Delete'"
          :action-class="'btn-danger'"
        ></confirmation-modal>
    </div>
</template>

<style scoped>
@import '../assets/components.css';
@import '../assets/budgeting-app.css';
.dropdown-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.btn.dropdown-toggle::after {
  display: none;
}
.dropdown-toggle{
  padding: 5px;
}
.expense-input{
  width: 100%;
  padding: 5px;
  border-radius: 5px;
  border: 1px solid rgba(0, 0, 0, .1);
  background: transparent;
  font-family: system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Cantarell,Helvetica Neue,Oxygen,Fira Sans,Droid Sans,sans-serif;
  font-size: 1.125rem;
  display: flex;
}
.dropdown-menu{
  padding-left: 10px !important;
  padding-right: 10px !important;
}
.dropdown-item{
  margin-bottom: 5px;
}
.input-header{
  width: 100%;
}
.action{
  display: flex;
  flex-direction: row;
  column-gap: 10px;
}
.no-border-input {
  border: 0px;
  width: 100%;
  background-color: transparent;
}
@media screen and (max-width: 767px) {  
  .action{
    align-items: stretch;
    width: 100%;
    margin-bottom: 10px;
  }
  .action > button{
    flex: 1;
  }
  .add-button{
    flex: 1;
  }
  .dropdown-menu{
    width: 100%;
  }
  .frequency-width{
    width: 100%;
  }
}
</style>

<script>
import expense from '../services/expense-service';
import category from '../services/category-service';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import moment from 'moment';
import { Modal } from 'bootstrap';

export default {
    components: { ConfirmationModal },
    data() {
      return {
        selectedOptionCategoryHeader: { category_name: 'Select Category' },
        selectedClassCategoryHeader: '',
        selectedOptionHeader: 'Select Interval',
        selectedClassHeader: '',
        selectedOption: 'Select Interval',
        selectedClass: '',
        headerExpense: '',
        headerAmount: 0,
        headerDate: new Date(),
        showInput: false,
        confirmationModal: null,
        deleteBodyMessage: '',
        selectedExpenseIndex: -1,
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
        rows: [],
        categories: []
      };
    },
    mounted() {
      this.fetchCategories().then(() => {
        this.fetchExpenses();
      });
      document.title = "Plan Wise - Expenses";
      this.confirmationModal = new Modal(this.$refs.confirmationModal.$el);
      this.$refs.confirmationModal.$el.addEventListener('shown.bs.modal', () => {
        this.$refs.confirmationModal.onShow();
      });
    },
    methods: {
      selectOption(option, index) {
        this.rows[index].frequency = this.options.findIndex(x => option.class === x.class);
      },
      selectOptionHeader(option) {
        this.selectedOptionHeader = option.text;
        this.selectedClassHeader = option.class;
      },
      selectCategoryOption(category, index) {
        if(!category){
          this.rows[index].category = null;
          return;
        }
        this.rows[index].category = category.id;
      },
      selectCategoryHeader(category) {
        this.selectedOptionCategoryHeader = category;
        this.selectedClassCategoryHeader = category? 'btn-primary' : '';
      },
      formattedDate() {
        return moment(this.selectedDate).format('MM-DD-YYYY');
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
                let response = await expense.create(body);
                if (response.success) {
                    this.rows.push(response.expense);
                    this.headerExpense = "";
                    this.headerAmount = 0;
                    this.headerDate = new Date();
                    this.selectOptionHeader('Select Interval');
                    this.selectCategoryHeader({ category_name: 'Select Category' });
                } else {
                    console.error(response.message);
                }
            } catch (exception) {
                console.error(exception);
            }
        } else {
            console.warn("Please enter a category name");
        }
      },
      async fetchCategories() {
          try {
              let response = await category.getAll();
              this.categories = response.category || [];
          } catch(exception){
              console.log(exception);
          }
      },
      async fetchExpenses() {
          try {
              let response = await expense.getAll();
              this.rows = response.expense || [];
          } catch(exception){
              console.log(exception);
          }
      },
      async updateExpense(index){
        let response = await expense.update(this.rows[index].id, this.rows[index]);
        console.log(response);
      },
      deleteConfirmation(index){
        this.selectedExpenseIndex = index;
        this.deleteBodyMessage = `Are you sure you want to delete ${this.rows[index].expenses}?`;
        this.confirmationModal.show();
      },
      async deleteExpense(){
        let index = this.selectedExpenseIndex;
        let response = await expense.delete(this.rows[index].id);
        if(response.success){
          this.rows.splice(index, 1);
          this.confirmationModal.hide();
        }
      },
      async inputToggle(){
        this.showInput = !this.showInput;
      },
    },
    computed: {
      conditionalLayoutGrid() {
        return {
          'w-layout-grid': window.innerWidth > 600,
          'uui-table_row': true,
          'new-row': true
        }
      }
    },
    watch: {
    }

}
</script>