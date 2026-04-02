import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Document as DocumentModel } from '../../models/document.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  constructor(private api: ApiService) {}

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
    return this.api.uploadFile<DocumentModel>('/documents/upload', formData);
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
