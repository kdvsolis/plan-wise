// mixin.js
export default {
    data() {
        return {        
            selectedOptionCategoryHeader: { category_name: 'Select Category' },
            selectedClassCategoryHeader: '',
            selectedOptionHeader: 'Select Interval',
            selectedClassHeader: '',
            selectedOption: 'Select Interval',
            selectedClass: '',
            headerSource: '',
            headerAmount: 0,
            headerExpense: '',
            headerDate: new Date(),
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
    methods: {
        selectOptionHeader(option) {
          this.selectedOptionHeader = option.text;
          this.selectedClassHeader = option.class;
        },
        selectOptionInstance(type, index) {
          this.selectedInstance[type].frequency = index;
        },
        selectCategoryHeader(category) {
          this.selectedOptionCategoryHeader = category;
          this.selectedClassCategoryHeader = category.category_name === 'Select Category'? '' : 'btn-primary';
        },
    },
};