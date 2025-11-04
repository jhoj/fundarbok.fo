import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  Meeting,
  MeetingDetail,
  CreateMeetingRequest,
  UpdateMeetingRequest,
  UpdateMeetingStatusRequest
} from '../../../models/meeting.model';

export interface MeetingFilter {
  committeeId?: string;
  startDate?: string;
  endDate?: string;
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

    return this.http.get<Meeting[]>(`${this.api.baseUrl}/meetings`, { params });
  }

  getMeetingById(id: string): Observable<MeetingDetail> {
    return this.api.get<MeetingDetail>(`/meetings/${id}/details`);
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
}
