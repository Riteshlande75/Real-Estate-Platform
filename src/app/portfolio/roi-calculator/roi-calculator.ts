import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

export interface RoiResults {
  annualRentGross: number;
  annualRentNet: number;
  grossYieldPercent: number;
  netYieldPercent: number;
  capitalAppreciation: number;
  capitalAppreciationPercent: number;
  totalNetProfit: number;
  totalRoiPercent: number;
  annualizedRoiPercent: number;
}

@Component({
  selector: 'app-roi-calculator',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './roi-calculator.html',
  styleUrl: './roi-calculator.css',
})
export class RoiCalculator implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Reactive inputs form
  roiForm: FormGroup = this.fb.group({
    purchasePrice: [10000000, [Validators.required, Validators.min(100000)]],
    currentValue: [12500000, [Validators.required, Validators.min(100000)]],
    monthlyRent: [45000, [Validators.required, Validators.min(0)]],
    annualExpenses: [50000, [Validators.required, Validators.min(0)]],
    holdingYears: [3, [Validators.required, Validators.min(1), Validators.max(30)]],
  });

  // Computed results state
  results: RoiResults = {
    annualRentGross: 0,
    annualRentNet: 0,
    grossYieldPercent: 0,
    netYieldPercent: 0,
    capitalAppreciation: 0,
    capitalAppreciationPercent: 0,
    totalNetProfit: 0,
    totalRoiPercent: 0,
    annualizedRoiPercent: 0,
  };

  ngOnInit(): void {
    this.computeRoi();
    // Re-compute live whenever any form input changes
    this.roiForm.valueChanges.subscribe(() => {
      this.computeRoi();
    });
  }

  /**
   * Performs financial calculations for real estate cash flows & returns
   */
  computeRoi(): void {
    const val = this.roiForm.getRawValue();
    const purchase = Number(val.purchasePrice) || 1;
    const current = Number(val.currentValue) || purchase;
    const monthlyRent = Number(val.monthlyRent) || 0;
    const expenses = Number(val.annualExpenses) || 0;
    const years = Math.max(1, Number(val.holdingYears) || 1);

    const annualRentGross = monthlyRent * 12;
    const annualRentNet = Math.max(0, annualRentGross - expenses);
    const grossYieldPercent = Number(((annualRentGross / purchase) * 100).toFixed(2));
    const netYieldPercent = Number(((annualRentNet / purchase) * 100).toFixed(2));

    const capitalAppreciation = current - purchase;
    const capitalAppreciationPercent = Number(((capitalAppreciation / purchase) * 100).toFixed(2));

    const cumulativeRentalProfit = annualRentNet * years;
    const totalNetProfit = capitalAppreciation + cumulativeRentalProfit;
    const totalRoiPercent = Number(((totalNetProfit / purchase) * 100).toFixed(2));
    const annualizedRoiPercent = Number((totalRoiPercent / years).toFixed(2));

    this.results = {
      annualRentGross,
      annualRentNet,
      grossYieldPercent,
      netYieldPercent,
      capitalAppreciation,
      capitalAppreciationPercent,
      totalNetProfit,
      totalRoiPercent,
      annualizedRoiPercent,
    };
  }

  /**
   * Helper to format numbers in standard INR currency
   */
  formatPrice(val: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  }

  /**
   * Preset investment scenarios for quick demonstration
   */
  loadPreset(scenario: 'residential' | 'commercial' | 'luxury'): void {
    if (scenario === 'residential') {
      this.roiForm.patchValue({
        purchasePrice: 9500000,
        currentValue: 11500000,
        monthlyRent: 38000,
        annualExpenses: 40000,
        holdingYears: 3,
      });
    } else if (scenario === 'commercial') {
      this.roiForm.patchValue({
        purchasePrice: 28000000,
        currentValue: 33000000,
        monthlyRent: 195000,
        annualExpenses: 120000,
        holdingYears: 5,
      });
    } else if (scenario === 'luxury') {
      this.roiForm.patchValue({
        purchasePrice: 42500000,
        currentValue: 51000000,
        monthlyRent: 160000,
        annualExpenses: 200000,
        holdingYears: 4,
      });
    }
  }
}
