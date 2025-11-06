import { ApplicationConfig, provideZoneChangeDetection, isDevMode, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { registerLocaleData } from '@angular/common';
import localeDa from '@angular/common/locales/da';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { TranslationService } from './core/services/translation.service';

// Register Danish locale (closest to Faroese for date formatting with 24h clock)
registerLocaleData(localeDa, 'da');

// Initialize translations before app starts
export function initializeTranslations(translationService: TranslationService) {
  return () => new Promise<void>((resolve, reject) => {
    translationService.loadTranslations(translationService.getCurrentLanguage()).subscribe({
      next: () => resolve(),
      error: (err) => {
        console.error('Failed to load translations:', err);
        reject(err);
      }
    });
  });
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    { provide: LOCALE_ID, useValue: 'da' },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeTranslations,
      deps: [TranslationService],
      multi: true
    }
  ]
};
