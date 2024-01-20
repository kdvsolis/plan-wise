import { Component } from '@angular/core';
import { AccountService } from '../../../services/account.service';
import { StorageHandler as storageHandler } from '../../../utils/storage.handler';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['../../../assets/components.css', '../../../assets/budgeting-app.css']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  success = false;
  error = false;

  constructor(private accountService: AccountService) {}

  async submitForm() {
    if (this.password === this.confirmPassword) {
      const response: any = await this.accountService.register({
        name: this.name,
        username: this.email,
        password: this.password,
      });
      if (response.success) {
        this.error = false;
        this.success = true;
      } else {
        this.success = false;
        this.error = true;
      }
    } else {
      this.success = false;
      this.error = true;
    }
  }
}