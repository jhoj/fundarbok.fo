import { Injectable } from '@angular/core';
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
  constructor(private apiService: ApiService) {}

  getByAgendaItemId(agendaItemId: string): Observable<any[]> {
    return this.apiService.get<any[]>(`/tasks/agenda-item/${agendaItemId}`);
  }

  getMyTasks(): Observable<any[]> {
    return this.apiService.get<any[]>('/tasks/my');
  }

  getById(id: string): Observable<any> {
    return this.apiService.get<any>(`/tasks/${id}`);
  }

  create(agendaItemId: string, request: CreateTaskRequest): Observable<any> {
    return this.apiService.post<any>(`/tasks/agenda-item/${agendaItemId}`, request);
  }

  update(id: string, request: UpdateTaskRequest): Observable<any> {
    return this.apiService.put<any>(`/tasks/${id}`, request);
  }

  toggleComplete(id: string): Observable<any> {
    return this.apiService.patch<any>(`/tasks/${id}/toggle-complete`, {});
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`/tasks/${id}`);
  }
}
