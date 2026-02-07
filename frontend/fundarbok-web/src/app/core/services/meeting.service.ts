import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Meeting, MeetingDetail, MeetingParticipant, CreateMeetingRequest, UpdateMeetingRequest, UpdateMeetingStatusRequest, AgendaItem, CreateAgendaItemRequest, UpdateAgendaItemRequest, ReorderAgendaItemsRequest } from '../../models/meeting.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  constructor(private api: ApiService) {}

  getMeetings(params?: any): Observable<Meeting[]> {
    return this.api.get<Meeting[]>('/Meetings', { params });
  }

  getMeeting(id: string): Observable<Meeting> {
    return this.api.get<Meeting>(`/Meetings/${id}`);
  }

  getMeetingDetail(id: string): Observable<MeetingDetail> {
    return this.api.get<MeetingDetail>(`/Meetings/${id}/details`);
  }

  createMeeting(request: CreateMeetingRequest): Observable<Meeting> {
    return this.api.post<Meeting>('/Meetings', request);
  }

  updateMeeting(id: string, request: UpdateMeetingRequest): Observable<Meeting> {
    return this.api.put<Meeting>(`/Meetings/${id}`, request);
  }

  deleteMeeting(id: string): Observable<any> {
    return this.api.delete(`/Meetings/${id}`);
  }

  updateStatus(id: string, request: UpdateMeetingStatusRequest): Observable<Meeting> {
    return this.api.patch<Meeting>(`/Meetings/${id}/status`, request);
  }

  getMeetingsByCommittee(committeeId: string): Observable<Meeting[]> {
    return this.api.get<Meeting[]>(`/Meetings/committee/${committeeId}`);
  }

  getParticipants(meetingId: string): Observable<MeetingParticipant[]> {
    return this.api.get<MeetingParticipant[]>(`/Meetings/${meetingId}/participants`);
  }

  addParticipant(meetingId: string, participantData: any): Observable<MeetingParticipant> {
    return this.api.post<MeetingParticipant>(`/Meetings/${meetingId}/participants`, participantData);
  }

  removeParticipant(meetingId: string, participantId: string): Observable<any> {
    return this.api.delete(`/Meetings/${meetingId}/participants/${participantId}`);
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
