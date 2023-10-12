<template>
    <div class="modal fade" id="confirmationModal" ref="confirmationModal" tabindex="-1" role="dialog" aria-labelledby="confirmationModalLabel" aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="confirmationModalLabel">{{ localHeaderMessage }}</h5>
            <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            {{ localBodyMessage }}
            <div class="alert alert-danger" v-if="displayErrorMessage" role="alert">
                Error occurred in this operation! Please try again
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn" :class="actionClass" @click="confimationAction">{{ actionMessage }}</button>
          </div>
        </div>
      </div>
    </div>
</template>
<style scoped>
@import '../assets/components.css';
@import '../assets/budgeting-app.css';

</style>
<script>
export default {
    props: [
        'headerMessage',
        'confimationAction',
        'actionMessage',
        'actionClass',
        'bodyMessage'
    ],
    data() {
        return {
            localHeaderMessage: '',
            localBodyMessage: '',
            displayErrorMessage: false
        };
    },
    mounted() {
        this.onShow();
    },
    methods: {
        onShow(){
            this.localHeaderMessage = this.headerMesage;
            this.localBodyMessage = this.bodyMessage;
        },
        showErrorMessage(){
            this.displayErrorMessage = true;
        },
        changeModalMessage(){

        }
    }
};
</script>