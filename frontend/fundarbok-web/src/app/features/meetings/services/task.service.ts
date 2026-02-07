import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface CreateTaskRequest {
  description: string;
  assignedUserId: string;
  dueDate?: string;
}

export interface UpdateTaskRequest {
  description: string;
  assignedUserId: string;
  dueDate?: string;
  isCompleted?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly baseUrl = '/api/tasks';

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  getByAgendaItemId(agendaItemId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agenda-item/${agendaItemId}`);
  }

  getMyTasks(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(agendaItemId: string, request: CreateTaskRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/agenda-item/${agendaItemId}`, request);
  }

  update(id: string, request: UpdateTaskRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, request);
  }

  toggleComplete(id: string): Observable<any> {
    return this.http.patch<any>(`${this.baseUrl}/${id}/toggle-complete`, {});
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
