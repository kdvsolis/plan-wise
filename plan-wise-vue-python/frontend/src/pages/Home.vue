<template>
    <div class="container d-flex align-items-center justify-content-center">
        <section class="uui-section_cta05">
            <div class="uui-page-padding-3">
            <div class="uui-container-large-3">
                <div class="uui-padding-vertical-xhuge-3">
                <div class="uui-cta05_component">
                    <div class="uui-cta05_content">
                    <div class="uui-max-width-large-3">
                        <h3 class="uui-heading-small">Setup your Budget</h3>
                        <div class="uui-space-xsmall-3"></div>
                        <div class="uui-text-size-large-3">Add your expenses and income</div>
                    </div>
                    </div>
                    <div class="uui-button-row-2 is-reverse-mobile-landscape">
                    <div class="uui-button-wrapper-2 max-width-full-mobile-landscape">
                        <a href="/expenses" class="uui-button-secondary-gray-3 w-inline-block">
                        <div>Expenses</div>
                        </a>
                    </div>
                    <div class="uui-button-wrapper-2 max-width-full-mobile-landscape">
                        <a href="/income" class="uui-button-secondary-gray-3 w-inline-block">
                        <div>Income</div>
                        </a>
                    </div>
                    <div class="uui-button-wrapper-2 max-width-full-mobile-landscape">
                        <a href="/budget-table" class="uui-button-3 w-inline-block">
                        <div>Budget Table</div>
                        </a>
                    </div>
                    <div class="uui-button-wrapper-2 max-width-full-mobile-landscape">
                        <a href="/budget-calendar" class="uui-button-3 w-inline-block">
                        <div>Budget Calendar</div>
                        </a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            
        }
    },
    mount(){
        document.title = "Plan Wise - Home";
    },
    methods: {
        submitForm() {
        
        }
    }
}
</script>
  
<style scoped>
@import '../assets/components.css';
@import '../assets/budgeting-app.css';
</style>