import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EnquiryService } from '../../core/services/enquiry.service';
import { Enquiry } from '../../core/models/models';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-enquiry-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './enquiry-list.html',
  styleUrl: './enquiry-list.css',
})
export class EnquiryList {
  private readonly enquiryService = inject(EnquiryService);

  // Status filter state
  readonly activeStatus$ = new BehaviorSubject<string>('All');
  readonly statusOptions = ['All', 'New', 'In Progress', 'Closed'];

  // All enquiries observable
  readonly allEnquiries$ = this.enquiryService.getAll();

  // Filtered enquiries based on chosen status tab
  readonly filteredEnquiries$: Observable<Enquiry[]> = combineLatest([
    this.allEnquiries$,
    this.activeStatus$,
  ]).pipe(
    map(([list, status]) => {
      if (status === 'All') return list;
      return list.filter((e) => e.status === status);
    })
  );

  // Toast feedback
  toastMessage: string | null = null;
  private toastTimer: any = null;

  setStatusFilter(status: string): void {
    this.activeStatus$.next(status);
  }

  /**
   * Updates an enquiry's status dropdown directly
   */
  onStatusChange(enquiryId: string, newStatus: any): void {
    const status = newStatus as 'New' | 'In Progress' | 'Closed';
    this.enquiryService.updateStatus(enquiryId, status).subscribe({
      next: () => this.showToast(`Enquiry status updated to "${status}".`),
    });
  }

  /**
   * Deletes an enquiry
   */
  deleteEnquiry(id: string): void {
    if (window.confirm('Are you sure you want to delete this enquiry record?')) {
      this.enquiryService.delete(id).subscribe({
        next: () => this.showToast('Enquiry deleted successfully.'),
      });
    }
  }

  /**
   * Formats ISO date into readable format
   */
  formatDate(dateStr: string): string {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
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
