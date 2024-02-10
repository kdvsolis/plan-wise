import { Injectable } from '@angular/core';
import { ApiService } from '../utils/api.service';
import { StorageHandler as storageHandler } from '../utils/storage.handler';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private apiService: ApiService) {}

  async register(body: any) {
    return this.apiService.post('/api/auth/register', {}, {}, '', body);
  }

  async login(body: any) {
    return this.apiService.post('/api/auth/login', {}, {}, '', body);
  }

  async getUser() {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.get('/api/auth/user', headers, {}, '');
  }

  async updateUser(body: any) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.put('/api/auth/user', headers, {}, '', body);
  }
}
