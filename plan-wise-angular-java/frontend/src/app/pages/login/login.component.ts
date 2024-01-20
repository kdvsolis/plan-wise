import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { StorageHandler as storageHandler } from '../../../utils/storage.handler';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['../../../assets/components.css', '../../../assets/budgeting-app.css']
})
export class LoginComponent {
  username: string|null = '';
  password: string|null  = '';
  error: string|null  = '';
  token: string|null  = '';

  constructor(private router: Router, private accountService: AccountService) {
    this.token = storageHandler.localStorageGet('token');
    if (this.token) {
      this.router.navigate(['/']);
    }
  }

  async submitForm() {
    const response: any = await this.accountService.login({ username: this.username, password: this.password });
    if (response.success) {
      storageHandler.localStorageSet('token', response.token);
      this.token = response.token;
      this.router.navigate(['/']);
    } else {
      this.error = response.message;
    }
  }
}
