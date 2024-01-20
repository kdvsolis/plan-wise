import { Injectable } from '@angular/core';
import { ApiService } from '../utils/api.service';
import { StorageHandler as storageHandler } from '../utils/storage.handler';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  constructor(private apiService: ApiService) {}

  async create(body: any) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.post('/api/categories', headers, {}, '', body);
  }

  async get(id: string) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.get(`/api/categories/${id}`, headers, {}, '');
  }

  async getAll() {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.get('/api/categories', headers, {}, '');
  }

  async update(id: string, body: any) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.put(`/api/categories/${id}`, headers, {}, '', body);
  }

  async delete(id: string) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.delete(`/api/categories/${id}`, headers, {}, '', {});
  }
}
