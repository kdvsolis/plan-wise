<template>
  <section class="uui-section_table">
    <div class="uui-page-padding">
      <div class="uui-container-large">
        <div class="uui-padding-vertical-xhuge">
          <div class="uui-text-align-center">
            <div class="uui-max-width-large align-center">
              <h2 class="uui-heading-medium">Income</h2>
              <div class="uui-space-xsmall"></div>
              <div class="uui-text-size-large">Add and manage your repeating <strong>Income</strong></div>
              <a href="#" class="button w-button" @click="inputToggle">{{ showInput? "-" : "+" }}</a>
            </div>
          </div>
          <div class="uui-table">
            <div class="uui-table_heading-row">
              <div class="uui-table_heading-row-text">Income Source</div>
              <div class="uui-table_heading-row-text">Amount</div>
              <div class="uui-table_heading-row-text">Start Date</div>
              <div class="uui-table_heading-row-text">Frequency</div>
              <div class="uui-table_heading-row-text">Action</div>
            </div>
            <div :class="conditionalLayoutGrid" v-if="showInput">
              <div class="uui-table_feature input-header">
                <input type="text" class="expense-input" v-model="headerSource">
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
                  <button :class="['btn', 'dropdown-toggle', selectedClassHeader]" type="button" id="dropdownMenuButtonHeader" aria-expanded="false">
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
                <button type="button" class="btn btn-primary add-button" @click="createIncome">Add</button>
              </div>
            </div>
            <div v-for="(row, index) in rows" :key="index" :class="['w-layout-grid', 'uui-table_row', { 'background-color-gray50': index % 2 === 1 }]">
              <div class="uui-table_feature">
                <input type="text" class="expense-input" v-model="rows[index].source">
              </div>
              <div class="uui-table_row-content">
                <div class="expense-input">
                  <span class="input-group-addon">$</span>
                  <input type="number" class="no-border-input" v-model="rows[index].amount">
                </div>
              </div>
              <div class="uui-table_row-content">
                <input type="date" pattern="\d{4}-\d{2}-\d{2}" class="expense-input" v-model="row.start_date">
              </div>
              <div class="uui-table_row-content">
                <div class="dropdown dropdown-border" data-bs-toggle="dropdown" data-bs-display="static">
                  <button :class="['btn', 'dropdown-toggle', 'frequency-width', isNaN(row.frequency)? '': options[rows[index].frequency].class]" type="button" :id="'dropdownMenuButton' + index" aria-expanded="false">
                    {{ isNaN(rows[index].frequency)? 'Select Frequency': options[rows[index].frequency].text }}
                  </button>
                  <span class="dropdown-icon">▼</span>
                  <ul class="dropdown-menu" :aria-labelledby="'dropdownMenuButton' + index">
                    <li v-for="option in options" :key="option.text">
                      <a :class="[option.class, 'dropdown-item', 'frequency-width']" @click="selectOption(option, index)">{{ option.text }}</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div class="uui-table_row-content">
                <div class="action">
                  <button type="button" class="btn btn-warning" @click="updateIncome(index)">Save</button>
                  <button type="button" class="btn btn-danger" @click="deleteConfirmation(index)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <confirmation-modal 
      ref="confirmationModal"
      :header-message="'Delete Income'"
      :body-message="deleteBodyMessage"
      :confimation-action="deleteIncome"
      :action-message="'Delete'"
      :action-class="'btn-danger'"
    ></confirmation-modal>
  </section>
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
  .dropdown-menu{
    width: 100%;
  }
  .frequency-width{
    width: 100%;
  }
  .add-button{
    flex: 1;
  }
}
</style>

<script>
import income from '../services/income-service';
import moment from 'moment';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import { Modal } from 'bootstrap';

export default {
  components: { ConfirmationModal },
    data() {
      return {
        selectedOptionHeader: 'Select Interval',
        selectedClassHeader: '',
        selectedOption: 'Select Interval',
        selectedClass: '',
        headerSource: '',
        headerAmount: 0,
        headerDate: new Date(),
        selectedIncomeIndex: -1,
        showInput: false,
        confirmationModal: null,
        deleteBodyMessage: '',
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
      }
    },
    mounted() {
      document.title = "Plan Wise - Income";
      this.fetchAllIncome();
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
      deleteConfirmation(index){
        this.selectedIncomeIndex = index;
        this.deleteBodyMessage = `Are you sure you want to delete ${this.rows[index].source}?`;
        this.confirmationModal.show();
      },
      async createIncome() {
        if (this.headerSource) {
            let body = {
              source: this.headerSource,
              amount: this.headerAmount,
              start_date: this.headerDate,
              frequency: this.options.findIndex(x => this.selectedClassHeader === x.class)
            };
            try {
                let response = await income.create(body);
                if (response.success) {
                  this.rows.push(response.income);
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
      },
      async fetchAllIncome() {
          try {
              let response = await income.getAll();
              this.rows = response.income || [];
          } catch(exception){
              console.log(exception);
          }
      },
      async updateIncome(index){
        let response = await income.update(this.rows[index].id, this.rows[index]);
        console.log(response);
      },
      async deleteIncome(){
        let index = this.selectedIncomeIndex;
        if(index === -1){
          this.$refs.confirmationModal.onShow();
        }
        let response = await income.delete(this.rows[index].id);
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