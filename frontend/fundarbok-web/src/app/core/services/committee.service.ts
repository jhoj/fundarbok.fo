import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Committee, CommitteeMember, CreateCommitteeRequest, UpdateCommitteeRequest, CreateCommitteeMemberRequest, UpdateCommitteeMemberRequest } from '../../models/committee.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class CommitteeService {
  constructor(private api: ApiService, private http: HttpClient) {}

  getCommittees(): Observable<Committee[]> {
    return this.api.get<Committee[]>('/Committees');
  }

  getCommittee(id: string): Observable<Committee> {
    return this.api.get<Committee>(`/Committees/${id}`);
  }

  createCommittee(request: CreateCommitteeRequest): Observable<Committee> {
    return this.api.post<Committee>('/Committees', request);
  }

  updateCommittee(id: string, request: UpdateCommitteeRequest): Observable<Committee> {
    return this.api.put<Committee>(`/Committees/${id}`, request);
  }

  deleteCommittee(id: string): Observable<any> {
    return this.api.delete(`/Committees/${id}`);
  }

  getMembers(committeeId: string): Observable<CommitteeMember[]> {
    return this.api.get<CommitteeMember[]>(`/Committees/${committeeId}/members`);
  }

  addMember(committeeId: string, request: CreateCommitteeMemberRequest): Observable<CommitteeMember> {
    return this.api.post<CommitteeMember>(`/Committees/${committeeId}/members`, request);
  }

  updateMember(committeeId: string, memberId: string, request: UpdateCommitteeMemberRequest): Observable<CommitteeMember> {
    return this.api.put<CommitteeMember>(`/Committees/${committeeId}/members/${memberId}`, request);
  }

  removeMember(committeeId: string, memberId: string): Observable<any> {
    return this.api.delete(`/Committees/${committeeId}/members/${memberId}`);
  }
}
