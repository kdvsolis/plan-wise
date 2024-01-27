import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css', '../../../assets/components.css', '../../../assets/budgeting-app.css']
})

export class ConfirmationModalComponent implements OnInit {
  @Input() headerMessage = '';
  @Input() confirmationAction: () => void = () => { this.callback(this.index); };
  @Input() actionMessage = '';
  @Input() actionClass = '';
  @Input() bodyMessage = '';
  @ViewChild('confirmationModal') confirmationModal!: ElementRef;
  displayErrorMessage = false;
  callback: any;
  index: any;
  modalInstance: any;

  ngOnInit(): void {}

  open() {
    this.modalInstance = new bootstrap.Modal(this.confirmationModal.nativeElement);
    this.modalInstance.show();
  }

  close() {
    this.modalInstance.hide();
  }

  showErrorMessage() {
    this.displayErrorMessage = true;
  }

  changeModalMessage(newHeaderMessage: string, newBodyMessage: string, newActionMessage: string, callback: any, index: any) {
    this.actionMessage = newActionMessage;
    this.headerMessage = newHeaderMessage;
    this.bodyMessage = newBodyMessage;
    console.log(newHeaderMessage.split(" ")[0])
    this.actionClass = newHeaderMessage.split(" ")[0] === "Delete"? "btn btn-danger" : "";
    this.callback = callback;
    this.index = index;
  }  
}
