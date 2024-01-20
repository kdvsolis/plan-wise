import { Injectable } from '@angular/core';
import { ApiService } from '../utils/api.service';
import { StorageHandler as storageHandler } from '../utils/storage.handler';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor(private apiService: ApiService) {}

  async create(body: any) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.post('/api/notes', headers, {}, '', body);
  }

  async get(id: string) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.get(`/api/notes/${id}`, headers, {}, '');
  }

  async getByDate(date: string) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.get(`/api/notes?date=${date}`, headers, {}, '');
  }

  async updateByDate(date: string, body: any) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.put(`/api/notes?date=${date}`, headers, {}, '', body);
  }

  async delete(id: string) {
    const headers = { 'Authorization': `Bearer ${storageHandler.localStorageGet('token')}` };
    return this.apiService.delete(`/api/notes/${id}`, headers, {}, '', {});
  }
}
