import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { MeetingService } from '../../../../core/services/meeting.service';
import { AgendaItemService } from '../../services/agenda-item.service';
import { AuthService } from '../../../../core/services/auth.service';
import { TranslationService } from '../../../../core/services/translation.service';
import { HasRoleDirective } from '../../../../shared/directives/has-role.directive';
import { MeetingDetail, AgendaItem, AgendaItemDetail, UpdateMeetingRequest } from '../../../../models/meeting.model';
import { AgendaItemsSidebarComponent } from '../../components/agenda-items-sidebar/agenda-items-sidebar.component';
import { AgendaItemDetailComponent } from '../../components/agenda-item-detail/agenda-item-detail.component';
import { AgendaItemDialogComponent, AgendaItemDialogData } from '../../dialogs/agenda-item-dialog/agenda-item-dialog.component';
import { ConclusionDialogComponent, ConclusionDialogData } from '../../dialogs/conclusion-dialog/conclusion-dialog.component';
import { NoteDialogComponent, NoteDialogData } from '../../dialogs/note-dialog/note-dialog.component';
import { TaskDialogComponent, TaskDialogData } from '../../dialogs/task-dialog/task-dialog.component';
import { ConclusionService } from '../../services/conclusion.service';
import { NoteService } from '../../services/note.service';
import { TaskService } from '../../services/task.service';
import { DocumentService } from '../../../../core/services/document.service';
import { Document as DocumentModel } from '../../../../models/document.model';
import { DocumentUploadDialogComponent, DocumentUploadDialogData } from '../../dialogs/document-upload-dialog/document-upload-dialog.component';
import { DocumentPreviewComponent } from '../../components/document-preview/document-preview.component';
import { ParticipantsDialogComponent, ParticipantsDialogData } from '../../dialogs/participants-dialog/participants-dialog.component';
import { CloseMeetingDialogComponent, CloseMeetingDialogData } from '../../dialogs/close-meeting-dialog/close-meeting-dialog.component';
import { ApproveMeetingDialogComponent, ApproveMeetingDialogData } from '../../dialogs/approve-meeting-dialog/approve-meeting-dialog.component';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-meeting-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    FormsModule,
    HasRoleDirective,
    AgendaItemsSidebarComponent,
    AgendaItemDetailComponent,
    TranslatePipe
  ],
  templateUrl: './meeting-detail.component.html',
  styleUrls: ['./meeting-detail.component.scss']
})
export class MeetingDetailComponent implements OnInit {
  meeting: MeetingDetail | null = null;
  selectedAgendaItem: AgendaItemDetail | null = null;
  isLoading = true;
  private meetingId = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private meetingService: MeetingService,
    private agendaItemService: AgendaItemService,
    private authService: AuthService,
    private translationService: TranslationService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private conclusionService: ConclusionService,
    private noteService: NoteService,
    private taskService: TaskService,
    private documentService: DocumentService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.meetingId = params['id'];
      this.loadMeeting();
    });
  }

  loadMeeting(): void {
    this.isLoading = true;
    this.meetingService.getMeetingDetail(this.meetingId).subscribe({
      next: (meeting) => {
        this.meeting = meeting;
        // Auto-select first agenda item if available
        if (meeting.agendaItems && meeting.agendaItems.length > 0) {
          this.selectedAgendaItem = meeting.agendaItems[0];
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onSelectAgendaItem(item: AgendaItemDetail): void {
    this.selectedAgendaItem = item;
  }

  onAddAgendaItem(): void {
    const dialogData: AgendaItemDialogData = {
      meetingId: this.meetingId,
      mode: 'create'
    };

    const dialogRef = this.dialog.open(AgendaItemDialogComponent, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.agendaItemService.createAgendaItem(this.meetingId, result).subscribe({
          next: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.agendaItemCreated'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
            this.loadMeeting();
          },
          error: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.failedToCreate'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  onAddConclusion(): void {
    if (!this.selectedAgendaItem) return;

    const dialogData: ConclusionDialogData = {
      agendaItemId: this.selectedAgendaItem.id,
      mode: 'create'
    };

    const dialogRef = this.dialog.open(ConclusionDialogComponent, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.selectedAgendaItem) {
        this.conclusionService.create(this.selectedAgendaItem.id, result).subscribe({
          next: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.conclusionCreated'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
            this.loadMeeting();
          },
          error: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.failedToCreate'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  onAddNote(): void {
    if (!this.selectedAgendaItem) return;

    const dialogData: NoteDialogData = {
      agendaItemId: this.selectedAgendaItem.id,
      mode: 'create'
    };

    const dialogRef = this.dialog.open(NoteDialogComponent, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.selectedAgendaItem) {
        this.noteService.create(this.selectedAgendaItem.id, result).subscribe({
          next: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.noteCreated'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
            this.loadMeeting();
          },
          error: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.failedToCreate'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  onAddTask(): void {
    if (!this.selectedAgendaItem) return;

    // Get users from meeting participants for task assignment
    const users = this.meeting?.participants?.map(p => ({
      id: p.committeeMember?.id || '',
      name: p.committeeMember?.name || '',
      email: p.committeeMember?.email || ''
    })) || [];

    const dialogData: TaskDialogData = {
      agendaItemId: this.selectedAgendaItem.id,
      mode: 'create',
      users: users
    };

    const dialogRef = this.dialog.open(TaskDialogComponent, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.selectedAgendaItem) {
        this.taskService.create(this.selectedAgendaItem.id, result).subscribe({
          next: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.taskCreated'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
            this.loadMeeting();
          },
          error: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.failedToCreate'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  onPrintMeeting(): void {
    // TODO: Implement print functionality
    window.print();
  }

  openParticipantsDialog(): void {
    if (!this.meeting) return;

    const dialogRef = this.dialog.open(ParticipantsDialogComponent, {
      width: '700px',
      data: {
        meetingId: this.meeting.id,
        committeeId: this.meeting.committeeId,
        committeeName: this.meeting.committee?.name || 'Committee',
        committeeDescription: this.meeting.committee?.description
      } as ParticipantsDialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload meeting data if changes were made
        this.loadMeeting();
      }
    });
  }

  closeMeeting(): void {
    if (!this.meeting) return;

    const dialogData: CloseMeetingDialogData = {
      meeting: this.meeting
    };

    const dialogRef = this.dialog.open(CloseMeetingDialogComponent, {
      width: '600px',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.meetingService.updateStatus(this.meetingId, { status: 'completed' }).subscribe({
          next: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.meetingClosed'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
            this.loadMeeting();
          },
          error: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.failedToCloseMeeting'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  approveMeeting(): void {
    if (!this.meeting) return;

    const dialogData: ApproveMeetingDialogData = {
      meeting: this.meeting
    };

    const dialogRef = this.dialog.open(ApproveMeetingDialogComponent, {
      width: '650px',
      data: dialogData,
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.confirm) {
        this.meetingService.updateStatus(this.meetingId, { status: 'approved' }).subscribe({
          next: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.meetingApproved'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
            this.loadMeeting();
          },
          error: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.failedToApproveMeeting'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/meetings']);
  }

  editMeeting(): void {
    if (this.meetingId) {
      this.router.navigate(['/meetings', this.meetingId, 'edit']);
    }
  }

  getStatusClass(): string {
    if (!this.meeting) return '';
    if (this.meeting.isApproved) return 'approved';
    if (this.meeting.isCompleted) return 'completed';
    return 'open';
  }

  getStatusLabel(): string {
    if (!this.meeting) return '';
    if (this.meeting.isApproved) return this.translationService.translate('meetings.detail.meetingClosed');
    if (this.meeting.isCompleted) return this.translationService.translate('meetings.detail.meetingCompleted');
    return this.translationService.translate('meetings.detail.meetingOpen');
  }

  getCommitteeName(): string {
    return this.meeting?.committee?.name.toUpperCase() || '';
  }

  getMeetingNumber(): string {
    return this.meeting?.meetingNumber || '';
  }

  getDocuments(): any[] {
    if (!this.selectedAgendaItem?.documents) return [];
    return this.selectedAgendaItem.documents.slice(0, 6); // Show max 6 documents
  }

  saveMeeting(): void {
    if (!this.meeting) return;
    const request: UpdateMeetingRequest = {
      title: this.meeting.title,
      location: this.meeting.location,
      startDate: this.meeting.startDate,
      endDate: this.meeting.endDate,
      description: this.meeting.description
    };
    this.meetingService.updateMeeting(this.meetingId, request).subscribe({
      next: () => {
        this.snackBar.open(
          this.translationService.translate('meetings.messages.meetingUpdated'),
          this.translationService.translate('common.actions.close'),
          { duration: 3000 }
        );
      },
      error: () => {
        this.snackBar.open(
          this.translationService.translate('meetings.messages.failedToUpdate'),
          this.translationService.translate('common.actions.close'),
          { duration: 3000 }
        );
      }
    });
  }

  onEditAgendaItem(): void {
    if (!this.selectedAgendaItem) return;

    const dialogData: AgendaItemDialogData = {
      agendaItem: this.selectedAgendaItem,
      meetingId: this.meetingId,
      mode: 'edit'
    };

    const dialogRef = this.dialog.open(AgendaItemDialogComponent, {
      width: '600px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && this.selectedAgendaItem) {
        this.agendaItemService.updateAgendaItem(this.selectedAgendaItem.id, result).subscribe({
          next: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.agendaItemUpdated'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
            this.loadMeeting();
          },
          error: () => {
            this.snackBar.open(
              this.translationService.translate('meetings.messages.failedToUpdate'),
              this.translationService.translate('common.actions.close'),
              { duration: 3000 }
            );
          }
        });
      }
    });
  }

  onDeleteAgendaItem(): void {
    if (!this.selectedAgendaItem) return;

    if (confirm(this.translationService.translate('notifications.confirm.confirmDelete'))) {
      this.agendaItemService.deleteAgendaItem(this.selectedAgendaItem.id).subscribe({
        next: () => {
          this.snackBar.open(
            this.translationService.translate('meetings.messages.agendaItemDeleted'),
            this.translationService.translate('common.actions.close'),
            { duration: 3000 }
          );
          this.selectedAgendaItem = null;
          this.loadMeeting();
        },
        error: () => {
          this.snackBar.open(
            this.translationService.translate('meetings.messages.failedToDelete'),
            this.translationService.translate('common.actions.close'),
            { duration: 3000 }
          );
        }
      });
    }
  }

  onReorderAgendaItems(orderedIds: string[]): void {
    this.agendaItemService.reorderAgendaItems(this.meetingId, { orderedIds }).subscribe({
      next: () => {
        this.snackBar.open(
          this.translationService.translate('meetings.messages.agendaItemsReordered'),
          this.translationService.translate('common.actions.close'),
          { duration: 2000 }
        );
        this.loadMeeting();
      },
      error: () => {
        this.snackBar.open(
          this.translationService.translate('notifications.error.failedToUpdate'),
          this.translationService.translate('common.actions.close'),
          { duration: 3000 }
        );
        this.loadMeeting(); // Reload to revert changes
      }
    });
  }

  onUploadDocument(): void {
    if (!this.selectedAgendaItem) return;

    const dialogData: DocumentUploadDialogData = {
      agendaItemId: this.selectedAgendaItem.id
    };

    const dialogRef = this.dialog.open(DocumentUploadDialogComponent, {
      width: '700px',
      data: dialogData
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.length > 0) {
        this.snackBar.open(
          `Successfully uploaded ${result.length} document(s)`,
          this.translationService.translate('common.actions.close'),
          { duration: 3000 }
        );
        this.loadMeeting();
      }
    });
  }

  onDocumentClick(document: DocumentModel): void {
    const dialogRef = this.dialog.open(DocumentPreviewComponent, {
      width: '90vw',
      maxWidth: '1200px',
      height: '90vh',
      data: { document }
    });
  }

  onDocumentDelete(document: DocumentModel): void {
    if (confirm('Are you sure you want to delete this document?')) {
      this.documentService.deleteDocument(document.id).subscribe({
        next: () => {
          this.snackBar.open(
            'Document deleted successfully',
            this.translationService.translate('common.actions.close'),
            { duration: 3000 }
          );
          this.loadMeeting();
        },
        error: () => {
          this.snackBar.open(
            'Failed to delete document',
            this.translationService.translate('common.actions.close'),
            { duration: 3000 }
          );
        }
      });
    }
  }

  isSecretary(): boolean {
    return this.authService.hasRole('Secretary');
  }
}
