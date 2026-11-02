import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../core/services/client.service';
import { Client } from '../../core/models/models';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-client-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './client-list.html',
  styleUrl: './client-list.css',
})
export class ClientList {
  private readonly clientService = inject(ClientService);
  private readonly fb = inject(FormBuilder);

  // Search filter stream
  readonly searchSubject = new BehaviorSubject<string>('');
  readonly searchTerm$ = this.searchSubject.asObservable();

  // Filtered clients list
  readonly filteredClients$: Observable<Client[]> = combineLatest([
    this.clientService.getAll(),
    this.searchTerm$,
  ]).pipe(
    map(([clients, query]) => {
      if (!query || query.trim() === '') return clients;
      const q = query.toLowerCase().trim();
      return clients.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.preferredType && c.preferredType.toLowerCase().includes(q))
      );
    })
  );

  // Modal / Form state
  showModal = false;
  editingClientId: string | null = null;
  toastMessage: string | null = null;
  private toastTimer: any = null;

  readonly cities = ['Mumbai', 'Bengaluru', 'Gurugram', 'Pune', 'Hyderabad', 'Delhi NCR', 'Chennai'];
  readonly propertyTypes = ['Apartment', 'Villa', 'Commercial', 'Plot', 'Penthouse'];

  // Reactive client form
  clientForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    city: ['Mumbai', [Validators.required]],
    budget: [25000000, [Validators.required, Validators.min(100000)]],
    preferredType: ['Apartment', [Validators.required]],
  });

  onSearch(val: string): void {
    this.searchSubject.next(val);
  }

  formatBudget(val?: number): string {
    if (!val) return 'Flexible';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  }

  openAddModal(): void {
    this.editingClientId = null;
    this.clientForm.reset({
      name: '',
      email: '',
      phone: '',
      city: 'Mumbai',
      budget: 25000000,
      preferredType: 'Apartment',
    });
    this.showModal = true;
  }

  openEditModal(client: Client): void {
    this.editingClientId = client.id;
    this.clientForm.patchValue({
      name: client.name,
      email: client.email,
      phone: client.phone,
      city: client.city,
      budget: client.budget || 20000000,
      preferredType: client.preferredType || 'Apartment',
    });
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.editingClientId = null;
  }

  saveClient(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    const formVal = this.clientForm.getRawValue();

    if (this.editingClientId) {
      const updated: Client = {
        id: this.editingClientId,
        ...formVal,
      };
      this.clientService.update(updated).subscribe(() => {
        this.showToast(`Client "${updated.name}" updated successfully.`);
        this.closeModal();
      });
    } else {
      this.clientService.add(formVal).subscribe((created) => {
        this.showToast(`Client "${created.name}" created successfully.`);
        this.closeModal();
      });
    }
  }

  deleteClient(id: string, name: string): void {
    if (window.confirm(`Are you sure you want to delete client record "${name}"?`)) {
      this.clientService.delete(id).subscribe(() => {
        this.showToast(`Client "${name}" deleted.`);
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
