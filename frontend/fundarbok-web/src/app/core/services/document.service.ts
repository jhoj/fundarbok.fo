import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Document } from '../../models/document.model';
import { ApiService } from './api.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = environment.apiUrl;

  constructor(private api: ApiService, private http: HttpClient) {}

  getDocumentsByAgendaItem(agendaItemId: string): Observable<Document[]> {
    return this.api.get<Document[]>(`/documents/agenda-item/${agendaItemId}`);
  }

  getDocumentsByMeeting(meetingId: string): Observable<Document[]> {
    return this.api.get<Document[]>(`/documents/meeting/${meetingId}`);
  }

  getDocument(id: string): Observable<Document> {
    return this.api.get<Document>(`/documents/${id}`);
  }

  uploadDocument(formData: FormData): Observable<Document> {
    return this.http.post<Document>(`${this.apiUrl}/documents/upload`, formData);
  }

  updateDocument(id: string, request: any): Observable<Document> {
    return this.api.put<Document>(`/documents/${id}`, request);
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
