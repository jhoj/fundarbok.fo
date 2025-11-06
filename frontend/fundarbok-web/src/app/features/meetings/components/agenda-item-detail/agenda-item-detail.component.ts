import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AgendaItemDetail } from '../../../../models/meeting.model';
import { Document as DocumentModel } from '../../../../models/document.model';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { DocumentListComponent } from '../document-list/document-list.component';

@Component({
  selector: 'app-agenda-item-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    HasRoleDirective,
    TranslatePipe,
    DocumentListComponent
  ],
  templateUrl: './agenda-item-detail.component.html',
  styleUrl: './agenda-item-detail.component.scss'
})
export class AgendaItemDetailComponent {
  @Input() agendaItem: AgendaItemDetail | null = null;
  @Input() canEdit = false;
  @Output() addConclusion = new EventEmitter<void>();
  @Output() addNote = new EventEmitter<void>();
  @Output() addTask = new EventEmitter<void>();
  @Output() printMeeting = new EventEmitter<void>();
  @Output() editAgendaItem = new EventEmitter<void>();
  @Output() deleteAgendaItem = new EventEmitter<void>();
  @Output() uploadDocument = new EventEmitter<void>();
  @Output() documentClick = new EventEmitter<DocumentModel>();
  @Output() documentDelete = new EventEmitter<DocumentModel>();

  onAddConclusion(): void {
    this.addConclusion.emit();
  }

  onAddNote(): void {
    this.addNote.emit();
  }

  onAddTask(): void {
    this.addTask.emit();
  }

  onPrintMeeting(): void {
    this.printMeeting.emit();
  }

  onEditAgendaItem(): void {
    this.editAgendaItem.emit();
  }

  onDeleteAgendaItem(): void {
    this.deleteAgendaItem.emit();
  }

  onUploadDocument(): void {
    this.uploadDocument.emit();
  }

  onDocumentClick(document: DocumentModel): void {
    this.documentClick.emit(document);
  }

  onDocumentDelete(document: DocumentModel): void {
    this.documentDelete.emit(document);
  }
}
