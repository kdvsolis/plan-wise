<template>
    <div class="modal fade" id="notesModal" ref="notesModal" tabindex="-1" aria-labelledby="notesModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="notesModalLabel">Notes</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
            <div class="modal-body">
                <label for="notesTextArea" class="form-label">{{localSelectedDate}}</label>
                <textarea class="form-control" id="notesTextArea" rows="3" v-model="localCurrentNotes.notes"></textarea>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary" @click="saveNotes(selectedDate)">Save changes</button>
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
import notesAPI from '../services/notes-service';
export default {
    props: [
        'currentNotes',
        'selectedDate'
    ],
    data() {
        return {
            localCurrentNotes: this.currentNotes,
            localSelectedDate: this.selectedDate
        };
    },
    mounted() {
        this.onShow();
    },
    methods: {
        onShow(){
            this.localSelectedDate = this.selectedDate;
            this.localCurrentNotes = this.currentNotes;
        },
        async saveNotes(date){
            if(!this.currentNotes.id){
                await notesAPI.create({
                    date: date,
                    notes: this.localCurrentNotes.notes
                });
            } else{
                this.localCurrentNotes.date = date;
                await notesAPI.updateByDate(date, this.localCurrentNotes)
            }
            this.$emit('modal-closed');
        },
    },
};
</script>