import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map, debounceTime } from 'rxjs/operators';
import { PropertyService } from './property.service';
import { Property, SearchFilter } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private readonly propertyService = inject(PropertyService);

  private readonly defaultFilter: SearchFilter = {
    keyword: '',
    city: '',
    type: '',
    minPrice: undefined,
    maxPrice: undefined,
    bedrooms: undefined,
    sortBy: 'newest',
  };

  // Internal reactive stream of active search & filter parameters
  private readonly filterSubject = new BehaviorSubject<SearchFilter>(this.defaultFilter);
  public readonly filters$ = this.filterSubject.asObservable();

  // Combined reactive stream of filtered & sorted properties
  public readonly results$: Observable<Property[]> = combineLatest([
    this.propertyService.getAll(),
    this.filters$.pipe(debounceTime(150)),
  ]).pipe(
    map(([properties, filter]) => this.applyFiltersAndSort(properties, filter))
  );

  /**
   * Updates one or more filter fields and triggers re-computation of results.
   */
  updateFilter(partial: Partial<SearchFilter>): void {
    const current = this.filterSubject.getValue();
    this.filterSubject.next({ ...current, ...partial });
  }

  /**
   * Resets all search filters and sorting back to their initial state.
   */
  resetFilters(): void {
    this.filterSubject.next({ ...this.defaultFilter });
  }

  /**
   * Internal pure method to filter and sort property listings.
   */
  private applyFiltersAndSort(properties: Property[], filter: SearchFilter): Property[] {
    let result = [...properties];

    // 1. Text keyword search across title, address, description, and city
    if (filter.keyword && filter.keyword.trim().length > 0) {
      const q = filter.keyword.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // 2. City filter
    if (filter.city && filter.city !== 'All') {
      result = result.filter((p) => p.city.toLowerCase() === filter.city!.toLowerCase());
    }

    // 3. Property Type filter
    if (filter.type && filter.type !== 'All') {
      result = result.filter((p) => p.type.toLowerCase() === filter.type!.toLowerCase());
    }

    // 4. Minimum Price
    if (filter.minPrice !== undefined && filter.minPrice !== null && filter.minPrice > 0) {
      result = result.filter((p) => p.price >= filter.minPrice!);
    }

    // 5. Maximum Price
    if (filter.maxPrice !== undefined && filter.maxPrice !== null && filter.maxPrice > 0) {
      result = result.filter((p) => p.price <= filter.maxPrice!);
    }

    // 6. Minimum Bedrooms
    if (filter.bedrooms !== undefined && filter.bedrooms !== null && filter.bedrooms > 0) {
      result = result.filter((p) => p.bedrooms >= filter.bedrooms!);
    }

    // 7. Sorting
    switch (filter.sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'area':
        result.sort((a, b) => b.area - a.area);
        break;
      case 'newest':
      default:
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }
}

