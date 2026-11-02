import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { PropertyService } from './property.service';
import { Property } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class CompareService {
  private readonly propertyService = inject(PropertyService);
  private readonly storageKey = 're_compare';
  public readonly maxCompareLimit = 3;

  // In-memory reactive state of compared property IDs
  private readonly selectedIdsSubject = new BehaviorSubject<string[]>(this.loadFromStorage());
  public readonly selectedIds$ = this.selectedIdsSubject.asObservable();

  // Observable count of currently selected items
  public readonly count$ = this.selectedIds$.pipe(map((ids) => ids.length));

  // Observable of full Property objects matching selected IDs
  public readonly comparedProperties$: Observable<Property[]> = combineLatest([
    this.selectedIds$,
    this.propertyService.getAll(),
  ]).pipe(
    map(([ids, allProperties]) => {
      // Maintain the order of selection
      return ids
        .map((id) => allProperties.find((p) => String(p.id) === String(id)))
        .filter((p): p is Property => p !== undefined);
    })
  );

  /**
   * Adds a property ID to comparison (enforces maximum limit of 3).
   */
  add(id: string): { success: boolean; message: string } {
    const current = this.selectedIdsSubject.getValue();
    const strId = String(id);

    if (current.includes(strId)) {
      return { success: false, message: 'Property is already in the comparison list.' };
    }

    if (current.length >= this.maxCompareLimit) {
      return {
        success: false,
        message: `You can compare a maximum of ${this.maxCompareLimit} properties simultaneously.`,
      };
    }

    const updated = [...current, strId];
    this.selectedIdsSubject.next(updated);
    this.saveToStorage(updated);
    return {
      success: true,
      message: `Property added to comparison (${updated.length}/${this.maxCompareLimit}).`,
    };
  }

  /**
   * Removes a specific property ID from comparison.
   */
  remove(id: string): void {
    const current = this.selectedIdsSubject.getValue();
    const updated = current.filter((item) => String(item) !== String(id));
    this.selectedIdsSubject.next(updated);
    this.saveToStorage(updated);
  }

  /**
   * Clears all properties from the comparison list.
   */
  clear(): void {
    this.selectedIdsSubject.next([]);
    this.saveToStorage([]);
  }

  /**
   * Returns whether a given property ID is currently in the comparison list.
   */
  isInCompare(id: string): boolean {
    return this.selectedIdsSubject.getValue().includes(String(id));
  }

  /**
   * Safe helper to load compared IDs from localStorage.
   */
  private loadFromStorage(): string[] {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = localStorage.getItem(this.storageKey);
        return raw ? (JSON.parse(raw) as string[]) : [];
      }
    } catch (e) {
      console.warn('LocalStorage error reading compare list:', e);
    }
    return [];
  }

  /**
   * Safe helper to persist compared IDs into localStorage.
   */
  private saveToStorage(ids: string[]): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(this.storageKey, JSON.stringify(ids));
      }
    } catch (e) {
      console.warn('LocalStorage error writing compare list:', e);
    }
  }
}

