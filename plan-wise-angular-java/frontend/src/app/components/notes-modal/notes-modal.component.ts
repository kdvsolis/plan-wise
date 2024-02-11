import { Component, Input, OnInit, ViewChild, ElementRef  } from '@angular/core';
import * as bootstrap from 'bootstrap';
import { NoteService } from '../../../services/notes.service';

@Component({
  selector: 'app-notes-modal',
  templateUrl: './notes-modal.component.html',
  styleUrls: ['./notes-modal.component.css', '../../../assets/components.css', '../../../assets/budgeting-app.css']
})
export class NotesModalComponent {

  @Input() currentNotes: any;
  @Input() selectedDate: string = '';
  @ViewChild('notesModal') notesModal!: ElementRef;
  localCurrentNotes: any;
  localSelectedDate: string = '';
  modalInstance: any;

  constructor(private notesService: NoteService) { }

  ngOnInit(): void {
    this.localCurrentNotes = this.currentNotes;
    this.localSelectedDate = this.selectedDate;
  }

  open() {
    this.modalInstance = new bootstrap.Modal(this.notesModal.nativeElement);
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
  }

  async saveNotes(date: string): Promise<void> {
    if (!this.currentNotes.id) {
      await this.notesService.create({
        date: date,
        notes: this.localCurrentNotes.notes
      });
    } else {
      await this.notesService.updateByDate(date, this.localCurrentNotes);
    }
  }
}
