import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PortfolioService } from '../../core/services/portfolio.service';
import { Investment } from '../../core/models/models';

@Component({
  selector: 'app-portfolio-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './portfolio-list.html',
  styleUrl: './portfolio-list.css',
})
export class PortfolioList {
  private readonly portfolioService = inject(PortfolioService);
  private readonly fb = inject(FormBuilder);

  // Financial observables
  readonly investments$ = this.portfolioService.investments$;
  readonly totalInvested$ = this.portfolioService.totalInvested$;
  readonly currentValue$ = this.portfolioService.currentValue$;
  readonly gainLoss$ = this.portfolioService.gainLoss$;
  readonly gainLossPercent$ = this.portfolioService.gainLossPercent$;
  readonly totalMonthlyRent$ = this.portfolioService.totalMonthlyRent$;

  // Modal & notification state
  showAddModal = false;
  toastMessage: string | null = null;
  private toastTimer: any = null;

  readonly cities = ['Mumbai', 'Bengaluru', 'Gurugram', 'Pune', 'Hyderabad', 'Delhi NCR', 'Chennai'];

  // Add investment reactive form
  investmentForm: FormGroup = this.fb.group({
    propertyTitle: ['', [Validators.required, Validators.minLength(4)]],
    city: ['Mumbai', [Validators.required]],
    purchasePrice: [25000000, [Validators.required, Validators.min(100000)]],
    currentValue: [27500000, [Validators.required, Validators.min(100000)]],
    monthlyRent: [90000, [Validators.required, Validators.min(0)]],
    purchaseDate: [new Date().toISOString().split('T')[0], [Validators.required]],
  });

  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }

  getGain(item: Investment): number {
    return (Number(item.currentValue) || 0) - (Number(item.purchasePrice) || 0);
  }

  getGainPercent(item: Investment): number {
    const buy = Number(item.purchasePrice) || 1;
    const cur = Number(item.currentValue) || 0;
    return Number((((cur - buy) / buy) * 100).toFixed(1));
  }

  openAddModal(): void {
    this.investmentForm.reset({
      propertyTitle: '',
      city: 'Mumbai',
      purchasePrice: 25000000,
      currentValue: 27500000,
      monthlyRent: 90000,
      purchaseDate: new Date().toISOString().split('T')[0],
    });
    this.showAddModal = true;
  }

  closeModal(): void {
    this.showAddModal = false;
  }

  saveInvestment(): void {
    if (this.investmentForm.invalid) {
      this.investmentForm.markAllAsTouched();
      return;
    }

    const val = this.investmentForm.getRawValue();
    const newInv: Omit<Investment, 'id'> = {
      propertyId: 'custom-' + Date.now(),
      propertyTitle: val.propertyTitle,
      city: val.city,
      purchasePrice: Number(val.purchasePrice),
      currentValue: Number(val.currentValue),
      monthlyRent: Number(val.monthlyRent),
      purchaseDate: val.purchaseDate,
    };

    this.portfolioService.add(newInv).subscribe((created) => {
      this.showToast(`Asset "${created.propertyTitle}" added to portfolio.`);
      this.closeModal();
    });
  }

  deleteInvestment(id: string, title: string): void {
    if (window.confirm(`Are you sure you want to remove "${title}" from your portfolio?`)) {
      this.portfolioService.delete(id).subscribe(() => {
        this.showToast(`Removed "${title}" from portfolio.`);
      });
    }
  }

  private showToast(msg: string): void {
    this.toastMessage = msg;
    if (this.toastTimer) clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toastMessage = null;
    }, 3500);
  }
}
