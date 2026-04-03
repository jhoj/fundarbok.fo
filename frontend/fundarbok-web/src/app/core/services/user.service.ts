import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

export interface UserListDto {
  id: string;
  name: string;
  email: string;
  role: string;
  committeeMemberId?: string;
  committeeMemberName?: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  committeeMemberId?: string;
}

export interface UpdateUserRequest {
  name: string;
  email: string;
  role: string;
  committeeMemberId?: string;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private api: ApiService) {}

  getUsers(): Observable<UserListDto[]> {
    return this.api.get<UserListDto[]>('/Users');
  }

  getUser(id: string): Observable<UserListDto> {
    return this.api.get<UserListDto>(`/Users/${id}`);
  }

  createUser(request: CreateUserRequest): Observable<UserListDto> {
    return this.api.post<UserListDto>('/Users', request);
  }

  updateUser(id: string, request: UpdateUserRequest): Observable<UserListDto> {
    return this.api.put<UserListDto>(`/Users/${id}`, request);
  }

  deleteUser(id: string): Observable<any> {
    return this.api.delete(`/Users/${id}`);
  }
}
