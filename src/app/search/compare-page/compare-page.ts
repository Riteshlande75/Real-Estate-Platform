import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CompareService } from '../../core/services/compare.service';
import { Property } from '../../core/models/models';

@Component({
  selector: 'app-compare-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './compare-page.html',
  styleUrl: './compare-page.css',
})
export class ComparePage {
  private readonly compareService = inject(CompareService);
  private readonly router = inject(Router);

  // Observable list of compared properties
  readonly properties$ = this.compareService.comparedProperties$;
  readonly count$ = this.compareService.count$;
  readonly maxLimit = this.compareService.maxCompareLimit;

  // Master amenities list to compare against
  readonly comparisonAmenities = [
    'Swimming Pool',
    'Gymnasium',
    'Clubhouse',
    '24/7 Security',
    'Covered Parking',
    'Power Backup',
    'Private Garden',
    'Home Automation',
    'EV Charging',
    'Sea View',
    'Terrace Jacuzzi',
    'Concierge Desk',
  ];

  /**
   * Formats numeric price into standard Indian numbering currency (INR)
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Removes a property from the comparison set
   */
  removeProperty(id: string): void {
    this.compareService.remove(id);
  }

  /**
   * Clears the entire comparison list
   */
  clearAll(): void {
    this.compareService.clear();
  }

  /**
   * Navigates to full property details
   */
  viewDetails(id: string): void {
    this.router.navigate(['/properties', id]);
  }

  /**
   * Checks whether a property includes a specific amenity
   */
  hasAmenity(property: Property, amenity: string): boolean {
    if (!property.amenities) return false;
    return property.amenities.some((a) => a.toLowerCase() === amenity.toLowerCase());
  }
}
