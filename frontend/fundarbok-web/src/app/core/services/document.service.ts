import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document as DocumentModel } from '../../models/document.model';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;

  constructor(private api: ApiService, private http: HttpClient) {}

  getDocumentsByAgendaItem(agendaItemId: string): Observable<DocumentModel[]> {
    return this.api.get<DocumentModel[]>(`/documents/agenda-item/${agendaItemId}`);
  }

  getDocumentsByMeeting(meetingId: string): Observable<DocumentModel[]> {
    return this.api.get<DocumentModel[]>(`/documents/meeting/${meetingId}`);
  }

  getDocument(id: string): Observable<DocumentModel> {
    return this.api.get<DocumentModel>(`/documents/${id}`);
  }

  uploadDocument(formData: FormData): Observable<DocumentModel> {
    return this.http.post<DocumentModel>(`${this.apiUrl}/documents/upload`, formData);
  }

  updateDocument(id: string, request: any): Observable<DocumentModel> {
    return this.api.put<DocumentModel>(`/documents/${id}`, request);
  }

  deleteDocument(id: string): Observable<any> {
    return this.api.delete(`/documents/${id}`);
  }

  downloadDocument(id: string): Observable<Blob> {
    return this.api.downloadFile(`/documents/${id}/download`);
  }

  previewDocument(id: string): Observable<Blob> {
    return this.api.downloadFile(`/documents/${id}/preview`);
  }
}
