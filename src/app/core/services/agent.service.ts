import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError, map } from 'rxjs';
import { Agent } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 're_agents';

  // Reactive state of all real estate agents
  private readonly agentsSubject = new BehaviorSubject<Agent[]>([]);
  public readonly agents$ = this.agentsSubject.asObservable();

  constructor() {
    this.initAgents();
  }

  /**
   * Loads initial agent data from localStorage or falls back to public/data/agents.json.
   */
  private initAgents(): void {
    const cached = this.loadFromStorage();
    if (cached && cached.length > 0) {
      this.agentsSubject.next(cached);
      return;
    }

    this.http.get<Agent[]>('/data/agents.json')
      .pipe(
        tap((data) => {
          this.agentsSubject.next(data);
          this.saveToStorage(data);
        }),
        catchError((err) => {
          console.error('Failed to load agents from json:', err);
          this.agentsSubject.next([]);
          return of([]);
        })
      )
      .subscribe();
  }

  /**
   * Returns an observable list of all registered agents.
   */
  getAll(): Observable<Agent[]> {
    return this.agents$;
  }

  /**
   * Returns an agent by ID, or undefined if not found.
   */
  getById(id: string): Observable<Agent | undefined> {
    return this.agents$.pipe(
      map((agents) => agents.find((a) => String(a.id) === String(id)))
    );
  }

  /**
   * Adds a new agent with an auto-generated unique ID.
   */
  add(agent: Omit<Agent, 'id'> | Agent): Observable<Agent> {
    const current = this.agentsSubject.getValue();
    const newId = 'agent-' + Date.now();
    const newAgent: Agent = {
      ...agent,
      id: (agent as Agent).id || newId,
      rating: agent.rating || 5.0,
      activeListings: agent.activeListings || 1,
      image: agent.image || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
    };

    const updated = [newAgent, ...current];
    this.agentsSubject.next(updated);
    this.saveToStorage(updated);
    return of(newAgent);
  }

  /**
   * Updates an existing agent record.
   */
  update(agent: Agent): Observable<Agent> {
    const current = this.agentsSubject.getValue();
    const updated = current.map((a) => (String(a.id) === String(agent.id) ? agent : a));
    this.agentsSubject.next(updated);
    this.saveToStorage(updated);
    return of(agent);
  }

  /**
   * Deletes an agent by ID.
   */
  delete(id: string): Observable<boolean> {
    const current = this.agentsSubject.getValue();
    const filtered = current.filter((a) => String(a.id) !== String(id));
    if (filtered.length !== current.length) {
      this.agentsSubject.next(filtered);
      this.saveToStorage(filtered);
      return of(true);
    }
    return of(false);
  }

  /**
   * Safe helper to read agents from localStorage.
   */
  private loadFromStorage(): Agent[] | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? (JSON.parse(raw) as Agent[]) : null;
      }
    } catch (e) {
      console.warn('LocalStorage error reading agents:', e);
    }
    return null;
  }

  /**
   * Safe helper to persist agents into localStorage.
   */
  private saveToStorage(agents: Agent[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(agents));
      }
    } catch (e) {
      console.warn('LocalStorage error saving agents:', e);
    }
  }
}

