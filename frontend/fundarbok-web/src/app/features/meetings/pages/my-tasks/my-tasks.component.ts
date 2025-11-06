import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '../../../../shared/pipes/translate.pipe';
import { TranslationService } from '../../../../core/services/translation.service';
import { TaskService } from '../../services/task.service';
import { Task } from '../../../../models/meeting.model';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

interface TaskWithMeeting extends Omit<Task, 'agendaItemId'> {
  agendaItemTitle?: string;
  meetingId?: string;
  agendaItemId?: string;
}

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatListModule,
    MatDividerModule,
    MatTooltipModule,
    MatSnackBarModule,
    FormsModule,
    TranslatePipe
  ],
  templateUrl: './my-tasks.component.html',
  styleUrls: ['./my-tasks.component.scss']
})
export class MyTasksComponent implements OnInit {
  allTasks: TaskWithMeeting[] = [];
  pendingTasks: TaskWithMeeting[] = [];
  completedTasks: TaskWithMeeting[] = [];
  isLoading = true;

  constructor(
    private taskService: TaskService,
    private translationService: TranslationService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMyTasks();
  }

  loadMyTasks(): void {
    this.isLoading = true;
    this.taskService.getMyTasks().subscribe({
      next: (tasks) => {
        this.allTasks = tasks;
        this.separateTasksByStatus();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open(
          this.translationService.translate('notifications.error.failedToLoad'),
          this.translationService.translate('common.actions.close'),
          { duration: 3000 }
        );
      }
    });
  }

  separateTasksByStatus(): void {
    this.pendingTasks = this.allTasks
      .filter(t => !t.isCompleted)
      .sort((a, b) => {
        // Sort by due date, earliest first
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
      });

    this.completedTasks = this.allTasks.filter(t => t.isCompleted);
  }

  toggleTaskComplete(task: TaskWithMeeting): void {
    this.taskService.toggleComplete(task.id).subscribe({
      next: () => {
        task.isCompleted = !task.isCompleted;
        this.separateTasksByStatus();
        this.snackBar.open(
          task.isCompleted
            ? this.translationService.translate('meetings.myTasks.taskCompleted')
            : this.translationService.translate('meetings.myTasks.taskReactivated'),
          this.translationService.translate('common.actions.close'),
          { duration: 2000 }
        );
      },
      error: () => {
        this.snackBar.open(
          this.translationService.translate('notifications.error.failedToUpdate'),
          this.translationService.translate('common.actions.close'),
          { duration: 3000 }
        );
      }
    });
  }

  viewMeeting(task: TaskWithMeeting): void {
    if (task.meetingId) {
      this.router.navigate(['/meetings', task.meetingId]);
    }
  }

  isDueToday(dueDate?: string): boolean {
    if (!dueDate) return false;
    const today = new Date().toDateString();
    return new Date(dueDate).toDateString() === today;
  }

  isDueOverdue(dueDate?: string): boolean {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date() && !this.isDueToday(dueDate);
  }

  hasNoPendingTasks(): boolean {
    return this.pendingTasks.length === 0 && !this.isLoading;
  }

  hasNoCompletedTasks(): boolean {
    return this.completedTasks.length === 0 && !this.isLoading;
  }

  hasNoTasks(): boolean {
    return this.allTasks.length === 0 && !this.isLoading;
  }

  getDueDateLabel(dueDate?: string): string {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    const today = new Date();
    const diff = date.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days < 0) return `${Math.abs(days)} days overdue`;
    if (days === 0) return 'Due today';
    if (days === 1) return 'Due tomorrow';
    return `Due in ${days} days`;
  }
}
