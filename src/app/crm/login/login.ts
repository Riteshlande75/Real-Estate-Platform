import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // Live session status
  readonly isLoggedIn$ = this.authService.isLoggedIn$;
  readonly currentUser$ = this.authService.currentUser$;

  returnUrl = '/properties';
  errorMessage: string | null = null;
  isLoading = false;

  // Reactive login form
  loginForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  ngOnInit(): void {
    // Read optional returnUrl parameter
    const queryReturn = this.route.snapshot.queryParams['returnUrl'];
    if (queryReturn) {
      this.returnUrl = queryReturn;
    }

    // Redirect immediately if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigateByUrl(this.returnUrl);
    }
  }

  /**
   * Helper to quickly populate test credentials for review/demo
   */
  fillDemoCredentials(username: string, pass: string): void {
    this.loginForm.patchValue({
      username,
      password: pass,
    });
    this.errorMessage = null;
  }

  /**
   * Form submission handler
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

    const { username, password } = this.loginForm.getRawValue();

    this.authService.login(username, password).subscribe({
      next: (success) => {
        this.isLoading = false;
        if (success) {
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.errorMessage = 'Invalid username or password. Please use one of the demo credentials below.';
        }
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'An unexpected authentication error occurred.';
      },
    });
  }

  /**
   * Logs out current user from the session
   */
  logout(): void {
    this.authService.logout();
  }
}
