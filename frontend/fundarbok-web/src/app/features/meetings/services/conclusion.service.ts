import { Injectable } from '@angular/core';
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
  constructor(private apiService: ApiService) {}

  getByAgendaItemId(agendaItemId: string): Observable<any[]> {
    return this.apiService.get<any[]>(`/conclusions/agenda-item/${agendaItemId}`);
  }

  getById(id: string): Observable<any> {
    return this.apiService.get<any>(`/conclusions/${id}`);
  }

  create(agendaItemId: string, request: CreateConclusionRequest): Observable<any> {
    return this.apiService.post<any>(`/conclusions/agenda-item/${agendaItemId}`, request);
  }

  update(id: string, request: UpdateConclusionRequest): Observable<any> {
    return this.apiService.put<any>(`/conclusions/${id}`, request);
  }

  delete(id: string): Observable<void> {
    return this.apiService.delete<void>(`/conclusions/${id}`);
  }
}
