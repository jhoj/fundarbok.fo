import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private currentLanguage = new BehaviorSubject<string>(this.getStoredLanguage() || 'fo');
  public currentLanguage$ = this.currentLanguage.asObservable();

  private translations: { [key: string]: any } = {};

  constructor(private http: HttpClient) {
    // Translations will be loaded via APP_INITIALIZER in app.config.ts
  }

  loadTranslations(lang: string): Observable<any> {
    return this.http.get(`/assets/i18n/${lang}.json`).pipe(
      map(data => {
        this.translations = data;
        return data;
      })
    );
  }

  setLanguage(lang: string): void {
    this.currentLanguage.next(lang);
    localStorage.setItem('language', lang);
    this.loadTranslations(lang).subscribe();
  }

  translate(key: string, params?: any): string {
    const keys = key.split('.');
    let value: any = this.translations;

    for (const k of keys) {
      if (value[k] !== undefined) {
        value = value[k];
      } else {
        return key;
      }
    }

    if (typeof value === 'string' && params) {
      return this.interpolate(value, params);
    }

    return typeof value === 'string' ? value : key;
  }

  private interpolate(value: string, params: any): string {
    return value.replace(/{{(\w+)}}/g, (match, key) => params[key] || match);
  }

  private getStoredLanguage(): string | null {
    return localStorage.getItem('language');
  }

  getCurrentLanguage(): string {
    return this.currentLanguage.value;
  }
}
