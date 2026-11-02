import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { PropertyService } from '../../core/services/property.service';
import { Property } from '../../core/models/models';

@Component({
  selector: 'app-property-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './property-list.html',
  styleUrl: './property-list.css',
})
export class PropertyList {
  private readonly propertyService = inject(PropertyService);
  private readonly router = inject(Router);

  // Observable list of all properties
  readonly properties$ = this.propertyService.getAll();

  // Temporary notification toast message
  toastMessage: string | null = null;
  private toastTimer: any = null;

  /**
   * Formats numbers into INR currency (e.g. ₹4,25,00,000)
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Formats price per square foot
   */
  formatPricePerSqFt(val: number): string {
    return '₹' + new Intl.NumberFormat('en-IN').format(val) + ' / sq ft';
  }

  /**
   * Navigates to the full property details page
   */
  viewDetails(id: string): void {
    this.router.navigate(['/properties', id]);
  }

  /**
   * Navigates directly to property edit form
   */
  editProperty(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/properties', id, 'edit']);
  }

  /**
   * Prompts user and deletes a property by ID
   */
  deleteProperty(id: string, title: string, event: Event): void {
    event.stopPropagation();
    const confirmed = window.confirm(`Are you sure you want to delete listing: "${title}"?`);
    if (confirmed) {
      this.propertyService.delete(id).subscribe({
        next: () => this.showToast(`Listing "${title}" deleted successfully.`),
        error: (err) => console.error('Error deleting property:', err),
      });
    }
  }

  /**
   * Saves property ID into compare list (max 3 items) in localStorage
   */
  addToCompare(property: Property, event: Event): void {
    event.stopPropagation();
    try {
      const stored = localStorage.getItem('re_compare');
      let compareIds: string[] = stored ? JSON.parse(stored) : [];

      if (compareIds.includes(property.id)) {
        this.showToast(`"${property.title}" is already in comparison list.`);
        return;
      }

      if (compareIds.length >= 3) {
        this.showToast('You can compare a maximum of 3 properties at once.');
        return;
      }

      compareIds.push(property.id);
      localStorage.setItem('re_compare', JSON.stringify(compareIds));
      this.showToast(`Added "${property.title}" to Compare list (${compareIds.length}/3).`);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  /**
   * Displays temporary on-screen toast feedback
   */
  private showToast(msg: string): void {
    this.toastMessage = msg;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }
}
