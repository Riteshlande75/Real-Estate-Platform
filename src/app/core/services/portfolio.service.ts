import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError, map } from 'rxjs';
import { Investment } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class PortfolioService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 're_investments';

  // Reactive state holding user's tracked portfolio assets
  private readonly investmentsSubject = new BehaviorSubject<Investment[]>([]);
  public readonly investments$ = this.investmentsSubject.asObservable();

  // Computed financial observables
  public readonly totalInvested$ = this.investments$.pipe(
    map((list) => list.reduce((sum, item) => sum + (Number(item.purchasePrice) || 0), 0))
  );

  public readonly currentValue$ = this.investments$.pipe(
    map((list) => list.reduce((sum, item) => sum + (Number(item.currentValue) || 0), 0))
  );

  public readonly gainLoss$ = this.investments$.pipe(
    map((list) => {
      const invested = list.reduce((sum, item) => sum + (Number(item.purchasePrice) || 0), 0);
      const current = list.reduce((sum, item) => sum + (Number(item.currentValue) || 0), 0);
      return current - invested;
    })
  );

  public readonly gainLossPercent$ = this.investments$.pipe(
    map((list) => {
      const invested = list.reduce((sum, item) => sum + (Number(item.purchasePrice) || 0), 0);
      const current = list.reduce((sum, item) => sum + (Number(item.currentValue) || 0), 0);
      if (invested <= 0) return 0;
      return Number((((current - invested) / invested) * 100).toFixed(2));
    })
  );

  public readonly totalMonthlyRent$ = this.investments$.pipe(
    map((list) => list.reduce((sum, item) => sum + (Number(item.monthlyRent) || 0), 0))
  );

  public readonly averageRoi$ = this.investments$.pipe(
    map((list) => {
      const invested = list.reduce((sum, item) => sum + (Number(item.purchasePrice) || 0), 0);
      const annualRent = list.reduce((sum, item) => sum + (Number(item.monthlyRent) || 0), 0) * 12;
      if (invested <= 0) return 0;
      return Number(((annualRent / invested) * 100).toFixed(2));
    })
  );

  constructor() {
    this.initInvestments();
  }

  /**
   * Loads initial portfolio assets from localStorage or public/data/investments.json.
   */
  private initInvestments(): void {
    const cached = this.loadFromStorage();
    if (cached && cached.length > 0) {
      this.investmentsSubject.next(cached);
      return;
    }

    this.http.get<Investment[]>('/data/investments.json')
      .pipe(
        tap((data) => {
          this.investmentsSubject.next(data);
          this.saveToStorage(data);
        }),
        catchError((err) => {
          console.error('Failed to load investments from json:', err);
          this.investmentsSubject.next([]);
          return of([]);
        })
      )
      .subscribe();
  }

  /**
   * Returns an observable list of all investments.
   */
  getAll(): Observable<Investment[]> {
    return this.investments$;
  }

  /**
   * Returns a specific investment by ID.
   */
  getById(id: string): Observable<Investment | undefined> {
    return this.investments$.pipe(
      map((list) => list.find((item) => String(item.id) === String(id)))
    );
  }

  /**
   * Adds a new investment entry to the portfolio.
   */
  add(investment: Omit<Investment, 'id'> | Investment): Observable<Investment> {
    const current = this.investmentsSubject.getValue();
    const newId = 'inv-' + Date.now();
    const newInv: Investment = {
      ...investment,
      id: (investment as Investment).id || newId,
    };

    const updated = [newInv, ...current];
    this.investmentsSubject.next(updated);
    this.saveToStorage(updated);
    return of(newInv);
  }

  /**
   * Updates an existing investment entry.
   */
  update(investment: Investment): Observable<Investment> {
    const current = this.investmentsSubject.getValue();
    const updated = current.map((i) => (String(i.id) === String(investment.id) ? investment : i));
    this.investmentsSubject.next(updated);
    this.saveToStorage(updated);
    return of(investment);
  }

  /**
   * Removes an investment from the portfolio.
   */
  delete(id: string): Observable<boolean> {
    const current = this.investmentsSubject.getValue();
    const filtered = current.filter((i) => String(i.id) !== String(id));
    if (filtered.length !== current.length) {
      this.investmentsSubject.next(filtered);
      this.saveToStorage(filtered);
      return of(true);
    }
    return of(false);
  }

  /**
   * Safe helper to read from localStorage.
   */
  private loadFromStorage(): Investment[] | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? (JSON.parse(raw) as Investment[]) : null;
      }
    } catch (e) {
      console.warn('LocalStorage error reading investments:', e);
    }
    return null;
  }

  /**
   * Safe helper to persist to localStorage.
   */
  private saveToStorage(investments: Investment[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(investments));
      }
    } catch (e) {
      console.warn('LocalStorage error saving investments:', e);
    }
  }
}

