import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';

export interface CreateConclusionRequest {
  text: string;
}

export interface UpdateConclusionRequest {
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConclusionService {
  private readonly baseUrl = '/api/conclusions';

  constructor(
    private http: HttpClient,
    private apiService: ApiService
  ) {}

  getByAgendaItemId(agendaItemId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/agenda-item/${agendaItemId}`);
  }

  getById(id: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(agendaItemId: string, request: CreateConclusionRequest): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/agenda-item/${agendaItemId}`, request);
  }

  update(id: string, request: UpdateConclusionRequest): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
