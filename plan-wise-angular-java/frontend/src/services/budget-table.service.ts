import { Injectable } from '@angular/core';
import { ApiService } from '../utils/api.service';
import { StorageHandler as storageHandler } from '../utils/storage.handler';

@Injectable({
  providedIn: 'root'
})
export class BudgetTableService {
  constructor(private apiService: ApiService) {}

  async create(body: any) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.post('/api/budgets/', headers, {}, '', body);
  }

  async get(id: string) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.get(`/api/budgets/${id}`, headers, {}, '');
  }

  async update(id: string, body: any) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.put(`/api/budgets/${id}`, headers, {}, '', body);
  }

  async delete(id: string) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.delete(`/api/budgets/${id}`, headers, {}, '', {});
  }

  async bulkCreate(body: any) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.post('/api/bulk_create_budgets', headers, {}, '', body);
  }

  async getStartDates() {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.get('/api/budgets_start_dates', headers, {}, '');
  }

  async getBudgetsInDateRange(start_date_str: string) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    const query = start_date_str ? { start_date_str: start_date_str } : {};
    return this.apiService.get('/api/get_budgets_in_date_range', headers, query, '');
  }

  async updateBudgets(body: any) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.put('/api/update_budgets', headers, {}, '', body);
  }
}
