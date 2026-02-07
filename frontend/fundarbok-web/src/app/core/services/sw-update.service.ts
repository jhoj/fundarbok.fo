import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class SwUpdateService {
  private updateAvailable$ = new BehaviorSubject<boolean>(false);

  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar
  ) {
    this.checkForUpdates();
  }

  /**
   * Check for service worker updates
   */
  private checkForUpdates(): void {
    if (!this.swUpdate.isEnabled) {
      console.warn('Service Worker updates are not enabled');
      return;
    }

    // Check for updates periodically (every 6 hours)
    setInterval(() => {
      this.swUpdate.checkForUpdate().then(
        () => console.log('Checked for updates'),
        err => console.error('Error checking for updates:', err)
      );
    }, 6 * 60 * 60 * 1000);

    // Check immediately on service load
    this.swUpdate.checkForUpdate().then(
      () => console.log('Checked for updates on service load'),
      err => console.error('Error checking for updates:', err)
    );

    // Listen for version ready events (new version available)
    this.swUpdate.versionUpdates.subscribe((event: any) => {
      if (event.type === 'VERSION_READY') {
        this.updateAvailable$.next(true);
        this.showUpdateNotification();
      }
    });
  }

  /**
   * Show update notification snackbar
   */
  private showUpdateNotification(): void {
    this.snackBar.open('New version available', 'Update', {
      duration: 0, // Stay visible until dismissed or action taken
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['update-snackbar']
    }).onAction().subscribe(() => {
      this.activateUpdate();
    });
  }

  /**
   * Activate available update and reload app
   */
  activateUpdate(): void {
    this.swUpdate.activateUpdate().then(
      () => {
        console.log('Update activated');
        // Reload the page to load the new version
        window.location.reload();
      },
      err => {
        console.error('Error activating update:', err);
        this.snackBar.open('Failed to update app', 'OK', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    );
  }

  /**
   * Observable for update availability
   */
  isUpdateAvailable(): Observable<boolean> {
    return this.updateAvailable$.asObservable();
  }
}
