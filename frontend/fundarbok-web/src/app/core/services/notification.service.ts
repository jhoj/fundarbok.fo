import { Injectable } from '@angular/core';
import { SwPush } from '@angular/service-worker';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsEnabled$ = new BehaviorSubject<boolean>(false);
  private subscriptionActive$ = new BehaviorSubject<boolean>(false);

  constructor(
    private swPush: SwPush,
    private apiService: ApiService
  ) {
    this.initializeNotifications();
  }

  private initializeNotifications(): void {
    // Check if notifications are already enabled in localStorage
    const enabled = localStorage.getItem('notifications_enabled') === 'true';
    this.notificationsEnabled$.next(enabled);

    if (enabled) {
      this.setupPushListener();
    }
  }

  /**
   * Request permission and subscribe to push notifications
   */
  async requestNotificationPermission(): Promise<boolean> {
    try {
      // Check if service worker is available
      if (!this.swPush.isEnabled) {
        console.warn('Service Worker is not enabled');
        return false;
      }

      // Subscribe to push notifications
      const subscription = await this.swPush.requestSubscription({
        serverPublicKey: environment.vapidPublicKey
      });

      // Send subscription to backend
      const success = await this.subscribeOnBackend(subscription);
      if (success) {
        localStorage.setItem('notifications_enabled', 'true');
        this.notificationsEnabled$.next(true);
        this.setupPushListener();
        return true;
      }

      return false;
    } catch (error) {
      console.error('Failed to subscribe to push notifications:', error);
      return false;
    }
  }

  /**
   * Disable push notifications
   */
  async disableNotifications(): Promise<boolean> {
    try {
      if (this.swPush.isEnabled) {
        const subscription = await this.swPush.subscription.toPromise();
        if (subscription) {
          // Note: Backend unsubscribe would require storing subscription ID
          // For MVP, we'll just unsubscribe from service worker
          await subscription.unsubscribe();
        }
      }

      localStorage.setItem('notifications_enabled', 'false');
      this.notificationsEnabled$.next(false);
      this.subscriptionActive$.next(false);
      return true;
    } catch (error) {
      console.error('Failed to disable notifications:', error);
      return false;
    }
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): Observable<boolean> {
    return this.notificationsEnabled$.asObservable();
  }

  /**
   * Check if subscription is active
   */
  isSubscriptionActive(): Observable<boolean> {
    return this.subscriptionActive$.asObservable();
  }

  /**
   * Subscribe on backend
   */
  private async subscribeOnBackend(subscription: PushSubscription): Promise<boolean> {
    try {
      const subscriptionDto = {
        endpoint: subscription.endpoint,
        p256dh: this.arrayBufferToBase64(subscription.getKey('p256dh')!),
        auth: this.arrayBufferToBase64(subscription.getKey('auth')!)
      };

      await this.apiService.post('/push/subscribe', subscriptionDto).toPromise();
      this.subscriptionActive$.next(true);
      return true;
    } catch (error) {
      console.error('Failed to subscribe on backend:', error);
      return false;
    }
  }

  /**
   * Setup push notification listener
   */
  private setupPushListener(): void {
    if (this.swPush.isEnabled) {
      this.swPush.messages.subscribe((message: any) => {
        console.log('Push notification received:', message);
        // Handle notification click in service worker's notificationclick event
        // The notification will be displayed by the service worker
      });

      // Check subscription status
      this.swPush.subscription.subscribe(
        subscription => {
          this.subscriptionActive$.next(subscription !== null);
        }
      );
    }
  }

  /**
   * Convert ArrayBuffer to Base64
   */
  private arrayBufferToBase64(buffer: ArrayBuffer): string {
    const binary = String.fromCharCode.apply(null, Array.from(new Uint8Array(buffer)) as any);
    return btoa(binary);
  }
}
