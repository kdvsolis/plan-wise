import { Injectable } from '@angular/core';
import { ApiService } from '../utils/api.service';
import { StorageHandler as storageHandler } from '../utils/storage.handler';

@Injectable({
  providedIn: 'root'
})
export class IncomeService {
  constructor(private apiService: ApiService) {}

  async create(body: any) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.post('/api/income/', headers, {}, '', body);
  }

  async get(id: string) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.get(`/api/income/${id}`, headers, {}, '');
  }

  async getAll() {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.get('/api/income/', headers, {}, '');
  }

  async update(id: string, body: any) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.put(`/api/income/${id}`, headers, {}, '', body);
  }

  async delete(id: string) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.delete(`/api/income/${id}`, headers, {}, '', {});
  }
}
