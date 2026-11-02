import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map, of, tap, catchError } from 'rxjs';
import { Property } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private readonly http = inject(HttpClient);
  private readonly storageKey = 're_properties';

  // In-memory reactive state holding all properties
  private readonly propertiesSubject = new BehaviorSubject<Property[]>([]);
  public readonly properties$ = this.propertiesSubject.asObservable();

  // Flag to ensure initial data is loaded only once
  private isLoaded = false;

  constructor() {
    this.initProperties();
  }

  /**
   * Initializes property data by first checking localStorage;
   * falls back to public/data/properties.json if no cached data exists.
   */
  private initProperties(): void {
    const cached = this.loadFromStorage();
    if (cached && cached.length > 0) {
      this.propertiesSubject.next(cached);
      this.isLoaded = true;
      return;
    }

    // Load from static JSON asset
    this.http.get<Property[]>('/data/properties.json')
      .pipe(
        tap((data) => {
          this.propertiesSubject.next(data);
          this.saveToStorage(data);
          this.isLoaded = true;
        }),
        catchError((error) => {
          console.error('Failed to load initial properties from JSON:', error);
          this.propertiesSubject.next([]);
          this.isLoaded = true;
          return of([]);
        })
      )
      .subscribe();
  }

  /**
   * Returns an observable of all properties.
   */
  getAll(): Observable<Property[]> {
    return this.properties$;
  }

  /**
   * Returns a single property by its ID, or undefined if not found.
   */
  getById(id: string | number): Observable<Property | undefined> {
    const targetId = String(id);
    return this.properties$.pipe(
      map((properties) => properties.find((p) => String(p.id) === targetId))
    );
  }

  /**
   * Adds a new property, automatically assigning a unique ID, createdAt, and pricePerSqFt.
   */
  add(property: Omit<Property, 'id'> | Property): Observable<Property> {
    const current = this.propertiesSubject.getValue();
    const newId = 'prop-' + Date.now();
    const area = Number(property.area) || 1;
    const price = Number(property.price) || 0;
    const pricePerSqFt = property.pricePerSqFt || Math.round(price / area);

    const newProperty: Property = {
      ...property,
      id: (property as Property).id || newId,
      createdAt: (property as Property).createdAt || new Date().toISOString(),
      pricePerSqFt,
      images: property.images && property.images.length > 0
        ? property.images
        : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'],
    };

    const updated = [newProperty, ...current];
    this.propertiesSubject.next(updated);
    this.saveToStorage(updated);
    return of(newProperty);
  }

  /**
   * Updates an existing property matching by ID.
   */
  update(property: Property): Observable<Property> {
    const current = this.propertiesSubject.getValue();
    const area = Number(property.area) || 1;
    const price = Number(property.price) || 0;
    const pricePerSqFt = Math.round(price / area);

    const updatedList = current.map((item) =>
      String(item.id) === String(property.id)
        ? { ...property, pricePerSqFt }
        : item
    );

    this.propertiesSubject.next(updatedList);
    this.saveToStorage(updatedList);
    return of(property);
  }

  /**
   * Deletes a property by ID. Returns true if removed, false otherwise.
   */
  delete(id: string | number): Observable<boolean> {
    const targetId = String(id);
    const current = this.propertiesSubject.getValue();
    const filtered = current.filter((item) => String(item.id) !== targetId);

    if (filtered.length !== current.length) {
      this.propertiesSubject.next(filtered);
      this.saveToStorage(filtered);
      return of(true);
    }
    return of(false);
  }

  /**
   * Safe helper to load properties from browser localStorage.
   */
  private loadFromStorage(): Property[] | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? (JSON.parse(raw) as Property[]) : null;
      }
    } catch (err) {
      console.warn('Could not read properties from localStorage:', err);
    }
    return null;
  }

  /**
   * Safe helper to persist properties into browser localStorage.
   */
  private saveToStorage(properties: Property[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(properties));
      }
    } catch (err) {
      console.warn('Could not save properties to localStorage:', err);
    }
  }
}

