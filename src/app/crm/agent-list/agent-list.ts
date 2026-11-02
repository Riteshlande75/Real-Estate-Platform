import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AgentService } from '../../core/services/agent.service';
import { AuthService } from '../../core/services/auth.service';
import { Agent } from '../../core/models/models';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-agent-list',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './agent-list.html',
  styleUrl: './agent-list.css',
})
export class AgentList {
  private readonly agentService = inject(AgentService);
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder);

  /** Admin privilege stream for template rendering */
  readonly isAdmin$: Observable<boolean> = this.authService.isAdmin$;

  // Search filter subject
  readonly searchSubject = new BehaviorSubject<string>('');
  readonly searchTerm$ = this.searchSubject.asObservable();

  // Filtered agents stream
  readonly filteredAgents$: Observable<Agent[]> = combineLatest([
    this.agentService.getAll(),
    this.searchTerm$,
  ]).pipe(
    map(([agents, query]) => {
      if (!query || query.trim() === '') return agents;
      const q = query.toLowerCase().trim();
      return agents.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.city.toLowerCase().includes(q) ||
          a.email.toLowerCase().includes(q)
      );
    })
  );

  // Form modal state
  showFormModal = false;
  editingAgentId: string | null = null;
  toastMessage: string | null = null;
  private toastTimer: any = null;

  // Reactive agent form
  agentForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.minLength(8)]],
    city: ['Mumbai', [Validators.required]],
    activeListings: [5, [Validators.required, Validators.min(0)]],
    rating: [4.8, [Validators.required, Validators.min(1), Validators.max(5)]],
    image: [''],
  });

  readonly cities = ['Mumbai', 'Bengaluru', 'Gurugram', 'Pune', 'Hyderabad', 'Delhi NCR', 'Chennai'];

  /**
   * Updates text search filter
   */
  onSearchInput(query: string): void {
    this.searchSubject.next(query);
  }

  /**
   * Opens modal to add a brand new agent (restricted to Admin)
   */
  openAddModal(): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Access restricted: Only administrators can register new agents.');
      return;
    }

    this.editingAgentId = null;
    this.agentForm.reset({
      name: '',
      email: '',
      phone: '',
      city: 'Mumbai',
      activeListings: 5,
      rating: 4.8,
      image: '',
    });
    this.showFormModal = true;
  }

  /**
   * Opens modal to edit an existing agent (restricted to Admin)
   */
  openEditModal(agent: Agent): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Access restricted: Only administrators can edit agent details.');
      return;
    }

    this.editingAgentId = agent.id;
    this.agentForm.patchValue({
      name: agent.name,
      email: agent.email,
      phone: agent.phone,
      city: agent.city,
      activeListings: agent.activeListings || 1,
      rating: agent.rating || 5.0,
      image: agent.image || '',
    });
    this.showFormModal = true;
  }

  /**
   * Closes agent form modal
   */
  closeModal(): void {
    this.showFormModal = false;
    this.editingAgentId = null;
  }

  /**
   * Handles agent form submission (add/update)
   */
  saveAgent(): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Access Denied: Only administrators have write permissions for agents.');
      return;
    }

    if (this.agentForm.invalid) {
      this.agentForm.markAllAsTouched();
      return;
    }

    const formVal = this.agentForm.getRawValue();
    const fallbackImg =
      formVal.image && formVal.image.trim() !== ''
        ? formVal.image
        : 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80';

    if (this.editingAgentId) {
      const updated: Agent = {
        id: this.editingAgentId,
        ...formVal,
        image: fallbackImg,
      };
      this.agentService.update(updated).subscribe(() => {
        this.showToast(`Agent "${updated.name}" updated successfully.`);
        this.closeModal();
      });
    } else {
      this.agentService.add({ ...formVal, image: fallbackImg }).subscribe((created) => {
        this.showToast(`New agent "${created.name}" registered successfully.`);
        this.closeModal();
      });
    }
  }

  /**
   * Prompts and deletes an agent record (restricted to Admin)
   */
  deleteAgent(id: string, name: string): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Access Denied: Only administrators can delete agents.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete agent "${name}"?`)) {
      this.agentService.delete(id).subscribe(() => {
        this.showToast(`Agent "${name}" removed from registry.`);
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
