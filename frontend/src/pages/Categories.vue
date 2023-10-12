<template>
    <div class="uui-page-padding">
        <div class="uui-container-large">
        <div class="uui-padding-vertical-xhuge">
            <div class="uui-text-align-center">
            <div class="uui-max-width-large align-center">
                <h2 class="uui-heading-medium">Categories</h2>
                <div class="uui-space-xsmall"></div>
                <div class="uui-text-size-large">Add and manage your expense <strong>categories</strong>
                <strong></strong>
                </div>
                <button class="button w-button" @click="inputToggle">+</button>
            </div>
            </div>
            <div class="uui-table">
                <div class="uui-table_heading-row">
                    <div class="uui-table_heading-row-text">Category Name</div>
                    <div class="uui-table_heading-row-text">Monthly Average</div>
                    <div class="uui-table_heading-row-text">Action</div>
                </div>
                <input 
                    v-if="showInput" 
                    id="new-category" 
                    v-model="newCategory" 
                    type="text" 
                    class="w-layout-grid uui-table_row new-row uui-table_feature uui-pricing07_row-lead-text w-100"
                    v-on:keyup.enter="createCategory"
                >
                <li v-for="(category, index) in categories" :key="category.id" :class="getClass(index)">
                    <div class="w-layout-grid uui-table_row" :class="getClass(index)">
                        <div class="uui-table_feature">
                            <div class="uui-pricing07_row-lead-text">                                
                                <input type="text" class="expense-input" v-model="categories[index].category_name">
                            </div>
                        </div>
                        <div class="uui-table_row">
                            <div class="uui-pricing07_row-lead-text">   
                                ${{ category.average_monthly_expense.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 2, maximumFractionDigits: 2 }) }}
                            </div>
                        </div>
                        <div class="uui-table_row">
                            <div class="action">
                                <button type="button" class="btn btn-warning" @click="updateCategory(index)">Save</button>
                                <button type="button" class="btn btn-danger" @click="deleteCategory(index)">Delete</button>
                            </div>
                        </div>
                    </div>
                </li>
            </div>
        </div>
        </div>
    </div>
</template>
  
<script>
import category from '../services/category-service';
export default {
    data() {
        return {
            categories: [],
            newCategory: "",
            showInput: false
        }
    },
    mounted() {
        document.title = "Plan Wise - Categories";
        this.fetchCategories();
    },
    methods: {
        async fetchCategories() {
            try {
                let response = await category.getAll();
                this.categories = response.category || [];
            } catch(exception){
                console.log(exception);
            }
        },
        async createCategory() {
            if (this.newCategory) {
                let body = {
                    category_name: this.newCategory
                };
                try {
                    let response = await category.create(body);
                    if (response.success) {
                        this.categories.push({
                            id: response.category.id,
                            category_name: this.newCategory,
                            average_monthly_expense: 0
                        });
                        this.newCategory = "";
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
        async inputToggle(){
            this.showInput = !this.showInput;
        },
        async updateCategory(index){
            await category.update(this.categories[index].id, {
                category_name: this.categories[index].category_name
            })
        },
        async deleteCategory(index){
            let response = await category.delete(this.categories[index].id)
            if(response.success){
                this.categories.splice(index, 1);
            }
        }
    },
    computed: {
        getClass(index) {
            return (index) => {
                return {
                    "background-color-gray50": index % 2 === 1,
                    "no-bullet": true
                }
            }
        }
    }
} 
</script>
  
<style scoped>
@import '../assets/components.css';
@import '../assets/budgeting-app.css';
.no-bullet {
    list-style: none;
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
.action{
  display: flex;
  flex-direction: row;
  column-gap: 10px;
}
</style>