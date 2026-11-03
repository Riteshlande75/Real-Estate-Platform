import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { PropertyService } from '../../core/services/property.service';
import { CompareService } from '../../core/services/compare.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Property } from '../../core/models/models';
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
  private readonly compareService = inject(CompareService);
  private readonly portfolioService = inject(PortfolioService);

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
   * Adds the current property to the comparison list via CompareService
   */
  addToCompare(property: Property): void {
    const result = this.compareService.add(property.id);
    this.showToast(result.message);
  }

  /**
   * Adds the property to the investor portfolio via PortfolioService
   */
  addToPortfolio(property: Property): void {
    this.portfolioService.add({
      propertyId: property.id,
      propertyTitle: property.title,
      city: property.city,
      purchasePrice: property.price,
      currentValue: property.price,
      monthlyRent: Math.round(property.price * 0.0035), // Estimated ~4.2% annual rental yield
      purchaseDate: new Date().toISOString().split('T')[0],
    }).subscribe({
      next: () => {
        this.showToast(`Successfully added "${property.title}" to your Portfolio!`);
      },
      error: () => {
        this.showToast(`Unable to add "${property.title}" to portfolio.`);
      }
    });
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
