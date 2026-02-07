import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { DocumentService } from '../../../../core/services/document.service';
import { Document as DocumentModel } from '../../../../models/document.model';

@Component({
  selector: 'app-document-preview',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent {
  document: DocumentModel;
  blobUrl: SafeResourceUrl | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private documentService: DocumentService,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<DocumentPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { document: DocumentModel }
  ) {
    this.document = data.document;
    this.loadDocument();
  }

  loadDocument(): void {
    this.isLoading = true;
    this.error = null;

    this.documentService.previewDocument(this.document.id).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        this.blobUrl = this.sanitizer.bypassSecurityTrustResourceUrl(url);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading document:', err);
        this.error = 'Failed to load document';
        this.isLoading = false;
      }
    });
  }

  downloadDocument(): void {
    this.documentService.downloadDocument(this.document.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = this.document.fileName;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Download error:', err);
      }
    });
  }

  isPDF(): boolean {
    return this.document.mimeType === 'application/pdf';
  }

  isImage(): boolean {
    return this.document.mimeType.startsWith('image/');
  }

  close(): void {
    this.dialogRef.close();
  }
}
