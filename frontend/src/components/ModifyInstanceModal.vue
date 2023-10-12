<template>
    <div class="modal fade" id="modifyInstanceModal" ref="modifyInstanceModal" tabindex="-1" role="dialog" aria-labelledby="modifyInstanceModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modifyInstanceModalLabel">Modify Instance</h5>
            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <ul class="nav nav-tabs" id="instanceTabs" role="tablist">
              <li class="nav-item" role="presentation" v-if="localSelectedInstance.expense.length > 0">
                <button class="nav-link active" id="expense-data-tab" data-bs-toggle="tab" data-bs-target="#expense-data" type="button" role="tab" aria-controls="expense-data" aria-selected="true">Expense</button>
              </li>
              <li class="nav-item" role="presentation" v-if="localSelectedInstance.income.length > 0">
                <button class="nav-link" :class="localSelectedInstance.expense.length === 0? 'active' : ''" id="income-data-tab" v-if="localSelectedInstance.income.length > 0" data-bs-toggle="tab" data-bs-target="#income-data" type="button" role="tab" aria-controls="income-data" aria-selected="false">Income</button>
              </li>
            </ul>
            <div class="tab-content" id="instanceTabsContent">
              <div class="tab-pane fade show active" id="expense-data" v-if="localSelectedInstance.expense.length > 0" role="tabpanel" aria-labelledby="expense-data-tab">
                <div class="income-expense-input">
                  <div class="income-expense-row">
                    <span>Expense: </span>
                    <input type="text" class="expense-input modal-input" v-model="localSelectedInstance.expense[expenseInstanceIndex].expenses">
                  </div>
                  <div class="income-expense-row">
                    <span>Amount($): </span>
                    <input type="number" class="expense-input modal-input" v-model="localSelectedInstance.expense[expenseInstanceIndex].amount">
                  </div>
                  <div class="income-expense-row">
                    <span>Date: </span>
                    <input type="date" pattern="\d{4}-\d{2}-\d{2}" disabled="true" class="expense-input modal-input" v-model="localSelectedDate">
                  </div>
                </div>
                <div class="center-pagination">
                  <nav aria-label="Page navigation example">
                    <ul class="pagination">
                      <li class="page-item">
                        <a class="page-link" @click="decrementExpenseInstanceIndex">&lt;&lt; Previous</a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" @click="incrementExpenseInstanceIndex">Next &gt;&gt;</a>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
              <div class="tab-pane fade" :class="localSelectedInstance.expense.length === 0? 'show active' : ''"  id="income-data" role="tabpanel" aria-labelledby="income-data-tab" v-if="localSelectedInstance.income.length > 0">
                <div class="income-expense-input">
                  <div class="income-expense-row">
                    <span>Source: </span>
                    <input type="text" class="expense-input modal-input" v-model="localSelectedInstance.income[incomeInstanceIndex].source">
                  </div>
                  <div class="income-expense-row">
                    <span>Amount($): </span>
                    <input type="number" class="expense-input modal-input" v-model="localSelectedInstance.income[incomeInstanceIndex].amount">
                  </div>
                  <div class="income-expense-row">
                    <span>Date: </span>
                    <input type="date" pattern="\d{4}-\d{2}-\d{2}" disabled="true" class="expense-input modal-input" v-model="localSelectedDate">
                  </div>
                </div>
                <div class="center-pagination">
                  <nav aria-label="Page navigation example">
                    <ul class="pagination">
                      <li class="page-item">
                        <a class="page-link" @click="incrementExpenseInstanceIndex">&lt;&lt; Previous</a>
                      </li>
                      <li class="page-item">
                        <a class="page-link" @click="decrementIncomeInstanceIndex">Next &gt;&gt;</a>
                      </li>
                    </ul>
                  </nav>
                </div>

              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeInstanceModal">Close</button>
            <button type="button" class="btn btn-primary" @click="modifyInstance">Save changes</button>
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
#instanceTabs {
  padding-left: 0px !important;
}
</style>
<script>
import budgetTableAPI from '../services/budget-table-service';
export default {
    props: [
        'selectedInstance',
        'selectedDate'
    ],
    data() {
        return {
            expenseInstanceIndex: 0,
            incomeInstanceIndex: 0,
            localSelectedInstance: {
                income: [],
                expense: []
            }
        };
    },
    mounted() {
        this.onShow();
    },
    methods: {
        async createExpense(){
            try {
            let body = {
                    expenses: this.localHeaderExpense,
                    amount: this.localHeaderAmount,
                    start_date: this.localSelectedDate,
                    frequency: this.options.findIndex(x => this.localSelectedClassHeader === x.class),
                    category: this.localSelectedOptionCategoryHeader.id
                };
                let response = await expenseAPI.create(body);
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
            this.expenseInstanceIndex = 0;
            this.incomeInstanceIndex = 0;
            this.localSelectedDate = this.selectedDate;
            this.localSelectedInstance = this.selectedInstance;
        },
        incrementExpenseInstanceIndex(){
            if(this.expenseInstanceIndex === this.localSelectedInstance.expense.length - 1){
            return;
            }
            this.expenseInstanceIndex++;
        },
        decrementExpenseInstanceIndex(){
            if(this.expenseInstanceIndex === 0){
            return;
            }
            this.expenseInstanceIndex--;
        },
        incrementIncomeInstanceIndex(){
            if(this.incomeInstanceIndex === this.localSelectedInstance.income.length - 1){
            return;
            }
            this.incomeInstanceIndex++;
        },
        decrementIncomeInstanceIndex(){
            if(this.incomeInstanceIndex === 0){
            return;
            }
            this.incomeInstanceIndex--;
        },
      async modifyInstance(){
        try {
        let body = {
              date: this.localSelectedDate,
              income: this.localSelectedInstance.income,
              expense: this.localSelectedInstance.expense
            };
            let response = await budgetTableAPI.updateBudgets(body);
            if (response.success) {
                this.$emit('modal-closed');
            } else {
              console.error(response.message);
            }
        } catch (exception) {
          console.error(exception);
        }
      },
    },
};
</script>