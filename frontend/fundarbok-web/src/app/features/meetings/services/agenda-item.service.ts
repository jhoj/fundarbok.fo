import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  AgendaItem,
  AgendaItemDetail,
  CreateAgendaItemRequest,
  UpdateAgendaItemRequest,
  ReorderAgendaItemsRequest
} from '../../../models/meeting.model';

@Injectable({
  providedIn: 'root'
})
export class AgendaItemService {
  constructor(private api: ApiService) {}

  getAgendaItems(meetingId: string): Observable<AgendaItemDetail[]> {
    return this.api.get<AgendaItemDetail[]>(`/agendaitems/meeting/${meetingId}`);
  }

  getAgendaItemById(id: string): Observable<AgendaItemDetail> {
    return this.api.get<AgendaItemDetail>(`/agendaitems/${id}`);
  }

  createAgendaItem(meetingId: string, request: CreateAgendaItemRequest): Observable<AgendaItem> {
    return this.api.post<AgendaItem>(`/agendaitems/meeting/${meetingId}`, request);
  }

  updateAgendaItem(id: string, request: UpdateAgendaItemRequest): Observable<AgendaItem> {
    return this.api.put<AgendaItem>(`/agendaitems/${id}`, request);
  }

  deleteAgendaItem(id: string): Observable<boolean> {
    return this.api.delete<boolean>(`/agendaitems/${id}`);
  }

  reorderAgendaItems(meetingId: string, request: ReorderAgendaItemsRequest): Observable<boolean> {
    return this.api.post<boolean>(`/agendaitems/meeting/${meetingId}/reorder`, request);
  }
}
