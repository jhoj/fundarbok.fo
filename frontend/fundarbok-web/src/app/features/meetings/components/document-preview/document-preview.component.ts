import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
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
    MatProgressSpinnerModule,
    MatTooltipModule,
    NgxExtendedPdfViewerModule
  ],
  templateUrl: './document-preview.component.html',
  styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnDestroy {
  document: DocumentModel;
  blobUrl: string | null = null;
  pdfSrc: Uint8Array | null = null;
  textContent: string | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private documentService: DocumentService,
    public dialogRef: MatDialogRef<DocumentPreviewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { document: DocumentModel }
  ) {
    this.document = data.document;
    this.loadDocument();
  }

  ngOnDestroy(): void {
    if (this.blobUrl) {
      URL.revokeObjectURL(this.blobUrl);
    }
  }

  loadDocument(): void {
    this.isLoading = true;
    this.error = null;

    this.documentService.previewDocument(this.document.id).subscribe({
      next: (blob) => {
        if (this.isPDF()) {
          blob.arrayBuffer().then(buffer => {
            this.pdfSrc = new Uint8Array(buffer);
            this.isLoading = false;
          });
        } else if (this.isText()) {
          blob.text().then(text => {
            this.textContent = text;
            this.isLoading = false;
          });
        } else if (this.isImage()) {
          this.blobUrl = URL.createObjectURL(blob);
          this.isLoading = false;
        } else {
          this.isLoading = false;
        }
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

  isText(): boolean {
    const textTypes = ['text/plain', 'text/csv', 'text/html', 'text/xml', 'application/json'];
    return textTypes.includes(this.document.mimeType);
  }

  close(): void {
    this.dialogRef.close();
  }
}
