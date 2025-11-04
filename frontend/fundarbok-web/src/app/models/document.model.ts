export interface Document {
  id: string;
  agendaItemId?: string;
  meetingId?: string;
  name: string;
  description?: string;
  filePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  number: number;
  isPublic: boolean;
  isLocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentRequest {
  name: string;
  description?: string;
  agendaItemId?: string;
  meetingId?: string;
  file: File;
  number?: number;
}

export interface UpdateDocumentRequest {
  name: string;
  description?: string;
  isPublic: boolean;
  isLocked: boolean;
}
