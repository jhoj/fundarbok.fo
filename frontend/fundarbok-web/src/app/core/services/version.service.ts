import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface VersionInfo {
  version: string;
  buildDate: string;
  commitHash: string;
}

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  constructor(private http: HttpClient) {}

  getVersionInfo(): Observable<VersionInfo> {
    return this.http.get<VersionInfo>('/assets/version.json').pipe(
      catchError(() => {
        // Fallback if version.json is not available
        return of({
          version: 'Unknown',
          buildDate: 'Unknown',
          commitHash: 'Unknown'
        });
      })
    );
  }
}
