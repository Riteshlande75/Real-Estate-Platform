import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EnquiryService } from '../../core/services/enquiry.service';

@Component({
  selector: 'app-enquiry-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './enquiry-form.html',
  styleUrl: './enquiry-form.css',
})
export class EnquiryForm {
  private readonly fb = inject(FormBuilder);
  private readonly enquiryService = inject(EnquiryService);

  // Property ID passed from property-detail parent component
  @Input() propertyId: string | number = '';

  isSubmitted = false;
  isSubmitting = false;

  enquiryForm: FormGroup = this.fb.group({
    clientName: ['', [Validators.required, Validators.minLength(3)]],
    clientEmail: ['', [Validators.required, Validators.email]],
    clientPhone: ['', [Validators.required, Validators.minLength(8)]],
    message: ['', [Validators.required, Validators.minLength(10)]],
  });

  isInvalid(controlName: string): boolean {
    const c = this.enquiryForm.get(controlName);
    return !!(c && c.invalid && (c.dirty || c.touched));
  }

  onSubmit(): void {
    if (this.enquiryForm.invalid) {
      this.enquiryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const formVal = this.enquiryForm.getRawValue();

    this.enquiryService.add({
      propertyId: String(this.propertyId || 'general'),
      clientName: formVal.clientName,
      clientEmail: formVal.clientEmail,
      clientPhone: formVal.clientPhone,
      message: formVal.message,
      status: 'New',
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isSubmitted = true;
        this.enquiryForm.reset();
      },
      error: (err) => {
        console.error('Enquiry submit error:', err);
        this.isSubmitting = false;
      },
    });
  }

  sendAnother(): void {
    this.isSubmitted = false;
  }
}
