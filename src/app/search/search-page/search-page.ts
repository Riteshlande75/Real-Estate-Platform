import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SearchService } from '../../core/services/search.service';
import { CompareService } from '../../core/services/compare.service';
import { FilterPanel } from '../filter-panel/filter-panel';
import { Property, SearchFilter } from '../../core/models/models';

@Component({
  selector: 'app-search-page',
  imports: [CommonModule, FilterPanel],
  templateUrl: './search-page.html',
  styleUrl: './search-page.css',
})
export class SearchPage {
  private readonly searchService = inject(SearchService);
  private readonly compareService = inject(CompareService);
  private readonly router = inject(Router);

  // Filtered reactive properties stream
  readonly results$ = this.searchService.results$;
  readonly filters$ = this.searchService.filters$;

  // User feedback toast
  toastMessage: string | null = null;
  private toastTimer: any = null;

  /**
   * Dispatches keyword text input to SearchService
   */
  onKeywordInput(keyword: string): void {
    this.searchService.updateFilter({ keyword });
  }

  /**
   * Clears keyword search input
   */
  clearKeyword(): void {
    this.searchService.updateFilter({ keyword: '' });
  }

  /**
   * Updates sorting order
   */
  onSortChange(sortBy: any): void {
    this.searchService.updateFilter({ sortBy: sortBy as SearchFilter['sortBy'] });
  }

  /**
   * Formats INR currency
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Navigates to full property detail view
   */
  viewDetails(id: string): void {
    this.router.navigate(['/properties', id]);
  }

  /**
   * Adds selected property to compare list via CompareService
   */
  addToCompare(property: Property, event: Event): void {
    event.stopPropagation();
    const result = this.compareService.add(property.id);
    this.showToast(result.message);
  }

  /**
   * Resets all search parameters
   */
  resetFilters(): void {
    this.searchService.resetFilters();
  }

  /**
   * Displays transient toast notification
   */
  private showToast(msg: string): void {
    this.toastMessage = msg;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }
}
