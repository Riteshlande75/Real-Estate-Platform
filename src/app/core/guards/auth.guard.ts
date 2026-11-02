import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Functional route guard that protects restricted routes (/crm/*, /portfolio/*, /properties/new, etc.)
 * Redirects unauthenticated requests to /login while maintaining the returnUrl query parameter.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Redirect to login page and preserve requested destination
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url },
  });
};

