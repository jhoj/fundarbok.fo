import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface CreateNoteRequest {
  text: string;
}

export interface UpdateNoteRequest {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  constructor(private apiService: ApiService) {}

  getByAgendaItemId(agendaItemId: string): Observable<any[]> {
    return this.apiService.get<any[]>(`/notes/agenda-item/${agendaItemId}`);
  }

  getMyNotes(): Observable<any[]> {
    return this.apiService.get<any[]>('/notes/my');
  }

  getById(id: string): Observable<any> {
    return this.apiService.get<any>(`/notes/${id}`);
  }

  create(agendaItemId: string, request: CreateNoteRequest): Observable<any> {
    return this.apiService.post<any>(`/notes/agenda-item/${agendaItemId}`, request);
  }

  update(id: string, request: UpdateNoteRequest): Observable<any> {
    return this.apiService.put<any>(`/notes/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`/notes/${id}`);
  }
}
