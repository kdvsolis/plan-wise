import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient) {}

  async get(url: string, headersJson: any, queryJson: any, params: string) {
    const query = Object.keys(queryJson).length > 0 ? '?' + new HttpParams({ fromObject: queryJson }).toString() : '';
    const headers = new HttpHeaders({ ...{ 'Content-Type': 'application/json' }, ...headersJson });
    return this.http.get(url + params + query, { headers }).toPromise();
  }

  async post(url: string, headersJson: any, queryJson: any, params: string, body: any) {
    const query = Object.keys(queryJson).length > 0 ? '?' + new HttpParams({ fromObject: queryJson }).toString() : '';
    const headers = new HttpHeaders({ ...{ 'Content-Type': 'application/json' }, ...headersJson });
    return this.http.post(url + params + query, body, { headers }).toPromise();
  }

  async patch(url: string, headersJson: any, queryJson: any, params: string, body: any) {
    const query = Object.keys(queryJson).length > 0 ? '?' + new HttpParams({ fromObject: queryJson }).toString() : '';
    const headers = new HttpHeaders({ ...{ 'Content-Type': 'application/json' }, ...headersJson });
    return this.http.patch(url + params + query, body, { headers }).toPromise();
  }

  async put(url: string, headersJson: any, queryJson: any, params: string, body: any) {
    const query = Object.keys(queryJson).length > 0 ? '?' + new HttpParams({ fromObject: queryJson }).toString() : '';
    const headers = new HttpHeaders({ ...{ 'Content-Type': 'application/json' }, ...headersJson });
    return this.http.put(url + params + query, body, { headers }).toPromise();
  }

  async delete(url: string, headersJson: any, queryJson: any, params: string, body: any) {
    const query = Object.keys(queryJson).length > 0 ? '?' + new HttpParams({ fromObject: queryJson }).toString() : '';
    const headers = new HttpHeaders({ ...{ 'Content-Type': 'application/json' }, ...headersJson });
    return this.http.delete(url + params + query, { headers }).toPromise();
  }
}
