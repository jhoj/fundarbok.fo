import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  private readonly baseUrl = '/api/notes';

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  getByAgendaItemId(agendaItemId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agenda-item/${agendaItemId}`);
  }

  getMyNotes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/my`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(agendaItemId: string, request: CreateNoteRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/agenda-item/${agendaItemId}`, request);
  }

  update(id: string, request: UpdateNoteRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
