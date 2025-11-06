import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  Meeting,
  MeetingDetail,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  UpdateMeetingStatusRequest,
  MeetingParticipant,
  AddParticipantRequest
} from '../../../models/meeting.model';

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
  constructor(private api: ApiService, private http: HttpClient) {}

  getMeetings(filters?: MeetingFilter): Observable<Meeting[]> {
    let params = new HttpParams();

    if (filters?.committeeId) {
      params = params.set('committeeId', filters.committeeId);
    }
    if (filters?.startDate) {
      params = params.set('startDate', filters.startDate);
    }
    if (filters?.endDate) {
      params = params.set('endDate', filters.endDate);
    }
    if (filters?.isCompleted !== undefined) {
      params = params.set('isCompleted', filters.isCompleted.toString());
    }
    if (filters?.isApproved !== undefined) {
      params = params.set('isApproved', filters.isApproved.toString());
    }

    return this.http.get<Meeting[]>(`${this.api.baseUrl}/meetings`, { params });
  }

  getMeetingById(id: string): Observable<MeetingDetail> {
    return this.api.get<MeetingDetail>(`/meetings/${id}/details`);
  }

  getMeetingDetail(id: string): Observable<MeetingDetail> {
    return this.api.get<MeetingDetail>(`/meetings/${id}/details`);
  }

  getMeeting(id: string): Observable<Meeting> {
    return this.api.get<Meeting>(`/meetings/${id}`);
  }

  createMeeting(request: CreateMeetingRequest): Observable<Meeting> {
    return this.api.post<Meeting>('/meetings', request);
  }

  updateMeeting(id: string, request: UpdateMeetingRequest): Observable<Meeting> {
    return this.api.put<Meeting>(`/meetings/${id}`, request);
  }

  deleteMeeting(id: string): Observable<boolean> {
    return this.api.delete<boolean>(`/meetings/${id}`);
  }

  updateMeetingStatus(id: string, status: UpdateMeetingStatusRequest): Observable<Meeting> {
    return this.api.patch<Meeting>(`/meetings/${id}/status`, status);
  }

  addParticipant(meetingId: string, request: AddParticipantRequest): Observable<MeetingParticipant> {
    return this.api.post<MeetingParticipant>(`/meetings/${meetingId}/participants`, request);
  }

  removeParticipant(meetingId: string, participantId: string): Observable<boolean> {
    return this.api.delete<boolean>(`/meetings/${meetingId}/participants/${participantId}`);
  }
}
