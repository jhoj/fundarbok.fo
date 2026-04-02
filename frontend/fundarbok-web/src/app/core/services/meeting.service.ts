import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meeting, MeetingDetail, MeetingParticipant, CreateMeetingRequest, UpdateMeetingRequest, UpdateMeetingStatusRequest, AgendaItem, CreateAgendaItemRequest, UpdateAgendaItemRequest, ReorderAgendaItemsRequest } from '../../models/meeting.model';
import { ApiService } from './api.service';

export interface MeetingFilter {
  committeeId?: string;
  startDate?: string;
  endDate?: string;
  isCompleted?: boolean;
  isApproved?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  constructor(private api: ApiService) {}

  getMeetings(filters?: MeetingFilter): Observable<Meeting[]> {
    let params = new HttpParams();
    if (filters?.committeeId) params = params.set('committeeId', filters.committeeId);
    if (filters?.startDate) params = params.set('startDate', filters.startDate);
    if (filters?.endDate) params = params.set('endDate', filters.endDate);
    if (filters?.isCompleted !== undefined) params = params.set('isCompleted', filters.isCompleted.toString());
    if (filters?.isApproved !== undefined) params = params.set('isApproved', filters.isApproved.toString());
    return this.api.get<Meeting[]>('/meetings', { params });
  }

  getMeeting(id: string): Observable<Meeting> {
    return this.api.get<Meeting>(`/meetings/${id}`);
  }

  getMeetingById(id: string): Observable<MeetingDetail> {
    return this.api.get<MeetingDetail>(`/meetings/${id}/details`);
  }

  getMeetingDetail(id: string): Observable<MeetingDetail> {
    return this.api.get<MeetingDetail>(`/meetings/${id}/details`);
  }

  createMeeting(request: CreateMeetingRequest): Observable<Meeting> {
    return this.api.post<Meeting>('/meetings', request);
  }

  updateMeeting(id: string, request: UpdateMeetingRequest): Observable<Meeting> {
    return this.api.put<Meeting>(`/meetings/${id}`, request);
  }

  deleteMeeting(id: string): Observable<any> {
    return this.api.delete(`/meetings/${id}`);
  }

  updateStatus(id: string, request: UpdateMeetingStatusRequest): Observable<Meeting> {
    return this.api.patch<Meeting>(`/meetings/${id}/status`, request);
  }

  getMeetingsByCommittee(committeeId: string): Observable<Meeting[]> {
    return this.api.get<Meeting[]>(`/meetings/committee/${committeeId}`);
  }

  getParticipants(meetingId: string): Observable<MeetingParticipant[]> {
    return this.api.get<MeetingParticipant[]>(`/meetings/${meetingId}/participants`);
  }

  addParticipant(meetingId: string, participantData: any): Observable<MeetingParticipant> {
    return this.api.post<MeetingParticipant>(`/meetings/${meetingId}/participants`, participantData);
  }

  removeParticipant(meetingId: string, participantId: string): Observable<any> {
    return this.api.delete(`/meetings/${meetingId}/participants/${participantId}`);
  }

  // Agenda Items
  getAgendaItems(meetingId: string): Observable<AgendaItem[]> {
    return this.api.get<AgendaItem[]>(`/agendaitems/meeting/${meetingId}`);
  }

  getAgendaItem(id: string): Observable<AgendaItem> {
    return this.api.get<AgendaItem>(`/agendaitems/${id}`);
  }

  createAgendaItem(meetingId: string, request: CreateAgendaItemRequest): Observable<AgendaItem> {
    return this.api.post<AgendaItem>(`/agendaitems/meeting/${meetingId}`, request);
  }

  updateAgendaItem(id: string, request: UpdateAgendaItemRequest): Observable<AgendaItem> {
    return this.api.put<AgendaItem>(`/agendaitems/${id}`, request);
  }

  deleteAgendaItem(id: string): Observable<any> {
    return this.api.delete(`/agendaitems/${id}`);
  }

  reorderAgendaItems(meetingId: string, request: ReorderAgendaItemsRequest): Observable<any> {
    return this.api.post(`/agendaitems/meeting/${meetingId}/reorder`, request);
  }
}
