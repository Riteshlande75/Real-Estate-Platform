import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PropertyService } from '../../core/services/property.service';
import { Property, Investment } from '../../core/models/models';
import { ImageGallery } from '../image-gallery/image-gallery';
import { EnquiryForm } from '../../crm/enquiry-form/enquiry-form';

@Component({
  selector: 'app-property-detail',
  imports: [CommonModule, RouterLink, ImageGallery, EnquiryForm],
  templateUrl: './property-detail.html',
  styleUrl: './property-detail.css',
})
export class PropertyDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyService);

  // Observable of the currently selected property based on the :id route parameter
  readonly property$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      return id ? this.propertyService.getById(id) : of(undefined);
    })
  );

  // Feedback toast message
  toastMessage: string | null = null;
  private toastTimer: any = null;

  /**
   * Formats numeric price into INR currency (e.g. ₹4,25,00,000)
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }

  /**
   * Navigates back to the main properties directory
   */
  goBack(): void {
    this.router.navigate(['/properties']);
  }

  /**
   * Adds the current property to the comparison list (stored in localStorage)
   */
  addToCompare(property: Property): void {
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
      this.showToast(`Added "${property.title}" to Compare (${compareIds.length}/3).`);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  /**
   * Adds the property to the investor portfolio (stored in localStorage re_investments)
   */
  addToPortfolio(property: Property): void {
    try {
      const stored = localStorage.getItem('re_investments');
      let investments: Investment[] = stored ? JSON.parse(stored) : [];

      const exists = investments.some((inv) => inv.propertyId === property.id);
      if (exists) {
        this.showToast(`"${property.title}" is already in your Investment Portfolio.`);
        return;
      }

      const newInvestment: Investment = {
        id: 'inv-' + Date.now(),
        propertyId: property.id,
        propertyTitle: property.title,
        city: property.city,
        purchasePrice: property.price,
        currentValue: property.price,
        monthlyRent: Math.round(property.price * 0.0035), // Estimated ~4.2% annual rental yield
        purchaseDate: new Date().toISOString().split('T')[0],
      };

      investments.push(newInvestment);
      localStorage.setItem('re_investments', JSON.stringify(investments));
      this.showToast(`Successfully added "${property.title}" to your Portfolio!`);
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  /**
   * Shows a transient user notification
   */
  private showToast(msg: string): void {
    this.toastMessage = msg;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }
}
