import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SearchService } from '../../core/services/search.service';

@Component({
  selector: 'app-filter-panel',
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-panel.html',
  styleUrl: './filter-panel.css',
})
export class FilterPanel {
  private readonly searchService = inject(SearchService);

  // Observable of current search parameters
  readonly filters$ = this.searchService.filters$;

  readonly cities = ['All', 'Mumbai', 'Bengaluru', 'Gurugram', 'Pune', 'Hyderabad', 'Delhi NCR'];
  readonly propertyTypes = ['All', 'Apartment', 'Villa', 'Commercial', 'Plot', 'Penthouse'];
  readonly bedroomOptions = [
    { label: 'Any', value: undefined },
    { label: '1+ BHK', value: 1 },
    { label: '2+ BHK', value: 2 },
    { label: '3+ BHK', value: 3 },
    { label: '4+ BHK', value: 4 },
  ];

  readonly pricePresets = [
    { label: 'Under ₹1 Cr', min: undefined, max: 10000000 },
    { label: '₹1 Cr - ₹3 Cr', min: 10000000, max: 30000000 },
    { label: '₹3 Cr - ₹6 Cr', min: 30000000, max: 60000000 },
    { label: '₹6 Cr +', min: 60000000, max: undefined },
  ];

  /**
   * Updates city filter in SearchService
   */
  setCity(city: string): void {
    this.searchService.updateFilter({ city });
  }

  /**
   * Updates property type filter
   */
  setType(type: string): void {
    this.searchService.updateFilter({ type });
  }

  /**
   * Updates minimum bedrooms requirement
   */
  setBedrooms(bedrooms: number | undefined): void {
    this.searchService.updateFilter({ bedrooms });
  }

  /**
   * Updates minimum price threshold
   */
  onMinPriceChange(val: string): void {
    const num = val ? Number(val) : undefined;
    this.searchService.updateFilter({ minPrice: num });
  }

  /**
   * Updates maximum price threshold
   */
  onMaxPriceChange(val: string): void {
    const num = val ? Number(val) : undefined;
    this.searchService.updateFilter({ maxPrice: num });
  }

  /**
   * Applies quick preset price bracket
   */
  setPricePreset(min?: number, max?: number): void {
    this.searchService.updateFilter({ minPrice: min, maxPrice: max });
  }

  /**
   * Resets all search parameters back to defaults
   */
  resetAll(): void {
    this.searchService.resetFilters();
  }
}
