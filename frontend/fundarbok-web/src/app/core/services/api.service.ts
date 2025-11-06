import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get baseUrl(): string {
    return this.apiUrl;
  }

  get<T>(endpoint: string, options?: { params?: any }): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.get(url, { ...options, observe: 'body' }) as Observable<T>;
  }

  post<T>(endpoint: string, body: any, options?: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.post(url, body, { ...options, observe: 'body' }) as Observable<T>;
  }

  put<T>(endpoint: string, body: any, options?: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.put(url, body, { ...options, observe: 'body' }) as Observable<T>;
  }

  patch<T>(endpoint: string, body: any, options?: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.patch(url, body, { ...options, observe: 'body' }) as Observable<T>;
  }

  delete<T>(endpoint: string, options?: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.delete(url, { ...options, observe: 'body' }) as Observable<T>;
  }

  uploadFile<T>(endpoint: string, formData: FormData, options?: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.post(url, formData, { ...options, observe: 'body' }) as Observable<T>;
  }

  downloadFile(endpoint: string): Observable<Blob> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
