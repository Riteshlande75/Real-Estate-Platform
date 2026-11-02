import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError, map } from 'rxjs';
import { Enquiry } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class EnquiryService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 're_enquiries';

  // Reactive in-memory state of customer inquiries
  private readonly enquiriesSubject = new BehaviorSubject<Enquiry[]>([]);
  public readonly enquiries$ = this.enquiriesSubject.asObservable();

  constructor() {
    this.initEnquiries();
  }

  /**
   * Loads initial enquiries from localStorage or falls back to public/data/enquiries.json.
   */
  private initEnquiries(): void {
    const cached = this.loadFromStorage();
    if (cached && cached.length > 0) {
      this.enquiriesSubject.next(cached);
      return;
    }

    this.http.get<Enquiry[]>('/data/enquiries.json')
      .pipe(
        tap((data) => {
          this.enquiriesSubject.next(data);
          this.saveToStorage(data);
        }),
        catchError((err) => {
          console.error('Failed to load enquiries from json:', err);
          this.enquiriesSubject.next([]);
          return of([]);
        })
      )
      .subscribe();
  }

  /**
   * Returns an observable of all inquiries.
   */
  getAll(): Observable<Enquiry[]> {
    return this.enquiries$;
  }

  /**
   * Adds a new customer enquiry and persists it.
   */
  add(enquiry: Omit<Enquiry, 'id' | 'date' | 'status'> & Partial<Enquiry>): Observable<Enquiry> {
    const current = this.enquiriesSubject.getValue();
    const newEnquiry: Enquiry = {
      ...enquiry,
      id: enquiry.id || 'enq-' + Date.now(),
      status: enquiry.status || 'New',
      date: enquiry.date || new Date().toISOString(),
    };

    const updated = [newEnquiry, ...current];
    this.enquiriesSubject.next(updated);
    this.saveToStorage(updated);
    return of(newEnquiry);
  }

  /**
   * Updates the workflow status of an enquiry (New -> In Progress -> Closed).
   */
  updateStatus(id: string, status: 'New' | 'In Progress' | 'Closed'): Observable<boolean> {
    const current = this.enquiriesSubject.getValue();
    let modified = false;

    const updated = current.map((item) => {
      if (String(item.id) === String(id)) {
        modified = true;
        return { ...item, status };
      }
      return item;
    });

    if (modified) {
      this.enquiriesSubject.next(updated);
      this.saveToStorage(updated);
      return of(true);
    }
    return of(false);
  }

  /**
   * Returns all enquiries associated with a specific property ID.
   */
  getByProperty(propertyId: string): Observable<Enquiry[]> {
    return this.enquiries$.pipe(
      map((list) => list.filter((e) => String(e.propertyId) === String(propertyId)))
    );
  }

  /**
   * Deletes an enquiry by ID.
   */
  delete(id: string): Observable<boolean> {
    const current = this.enquiriesSubject.getValue();
    const filtered = current.filter((e) => String(e.id) !== String(id));
    if (filtered.length !== current.length) {
      this.enquiriesSubject.next(filtered);
      this.saveToStorage(filtered);
      return of(true);
    }
    return of(false);
  }

  /**
   * Safe helper to load enquiries from localStorage.
   */
  private loadFromStorage(): Enquiry[] | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? (JSON.parse(raw) as Enquiry[]) : null;
      }
    } catch (e) {
      console.warn('LocalStorage error reading enquiries:', e);
    }
    return null;
  }

  /**
   * Safe helper to persist enquiries to localStorage.
   */
  private saveToStorage(enquiries: Enquiry[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(enquiries));
      }
    } catch (e) {
      console.warn('LocalStorage error saving enquiries:', e);
    }
  }
}

