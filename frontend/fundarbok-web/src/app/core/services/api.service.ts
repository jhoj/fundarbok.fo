import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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
    return this.http.get<T>(url, options);
  }

  post<T>(endpoint: string, body: any, options?: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.post<T>(url, body, options);
  }

  put<T>(endpoint: string, body: any, options?: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.put<T>(url, body, options);
  }

  patch<T>(endpoint: string, body: any, options?: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.patch<T>(url, body, options);
  }

  delete<T>(endpoint: string, options?: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.delete<T>(url, options);
  }

  uploadFile<T>(endpoint: string, formData: FormData, options?: any): Observable<T> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.post<T>(url, formData, options);
  }

  downloadFile(endpoint: string): Observable<Blob> {
    const url = `${this.apiUrl}${endpoint}`;
    return this.http.get(url, { responseType: 'blob' });
  }
}
