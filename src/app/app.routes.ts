import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Default redirect
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'properties'
  },

  // Member 1: Property Listings, Details, Form
  {
    path: 'properties',
    loadComponent: () =>
      import('./listings/property-list/property-list').then((m) => m.PropertyList)
  },
  // NOTE: /properties/new must be defined BEFORE /properties/:id to avoid matching 'new' as an ID
  {
    path: 'properties/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./listings/property-form/property-form').then((m) => m.PropertyForm)
  },
  {
    path: 'properties/:id',
    loadComponent: () =>
      import('./listings/property-detail/property-detail').then((m) => m.PropertyDetail)
  },
  {
    path: 'properties/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./listings/property-form/property-form').then((m) => m.PropertyForm)
  },

  // Member 2: Search, Filters & Compare
  {
    path: 'search',
    loadComponent: () =>
      import('./search/search-page/search-page').then((m) => m.SearchPage)
  },
  {
    path: 'compare',
    loadComponent: () =>
      import('./search/compare-page/compare-page').then((m) => m.ComparePage)
  },

  // Member 3: Auth & CRM
  {
    path: 'login',
    loadComponent: () =>
      import('./crm/login/login').then((m) => m.Login)
  },
  {
    path: 'crm/agents',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./crm/agent-list/agent-list').then((m) => m.AgentList)
  },
  {
    path: 'crm/clients',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./crm/client-list/client-list').then((m) => m.ClientList)
  },
  {
    path: 'crm/enquiries',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./crm/enquiry-list/enquiry-list').then((m) => m.EnquiryList)
  },

  // Member 4: Portfolio, Market Trends & ROI Calculator
  {
    path: 'portfolio/dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./portfolio/dashboard/dashboard').then((m) => m.Dashboard)
  },
  {
    path: 'portfolio/investments',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./portfolio/portfolio-list/portfolio-list').then((m) => m.PortfolioList)
  },
  {
    path: 'portfolio/trends',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./portfolio/market-trends/market-trends').then((m) => m.MarketTrends)
  },
  {
    path: 'portfolio/roi-calculator',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./portfolio/roi-calculator/roi-calculator').then((m) => m.RoiCalculator)
  },

  // Wildcard / 404 Route
  {
    path: '**',
    loadComponent: () =>
      import('./shared/not-found/not-found').then((m) => m.NotFound)
  }
];
