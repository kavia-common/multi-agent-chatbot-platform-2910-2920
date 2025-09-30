import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserProfile } from '../models/models';
import { getLocalStorage } from '../utils/browser-globals';

/**
PUBLIC_INTERFACE
*/
@Injectable({ providedIn: 'root' })
export class AuthService {
  private api = inject(ApiService);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<UserProfile | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  get isAuthenticated(): boolean {
    const ls = getLocalStorage();
    const token = ls?.getItem('accessToken');
    return !!token;
  }

  // PUBLIC_INTERFACE
  login(email: string, password: string): Observable<any> {
    return this.api.login(email, password).pipe(
      tap((tokens) => {
        const ls = getLocalStorage();
        try { ls?.setItem('accessToken', tokens.accessToken); } catch {}
      }),
      tap(() => this.fetchMe().subscribe())
    );
  }

  // PUBLIC_INTERFACE
  signup(email: string, password: string, name?: string): Observable<any> {
    return this.api.signup(email, password, name).pipe(
      tap((tokens) => {
        const ls = getLocalStorage();
        try { ls?.setItem('accessToken', tokens.accessToken); } catch {}
      }),
      tap(() => this.fetchMe().subscribe())
    );
  }

  // PUBLIC_INTERFACE
  logout(): void {
    const ls = getLocalStorage();
    try { ls?.removeItem('accessToken'); } catch {}
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  // PUBLIC_INTERFACE
  fetchMe(): Observable<UserProfile> {
    return this.api.me().pipe(tap((user) => this.currentUserSubject.next(user)));
  }
}
