import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError, map } from 'rxjs';
import { Client } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 're_clients';

  // Reactive state of all CRM clients
  private readonly clientsSubject = new BehaviorSubject<Client[]>([]);
  public readonly clients$ = this.clientsSubject.asObservable();

  constructor() {
    this.initClients();
  }

  /**
   * Initializes client list from localStorage or public/data/clients.json.
   */
  private initClients(): void {
    const cached = this.loadFromStorage();
    if (cached && cached.length > 0) {
      this.clientsSubject.next(cached);
      return;
    }

    this.http.get<Client[]>('/data/clients.json')
      .pipe(
        tap((data) => {
          this.clientsSubject.next(data);
          this.saveToStorage(data);
        }),
        catchError((err) => {
          console.error('Failed to load clients from json:', err);
          this.clientsSubject.next([]);
          return of([]);
        })
      )
      .subscribe();
  }

  /**
   * Returns an observable of all clients.
   */
  getAll(): Observable<Client[]> {
    return this.clients$;
  }

  /**
   * Returns a single client by ID.
   */
  getById(id: string): Observable<Client | undefined> {
    return this.clients$.pipe(
      map((clients) => clients.find((c) => String(c.id) === String(id)))
    );
  }

  /**
   * Adds a new client to CRM records.
   */
  add(client: Omit<Client, 'id'> | Client): Observable<Client> {
    const current = this.clientsSubject.getValue();
    const newId = 'client-' + Date.now();
    const newClient: Client = {
      ...client,
      id: (client as Client).id || newId,
    };

    const updated = [newClient, ...current];
    this.clientsSubject.next(updated);
    this.saveToStorage(updated);
    return of(newClient);
  }

  /**
   * Updates an existing client record.
   */
  update(client: Client): Observable<Client> {
    const current = this.clientsSubject.getValue();
    const updated = current.map((c) => (String(c.id) === String(client.id) ? client : c));
    this.clientsSubject.next(updated);
    this.saveToStorage(updated);
    return of(client);
  }

  /**
   * Deletes a client by ID.
   */
  delete(id: string): Observable<boolean> {
    const current = this.clientsSubject.getValue();
    const filtered = current.filter((c) => String(c.id) !== String(id));
    if (filtered.length !== current.length) {
      this.clientsSubject.next(filtered);
      this.saveToStorage(filtered);
      return of(true);
    }
    return of(false);
  }

  /**
   * Safe helper to read clients from localStorage.
   */
  private loadFromStorage(): Client[] | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? (JSON.parse(raw) as Client[]) : null;
      }
    } catch (e) {
      console.warn('LocalStorage error reading clients:', e);
    }
    return null;
  }

  /**
   * Safe helper to persist clients into localStorage.
   */
  private saveToStorage(clients: Client[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(clients));
      }
    } catch (e) {
      console.warn('LocalStorage error saving clients:', e);
    }
  }
}

