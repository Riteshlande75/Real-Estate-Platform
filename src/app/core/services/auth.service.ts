import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export interface AuthUser {
  username: string;
  name: string;
  role: 'admin' | 'agent' | 'investor';
  email: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 're_auth_user';

  // Mock valid users for authentication
  private readonly mockUsers: Record<string, { pass: string; user: AuthUser }> = {
    admin: {
      pass: 'admin123',
      user: {
        username: 'admin',
        name: 'Portfolio Administrator',
        role: 'admin',
        email: 'admin@realestateplatform.com',
      },
    },
    agent: {
      pass: 'agent123',
      user: {
        username: 'agent',
        name: 'Sarah Jenkins (Senior Partner)',
        role: 'agent',
        email: 'sarah.jenkins@realestateplatform.com',
      },
    },
    investor: {
      pass: 'investor123',
      user: {
        username: 'investor',
        name: 'Rajesh Mehta (HNI Investor)',
        role: 'investor',
        email: 'rajesh.mehta@investor.in',
      },
    },
  };

  // BehaviorSubjects holding live session states
  private readonly currentUserSubject = new BehaviorSubject<AuthUser | null>(this.getStoredUser());
  public readonly currentUser$ = this.currentUserSubject.asObservable();

  private readonly isLoggedInSubject = new BehaviorSubject<boolean>(!!this.getStoredUser());
  public readonly isLoggedIn$ = this.isLoggedInSubject.asObservable();

  /**
   * Observable stream that emits true if the active authenticated user has the 'admin' role.
   */
  public readonly isAdmin$: Observable<boolean> = this.currentUserSubject.pipe(
    map((user) => user?.role === 'admin')
  );

  /**
   * Attempts to authenticate user credentials against mock records.
   * On success, persists user profile to localStorage and emits status.
   */
  login(username: string, password: string): Observable<boolean> {
    const trimmedUser = (username || '').trim().toLowerCase();
    const trimmedPass = (password || '').trim();

    const record = this.mockUsers[trimmedUser];
    if (record && record.pass === trimmedPass) {
      this.saveUserToStorage(record.user);
      this.currentUserSubject.next(record.user);
      this.isLoggedInSubject.next(true);
      return of(true);
    }

    return of(false);
  }

  /**
   * Ends current session, clears stored credentials, and notifies observers.
   */
  logout(): void {
    this.removeUserFromStorage();
    this.currentUserSubject.next(null);
    this.isLoggedInSubject.next(false);
  }

  /**
   * Synchronous check whether user is currently authenticated.
   */
  isAuthenticated(): boolean {
    return this.isLoggedInSubject.getValue();
  }

  /**
   * Synchronous check whether current user has administrator privileges.
   */
  isAdmin(): boolean {
    return this.currentUserSubject.getValue()?.role === 'admin';
  }

  /**
   * Returns current active user object, or null if unauthenticated.
   */
  getUser(): AuthUser | null {
    return this.currentUserSubject.getValue();
  }

  /**
   * Safe helper to read session from localStorage.
   */
  private getStoredUser(): AuthUser | null {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  }

  /**
   * Safe helper to write session to localStorage.
   */
  private saveUserToStorage(user: AuthUser): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(user));
    } catch (e) {
      console.warn('Unable to persist session to localStorage', e);
    }
  }

  /**
   * Safe helper to remove session from localStorage.
   */
  private removeUserFromStorage(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (e) {
      console.warn('Unable to remove session from localStorage', e);
    }
  }
}
