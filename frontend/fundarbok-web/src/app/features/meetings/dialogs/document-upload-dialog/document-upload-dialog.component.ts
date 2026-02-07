import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DocumentService } from '../../../../core/services/document.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface DocumentUploadDialogData {
  agendaItemId?: string;
  meetingId?: string;
}

@Component({
  selector: 'app-document-upload-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatSnackBarModule
  ],
  templateUrl: './document-upload-dialog.component.html',
  styleUrls: ['./document-upload-dialog.component.scss']
})
export class DocumentUploadDialogComponent {
  uploadForm: FormGroup;
  selectedFiles: File[] = [];
  isDragging = false;
  isUploading = false;
  uploadProgress = 0;

  // File validation constants
  readonly MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
  readonly ALLOWED_TYPES = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ];

  constructor(
    private fb: FormBuilder,
    private documentService: DocumentService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<DocumentUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DocumentUploadDialogData
  ) {
    this.uploadForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      isPublic: [false]
    });
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files) {
      this.handleFiles(Array.from(files));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.handleFiles(Array.from(input.files));
    }
  }

  handleFiles(files: File[]): void {
    for (const file of files) {
      if (!this.validateFile(file)) {
        continue;
      }

      // Check if file already added
      if (!this.selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
        this.selectedFiles.push(file);

        // Auto-fill name from first file if empty
        if (!this.uploadForm.get('name')?.value && this.selectedFiles.length === 1) {
          this.uploadForm.patchValue({ name: file.name });
        }
      }
    }
  }

  validateFile(file: File): boolean {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      this.snackBar.open(`File ${file.name} exceeds max size of 50MB`, 'Close', { duration: 3000 });
      return false;
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      this.snackBar.open(`File type ${file.type} not allowed for ${file.name}`, 'Close', { duration: 3000 });
      return false;
    }

    return true;
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  async onSubmit(): Promise<void> {
    if (this.uploadForm.invalid || this.selectedFiles.length === 0) {
      this.snackBar.open('Please fill required fields and select at least one file', 'Close', { duration: 3000 });
      return;
    }

    this.isUploading = true;
    const uploadedDocuments = [];

    try {
      // Upload each file
      for (let i = 0; i < this.selectedFiles.length; i++) {
        const file = this.selectedFiles[i];
        this.uploadProgress = ((i + 1) / this.selectedFiles.length) * 100;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', this.uploadForm.value.name || file.name);
        formData.append('description', this.uploadForm.value.description || '');
        formData.append('isPublic', this.uploadForm.value.isPublic.toString());

        if (this.data.agendaItemId) {
          formData.append('agendaItemId', this.data.agendaItemId);
        }
        if (this.data.meetingId) {
          formData.append('meetingId', this.data.meetingId);
        }

        const document = await this.documentService.uploadDocument(formData).toPromise();
        uploadedDocuments.push(document);
      }

      this.snackBar.open(`Successfully uploaded ${uploadedDocuments.length} document(s)`, 'Close', { duration: 3000 });
      this.dialogRef.close(uploadedDocuments);
    } catch (error) {
      console.error('Upload error:', error);
      this.snackBar.open('Failed to upload documents', 'Close', { duration: 3000 });
    } finally {
      this.isUploading = false;
      this.uploadProgress = 0;
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
