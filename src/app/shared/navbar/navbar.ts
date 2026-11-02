import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CompareService } from '../../core/services/compare.service';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly compareService = inject(CompareService);
  private readonly router = inject(Router);

  /** Auth state observable */
  readonly isLoggedIn$ = this.authService.isLoggedIn$;
  /** Current logged in user */
  readonly currentUser$ = this.authService.currentUser$;
  /** Selected properties count for comparison badge */
  readonly compareCount$ = this.compareService.count$;

  /** Mobile navigation collapse toggle */
  isMobileMenuOpen = false;
  /** Active desktop dropdown tracking */
  activeDropdown: 'portfolio' | 'crm' | null = null;

  /**
   * Toggles the mobile menu open/closed state.
   */
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  /**
   * Closes the mobile navigation drawer when a link is clicked.
   */
  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
    this.activeDropdown = null;
  }

  /**
   * Toggles a desktop dropdown menu.
   */
  toggleDropdown(dropdown: 'portfolio' | 'crm'): void {
    this.activeDropdown = this.activeDropdown === dropdown ? null : dropdown;
  }

  /**
   * Closes open dropdown menus.
   */
  closeDropdown(): void {
    this.activeDropdown = null;
  }

  /**
   * Logs out the current user, clears navigation state, and redirects to login.
   */
  logout(): void {
    this.authService.logout();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }
}
