# 📖 Real Estate Platform — Full Documentation

> A comprehensive Angular 21 web application for real estate property listings, investment portfolio management, CRM, and market analytics.
>
---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Getting Started](#4-getting-started)
5. [Application Routes](#5-application-routes)
6. [Core Modules](#6-core-modules)
   - [Data Models](#data-models)
   - [Services](#services)
   - [Auth Guard](#auth-guard)
7. [Feature Modules](#7-feature-modules)
   - [Property Listings](#property-listings)
   - [Search & Compare](#search--compare)
   - [CRM (Auth + Agents + Clients + Enquiries)](#crm-auth--agents--clients--enquiries)
   - [Portfolio & Market Insights](#portfolio--market-insights)
8. [Authentication](#8-authentication)
9. [Data Persistence](#9-data-persistence)
10. [Build & Deployment](#10-build--deployment)
11. [Testing](#11-testing)
12. [Configuration Files](#12-configuration-files)
13. [Known Limitations & Future Improvements](#13-known-limitations--future-improvements)

---

## 1. Project Overview

The **Real Estate Platform** is a full-featured, Angular-based single-page application (SPA) with Server-Side Rendering (SSR) support. It is designed to serve multiple types of users — property seekers, real estate agents, CRM managers, and investors — through a unified, role-aware interface.

### Key Capabilities

| Feature | Description |
|---|---|
| 🏠 Property Listings | Browse, add, edit, and delete real estate properties |
| 🔍 Advanced Search | Keyword, city, type, price-range, and bedroom filters |
| ⚖️ Property Compare | Side-by-side comparison of up to 3 properties |
| 📊 Portfolio Dashboard | Track investments, gain/loss, and ROI metrics |
| 📈 Market Trends | City-wise price trend visualization using Chart.js |
| 🧮 ROI Calculator | Compute projected returns based on user inputs |
| 👥 CRM | Manage agents, clients, and property enquiries |
| 🔐 Auth System | Role-based login (Admin / Agent / Investor) |

---

## 2. Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | Angular | `^21.2.0` |
| Language | TypeScript | `~5.9.2` |
| Rendering | Angular SSR (`@angular/ssr`) | `^21.2.28` |
| Server | Express.js | `^5.1.0` |
| Charts | Chart.js + ng2-charts | `^4.6.1` / `^10.0.0` |
| Reactive | RxJS | `~7.8.0` |
| UI Toolkit | Angular CDK | `^21.2.14` |
| Testing | Vitest | `^4.0.8` |
| Formatting | Prettier | `^3.8.1` |
| Package Mgr | npm | `11.11.0` |

---

## 3. Project Structure

```
Real-Estate-Platform/
├── public/
│   └── data/
│       ├── properties.json       # Seed data for property listings
│       └── investments.json      # Seed data for portfolio investments
├── src/
│   ├── index.html                # Root HTML entry point
│   ├── main.ts                   # Client bootstrap
│   ├── main.server.ts            # SSR bootstrap
│   ├── server.ts                 # Express server for SSR
│   ├── styles.css                # Global styles
│   └── app/
│       ├── app.ts                # Root AppComponent
│       ├── app.html              # Root template
│       ├── app.css               # Root styles
│       ├── app.routes.ts         # All application routes
│       ├── app.config.ts         # App-level providers & config
│       ├── app.config.server.ts  # SSR-specific config merge
│       ├── app.routes.server.ts  # SSR route configuration
│       │
│       ├── core/
│       │   ├── guards/
│       │   │   └── auth.guard.ts          # CanActivateFn route guard
│       │   ├── models/
│       │   │   └── models.ts              # All TypeScript interfaces
│       │   └── services/
│       │       ├── auth.service.ts        # Authentication service
│       │       ├── property.service.ts    # Property CRUD service
│       │       ├── agent.service.ts       # Agent management service
│       │       ├── client.service.ts      # Client management service
│       │       ├── enquiry.service.ts     # Enquiry CRUD service
│       │       ├── compare.service.ts     # Property compare service
│       │       ├── portfolio.service.ts   # Investment portfolio service
│       │       └── market-insight.service.ts  # Market trend data service
│       │
│       ├── listings/
│       │   ├── property-list/    # Paginated property listing page
│       │   ├── property-detail/  # Single property view with gallery
│       │   ├── property-form/    # Add / Edit property form
│       │   └── image-gallery/    # Lightbox-style image gallery
│       │
│       ├── search/
│       │   ├── search-page/      # Main search results page
│       │   ├── filter-panel/     # Sidebar filter controls
│       │   └── compare-page/     # Side-by-side property comparison
│       │
│       ├── crm/
│       │   ├── login/            # Login form
│       │   ├── agent-list/       # Agent directory
│       │   ├── client-list/      # Client directory
│       │   ├── enquiry-list/     # Enquiry management table
│       │   └── enquiry-form/     # Submit / manage enquiry form
│       │
│       ├── portfolio/
│       │   ├── dashboard/        # Portfolio summary dashboard
│       │   ├── portfolio-list/   # Investments list with CRUD
│       │   ├── market-trends/    # Market trend charts
│       │   └── roi-calculator/   # ROI computation tool
│       │
│       └── shared/
│           ├── navbar/           # Global navigation bar
│           └── not-found/        # 404 page component
│
├── angular.json                  # Angular CLI workspace config
├── package.json                  # Node dependencies & scripts
├── tsconfig.json                 # Root TypeScript config
├── tsconfig.app.json             # App-specific TS config
├── tsconfig.spec.json            # Test-specific TS config
├── .prettierrc                   # Prettier code formatting rules
├── .editorconfig                 # Editor whitespace/indent rules
└── .gitignore                    # Git exclusions
```

---

## 4. Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) `>= 20.x`
- [npm](https://www.npmjs.com/) `>= 11.x`
- [Angular CLI](https://angular.dev/tools/cli) `>= 21.x`

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd Real-Estate-Platform

# 2. Install dependencies
npm install

# 3. Start the development server
npm start
# or
ng serve
```

Open your browser at `http://localhost:4200/`. The app auto-reloads on file changes.

### Demo Login Credentials

| Role | Username | Password |
|---|---|---|
| Admin | `admin` | `admin123` |
| Agent | `agent` | `agent123` |
| Investor | `investor` | `investor123` |

> **Note:** All data is stored in `localStorage`. No backend server is required for development.

---

## 5. Application Routes

All routes are lazily loaded for optimal performance.

| Path | Component | Auth Required | Description |
|---|---|---|---|
| `/` | — | No | Redirects to `/properties` |
| `/properties` | `PropertyList` | No | Browse all property listings |
| `/properties/new` | `PropertyForm` | ✅ Yes | Add a new property |
| `/properties/:id` | `PropertyDetail` | No | View property details & gallery |
| `/properties/:id/edit` | `PropertyForm` | ✅ Yes | Edit an existing property |
| `/search` | `SearchPage` | No | Search with filters |
| `/compare` | `ComparePage` | No | Side-by-side property compare |
| `/login` | `Login` | No | Authentication page |
| `/crm/agents` | `AgentList` | ✅ Yes | Manage real estate agents |
| `/crm/clients` | `ClientList` | ✅ Yes | Manage clients |
| `/crm/enquiries` | `EnquiryList` | ✅ Yes | View & manage enquiries |
| `/portfolio/dashboard` | `Dashboard` | ✅ Yes | Portfolio summary & KPIs |
| `/portfolio/investments` | `PortfolioList` | ✅ Yes | Track investment assets |
| `/portfolio/trends` | `MarketTrends` | ✅ Yes | Market trend charts |
| `/portfolio/roi-calculator` | `RoiCalculator` | ✅ Yes | Calculate property ROI |
| `/**` | `NotFound` | No | 404 fallback page |

> **Important:** `/properties/new` is declared **before** `/properties/:id` in the route configuration to prevent `'new'` being interpreted as an ID parameter.

---

## 6. Core Modules

### Data Models

**File:** [`src/app/core/models/models.ts`](src/app/core/models/models.ts)

All TypeScript interfaces used across the application:

#### `Property`
```ts
interface Property {
  id: string;
  title: string;
  description: string;
  price: number;              // In INR (₹)
  type: 'Apartment' | 'Villa' | 'Commercial' | 'Plot' | 'Penthouse';
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;               // In sq ft
  pricePerSqFt: number;       // Calculated from price / area
  amenities: string[];
  images: string[];
  featured?: boolean;
  createdAt: string;          // ISO date string
  agentId?: string;
}
```

#### `Agent`
```ts
interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  image?: string;
  rating?: number;
  activeListings?: number;
}
```

#### `Client`
```ts
interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  budget?: number;
  preferredType?: string;
}
```

#### `Enquiry`
```ts
interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
  status: 'New' | 'In Progress' | 'Closed';
  date: string;               // ISO date string
}
```

#### `Investment`
```ts
interface Investment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  city: string;
  purchasePrice: number;
  currentValue: number;
  monthlyRent: number;
  purchaseDate: string;       // YYYY-MM-DD
}
```

#### `MarketTrend`
```ts
interface MarketTrend {
  city: string;
  month: string;              // e.g. "Jan" or "2026-01"
  avgPricePerSqFt: number;
}
```

#### `SearchFilter`
```ts
interface SearchFilter {
  keyword?: string;
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'area';
}
```

---

### Services

All services are `providedIn: 'root'` (singletons) and use `BehaviorSubject` for reactive state with `localStorage` persistence as the data layer.

#### `PropertyService`
**File:** [`src/app/core/services/property.service.ts`](src/app/core/services/property.service.ts)

Manages the full lifecycle of property listings.

| Method | Signature | Description |
|---|---|---|
| `getAll()` | `Observable<Property[]>` | Returns all properties reactively |
| `getById(id)` | `Observable<Property \| undefined>` | Find property by ID |
| `add(property)` | `Observable<Property>` | Add new property (auto-generates ID, `createdAt`, `pricePerSqFt`) |
| `update(property)` | `Observable<Property>` | Update existing property |
| `delete(id)` | `Observable<boolean>` | Remove property by ID |

**Data flow:** `localStorage` → `BehaviorSubject` → `Observable` → Components

#### `AuthService`
**File:** [`src/app/core/services/auth.service.ts`](src/app/core/services/auth.service.ts)

Provides mock authentication with three pre-configured user roles.

| Method | Signature | Description |
|---|---|---|
| `login(username, password)` | `Observable<boolean>` | Validate credentials and persist session |
| `logout()` | `void` | Clear session from memory and localStorage |
| `isAuthenticated()` | `boolean` | Synchronous auth state check |
| `getUser()` | `AuthUser \| null` | Returns current logged-in user object |

**Observables:**
- `currentUser$` — emits the active `AuthUser` or `null`
- `isLoggedIn$` — emits `boolean` login state

#### `CompareService`
**File:** [`src/app/core/services/compare.service.ts`](src/app/core/services/compare.service.ts)

Manages property comparison selection (max 3 at a time).

| Method | Signature | Description |
|---|---|---|
| `add(id)` | `{ success, message }` | Add property ID to compare list |
| `remove(id)` | `void` | Remove property ID from compare list |
| `clear()` | `void` | Clear entire compare list |
| `isInCompare(id)` | `boolean` | Check if a property is in compare list |

**Observables:**
- `selectedIds$` — list of selected property IDs
- `comparedProperties$` — full `Property[]` objects for selected IDs
- `count$` — count of currently selected items

#### `PortfolioService`
**File:** [`src/app/core/services/portfolio.service.ts`](src/app/core/services/portfolio.service.ts)

Tracks investment assets with computed financial metrics.

| Observable | Type | Description |
|---|---|---|
| `investments$` | `Observable<Investment[]>` | All tracked investments |
| `totalInvested$` | `Observable<number>` | Sum of all purchase prices |
| `currentValue$` | `Observable<number>` | Sum of all current values |
| `gainLoss$` | `Observable<number>` | Current value minus purchase price |
| `gainLossPercent$` | `Observable<number>` | Gain/loss as a percentage |
| `totalMonthlyRent$` | `Observable<number>` | Sum of monthly rental income |
| `averageRoi$` | `Observable<number>` | Annual rent / total invested × 100 |

#### `AgentService` · `ClientService` · `EnquiryService` · `MarketInsightService`

Similar pattern — each manages its respective entity (Agent, Client, Enquiry, MarketTrend) via `BehaviorSubject` + `localStorage` with full CRUD operations.

---

### Auth Guard

**File:** [`src/app/core/guards/auth.guard.ts`](src/app/core/guards/auth.guard.ts)

A functional `CanActivateFn` guard that protects authenticated routes.

**Behavior:**
- If user **is authenticated** → allow navigation
- If user **is not authenticated** → redirect to `/login?returnUrl=<requested-path>`

**Protected routes include:**
- `/properties/new`, `/properties/:id/edit`
- `/crm/agents`, `/crm/clients`, `/crm/enquiries`
- `/portfolio/dashboard`, `/portfolio/investments`, `/portfolio/trends`, `/portfolio/roi-calculator`

---

## 7. Feature Modules

### Property Listings

| Component | Path | Description |
|---|---|---|
| `PropertyList` | `/properties` | Grid/list view of all properties with pagination and featured flags |
| `PropertyDetail` | `/properties/:id` | Full property page with image gallery, specs, amenities, and enquiry button |
| `PropertyForm` | `/properties/new` · `/properties/:id/edit` | Reactive form to create or edit a property |
| `ImageGallery` | (embedded) | Lightbox image viewer embedded in property detail |

### Search & Compare

| Component | Path | Description |
|---|---|---|
| `SearchPage` | `/search` | Displays filtered property results |
| `FilterPanel` | (embedded in search) | Sidebar with keyword, city, type, price, bedroom filters and sort options |
| `ComparePage` | `/compare` | Side-by-side property comparison table (up to 3 properties) |

### CRM (Auth + Agents + Clients + Enquiries)

| Component | Path | Description |
|---|---|---|
| `Login` | `/login` | Form-based login with username/password and returnUrl support |
| `AgentList` | `/crm/agents` | Searchable table of agents with CRUD controls |
| `ClientList` | `/crm/clients` | Searchable table of clients with CRUD controls |
| `EnquiryList` | `/crm/enquiries` | Enquiry management with status update (New / In Progress / Closed) |
| `EnquiryForm` | (embedded) | Form to submit a new property enquiry |

### Portfolio & Market Insights

| Component | Path | Description |
|---|---|---|
| `Dashboard` | `/portfolio/dashboard` | Summary cards: total invested, current value, gain/loss %, monthly rent, avg ROI |
| `PortfolioList` | `/portfolio/investments` | Full table of investment assets with add/edit/delete |
| `MarketTrends` | `/portfolio/trends` | Line charts of average price per sq ft by city & month (Chart.js) |
| `RoiCalculator` | `/portfolio/roi-calculator` | Interactive calculator for rental yield and capital appreciation |

---

## 8. Authentication

This platform uses a **client-side mock authentication** system — no backend API is involved.

### User Roles

| Role | Permissions |
|---|---|
| `admin` | Full access to all features |
| `agent` | Access to CRM modules, property management |
| `investor` | Access to portfolio and market insight modules |

### Session Persistence

Sessions are persisted in `localStorage` under the key `re_auth_user`. On page refresh, the stored session is restored automatically via `AuthService`.

### Login Flow

```
User submits credentials
  → AuthService.login()
    → Match against mockUsers record
      → Success: save to localStorage, emit currentUser$, redirect to returnUrl
      → Failure: show error message
```

---

## 9. Data Persistence

All data is stored client-side in the browser's `localStorage`. No external database or API is used.

| localStorage Key | Data | Service |
|---|---|---|
| `re_auth_user` | Logged-in user session | `AuthService` |
| `re_properties` | All property listings | `PropertyService` |
| `re_investments` | Portfolio investments | `PortfolioService` |
| `re_compare` | Compare selection IDs | `CompareService` |
| `re_agents` | Agent records | `AgentService` |
| `re_clients` | Client records | `ClientService` |
| `re_enquiries` | Enquiry records | `EnquiryService` |

### Seed Data

Initial data is loaded from static JSON files in `public/data/` when no localStorage cache exists:

- `public/data/properties.json` — pre-loaded property listings
- `public/data/investments.json` — pre-loaded portfolio investments

---

## 10. Build & Deployment

### Available Scripts

```bash
# Start development server (http://localhost:4200)
npm start

# Production build (output: dist/)
npm run build

# Watch mode build (development)
npm run watch

# Run unit tests
npm test

# Start SSR production server
npm run serve:ssr:real-estate-platform
```

### SSR Deployment

The app supports Angular Universal SSR via `@angular/ssr`. After building:

```bash
npm run build
node dist/real-estate-platform/server/server.mjs
```

The Express server handles SSR rendering and serves the Angular app.

---

## 11. Testing

Unit tests are written using **Vitest** (via Angular CLI integration).

```bash
npm test
# or
ng test
```

Test files follow the `*.spec.ts` convention and are co-located with their source files:

- `auth.guard.spec.ts` — Guard unit tests
- `auth.spec.ts` — AuthService tests
- `property.spec.ts` — PropertyService tests
- `compare.spec.ts` — CompareService tests
- `portfolio.spec.ts` — PortfolioService tests
- Component-level specs for each feature component

---

## 12. Configuration Files

| File | Purpose |
|---|---|
| [`angular.json`](angular.json) | Angular CLI workspace & build configuration |
| [`tsconfig.json`](tsconfig.json) | Root TypeScript compiler options |
| [`tsconfig.app.json`](tsconfig.app.json) | Application-specific TypeScript config |
| [`tsconfig.spec.json`](tsconfig.spec.json) | Test-specific TypeScript config |
| [`.prettierrc`](.prettierrc) | Code formatting rules (Prettier) |
| [`.editorconfig`](.editorconfig) | Editor whitespace and indentation rules |
| [`.gitignore`](.gitignore) | Files excluded from version control |

---

## 13. Known Limitations & Future Improvements

### Current Limitations

- **No real backend** — All data is stored in `localStorage`. Data is lost if the browser storage is cleared.
- **Mock authentication** — Credentials are hardcoded in the service. Not suitable for production use.
- **No image upload** — Property images use Unsplash URLs or user-provided image links.
- **Single-user session** — No multi-user or concurrent session support.

### Suggested Future Improvements

- [ ] Integrate a real REST API or Firebase backend for data persistence
- [ ] Add JWT-based authentication with refresh tokens
- [ ] Implement server-side search and filtering
- [ ] Add image upload support (e.g., Firebase Storage / Cloudinary)
- [ ] Add role-based UI restrictions (hide elements based on `AuthUser.role`)
- [ ] Add pagination API support for large datasets
- [ ] Add unit test coverage for all components
- [ ] Add end-to-end tests using Playwright or Cypress
- [ ] Add PWA (Progressive Web App) support
- [ ] Implement real-time notifications for new enquiries

---

*Documentation maintained for Real Estate Platform — Angular 21 | Last updated: November 2026*
