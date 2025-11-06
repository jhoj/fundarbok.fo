import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification-prompt',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatSnackBarModule],
  template: ''
})
export class NotificationPromptComponent implements OnInit {
  constructor(
    private notificationService: NotificationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.checkAndPromptForNotifications();
  }

  /**
   * Check if user has already been prompted for notifications
   */
  private checkAndPromptForNotifications(): void {
    const notificationPrompted = localStorage.getItem('notification_prompted');

    if (!notificationPrompted) {
      // Delay prompt by 2 seconds to not be too intrusive
      setTimeout(() => {
        this.showNotificationPrompt();
      }, 2000);
    }
  }

  /**
   * Show notification permission prompt
   */
  private showNotificationPrompt(): void {
    this.snackBar.open('Enable notifications to receive meeting updates?', 'Enable', {
      duration: 0,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['notification-prompt-snackbar']
    }).onAction().subscribe(async () => {
      localStorage.setItem('notification_prompted', 'true');
      const success = await this.notificationService.requestNotificationPermission();

      if (success) {
        this.snackBar.open('Notifications enabled!', 'OK', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
      } else {
        this.snackBar.open('Failed to enable notifications', 'OK', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });

    // Close snackbar after 10 seconds if not interacted
    setTimeout(() => {
      localStorage.setItem('notification_prompted', 'true');
    }, 10000);
  }

  /**
   * Manually request notification permission
   */
  async requestPermission(): Promise<void> {
    const success = await this.notificationService.requestNotificationPermission();
    if (success) {
      this.snackBar.open('Notifications enabled!', 'OK', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    }
  }
}
