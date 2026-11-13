# 📖 Real Estate Platform — Documentation

> An Angular 21 web application for property listings, investment portfolio management, CRM, and real estate market analytics.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Project Structure](#3-project-structure)
4. [Getting Started](#4-getting-started)
5. [Application Routes](#5-application-routes)
6. [Core Services & State Architecture](#6-core-services--state-architecture)
7. [Data Models](#7-data-models)
8. [Authentication & Access Control](#8-authentication--access-control)
9. [Data Persistence & Seed Assets](#9-data-persistence--seed-assets)
10. [Build, SSR & Testing](#10-build-ssr--testing)

---

## 1. Project Overview

The **Real Estate Platform** is a full-featured single-page application (SPA) with Server-Side Rendering (SSR) capabilities. It provides a role-aware interface for property buyers, real estate agents, CRM managers, and property investors.

### Key Capabilities

| Feature | Description |
|---|---|
| 🏠 **Property Listings** | Browse, create, edit, and delete real estate properties with image galleries |
| 🔍 **Advanced Search & Filtering** | Real-time multi-filter search (keyword, city, property type, price range, BHK) |
| ⚖️ **Property Comparison** | Side-by-side comparison matrix for up to 3 properties simultaneously |
| 📊 **Portfolio Dashboard** | Real-time investment tracking, ROI benchmarks, and computed gain/loss metrics |
| 📈 **Market Trends** | City-wise historical property price trends visualized via Chart.js |
| 🧮 **ROI Calculator** | Interactive tool for rental yield and capital appreciation projections |
| 👥 **CRM Management** | Directories for agents and clients, with full enquiry lifecycle tracking |
| 🔐 **Role-Based Auth** | Pre-configured authentication for Admin, Agent, and Investor roles |

---

## 2. Tech Stack

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Framework | Angular | `^21.2.0` | Standalone component architecture & routing |
| Language | TypeScript | `~5.9.2` | Static typing and interfaces |
| Rendering & Server | `@angular/ssr` + Express | `^21.2.28` / `^5.1.0` | Server-Side Rendering and production server |
| Reactive State | RxJS | `~7.8.0` | `BehaviorSubject` reactive streams |
| Visualizations | Chart.js + ng2-charts | `^4.6.1` / `^10.0.0` | Market trend charts and data graphs |
| UI Utilities | Angular CDK | `^21.2.14` | Component development kit utilities |
| Unit Testing | Vitest | `^4.0.8` | Component and service unit tests |
| Code Formatting | Prettier | `^3.8.1` | Code style enforcement |

---

## 3. Project Structure

```
Real-Estate-Platform/
├── public/
│   └── data/                     # Seed JSON datasets
│       ├── agents.json           # Seed agent records
│       ├── clients.json          # Seed client records
│       ├── enquiries.json        # Seed customer enquiries
│       ├── investments.json      # Seed portfolio investments
│       ├── market-trends.json    # Seed city price trend data
│       └── properties.json       # Seed property listings
├── src/
│   ├── index.html                # Application root HTML
│   ├── main.ts                   # Client application entry point
│   ├── main.server.ts            # Server-Side Rendering entry point
│   ├── server.ts                 # Express SSR server
│   ├── styles.css                # Global styles
│   └── app/
│       ├── app.ts                # Root AppComponent
│       ├── app.routes.ts         # Application routing configuration
│       ├── app.config.ts         # Client providers & app configuration
│       ├── app.config.server.ts  # SSR configuration merge
│       │
│       ├── core/
│       │   ├── guards/
│       │   │   └── auth.guard.ts           # Functional route guard (CanActivateFn)
│       │   ├── models/
│       │   │   └── models.ts               # Core TypeScript domain models
│       │   └── services/
│       │       ├── agent.service.ts        # Agent CRM data service
│       │       ├── auth.service.ts         # Authentication & session service
│       │       ├── client.service.ts       # Client CRM data service
│       │       ├── compare.service.ts      # Property comparison engine service
│       │       ├── enquiry.service.ts      # Enquiry management data service
│       │       ├── market-insight.service.ts # Market trends data service
│       │       ├── portfolio.service.ts    # Investment & ROI computation service
│       │       ├── property.service.ts     # Property listing CRUD service
│       │       └── search.service.ts       # Multi-parameter search & sort service
│       │
│       ├── listings/             # Property list, detail, form & image gallery
│       ├── search/               # Search results, filter panel & comparison view
│       ├── crm/                  # Login, agent directory, client directory & enquiries
│       ├── portfolio/            # Dashboard, investments list, market trends & ROI calculator
│       └── shared/               # Navbar & 404 NotFound components
│
├── angular.json                  # Angular CLI build & workspace configuration
├── package.json                  # Project dependencies & scripts
└── tsconfig.json                 # TypeScript compiler configuration
```

---

## 4. Getting Started

### Prerequisites

- **Node.js** `>= 20.x`
- **npm** `>= 10.x`

### Installation & Run

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload when source files change.

### Demo Login Credentials

The application uses client-side simulated authentication with three built-in roles:

| Role | Username | Password | Access Scope |
|---|---|---|---|
| **Admin** | `admin` | `admin123` | Full access to all modules, CRM, properties, and portfolio |
| **Agent** | `agent` | `agent123` | Access to Property Management and CRM (Agents, Clients, Enquiries) |
| **Investor** | `investor` | `investor123` | Access to Portfolio Dashboard, Investments, Market Trends & ROI Calculator |

---

## 5. Application Routes

All routes are lazily loaded standalone components:

| Route | Component | Auth Required | Description |
|---|---|:---:|---|
| `/` | — | No | Redirects to `/properties` |
| `/properties` | `PropertyList` | No | Browse all property cards with filters |
| `/properties/new` | `PropertyForm` | ✅ Yes | Add a new property listing |
| `/properties/:id` | `PropertyDetail` | No | Full property details, specs, gallery & enquiry |
| `/properties/:id/edit` | `PropertyForm` | ✅ Yes | Edit an existing property listing |
| `/search` | `SearchPage` | No | Multi-parameter search with sidebar filter panel |
| `/compare` | `ComparePage` | No | Side-by-side comparison table (up to 3 properties) |
| `/login` | `Login` | No | Authentication page with pre-filled demo role buttons |
| `/crm/agents` | `AgentList` | ✅ Yes | Manage real estate agents |
| `/crm/clients` | `ClientList` | ✅ Yes | Manage clients & investment preferences |
| `/crm/enquiries` | `EnquiryList` | ✅ Yes | Review and update enquiry lifecycle statuses |
| `/portfolio/dashboard` | `Dashboard` | ✅ Yes | Executive portfolio metrics & financial summary |
| `/portfolio/investments` | `PortfolioList` | ✅ Yes | Investment asset ledger with CRUD operations |
| `/portfolio/trends` | `MarketTrends` | ✅ Yes | Chart.js price per sq ft trend graphs by city |
| `/portfolio/roi-calculator` | `RoiCalculator` | ✅ Yes | Interactive yield and appreciation calculator |
| `/**` | `NotFound` | No | 404 page for unmatched routes |

> **Note:** `/properties/new` is registered before `/properties/:id` in `app.routes.ts` to ensure `new` is not evaluated as a parameter ID.

---

## 6. Core Services & State Architecture

All services are singletons (`providedIn: 'root'`) backed by RxJS `BehaviorSubject` reactive streams and synchronized with `localStorage`.

| Service | Primary Methods & Observables | Responsibility |
|---|---|---|
| **`PropertyService`** | `getAll()`, `getById()`, `add()`, `update()`, `delete()`<br>`properties$` | Manages property listings, auto-generates IDs, calculates price/sq ft, and syncs with `re_properties`. |
| **`SearchService`** | `updateFilter()`, `resetFilters()`<br>`filters$`, `results$` | Handles multi-parameter filtering, debounced query execution, and sorting logic over `PropertyService`. |
| **`CompareService`** | `add()`, `remove()`, `clear()`, `isInCompare()`<br>`selectedIds$`, `comparedProperties$`, `count$` | Manages comparison state with a hard limit of 3 properties; persists selected IDs in `re_compare`. |
| **`AuthService`** | `login()`, `logout()`, `isAuthenticated()`, `getUser()`<br>`currentUser$`, `isLoggedIn$` | Validates demo credentials, tracks session state, and persists active profile in `re_auth_user`. |
| **`PortfolioService`** | `getAll()`, `getById()`, `add()`, `update()`, `delete()`<br>`totalInvested$`, `currentValue$`, `gainLoss$`, `gainLossPercent$`, `totalMonthlyRent$`, `averageRoi$` | Manages investment assets and derives real-time computed financial metrics via RxJS operators. |
| **`AgentService`** | `getAll()`, `getById()`, `add()`, `update()`, `delete()`<br>`agents$` | Manages agent records (ratings, active listings, contact info) synced with `re_agents`. |
| **`ClientService`** | `getAll()`, `getById()`, `add()`, `update()`, `delete()`<br>`clients$` | Manages client records (budget, preferred property type) synced with `re_clients`. |
| **`EnquiryService`** | `getAll()`, `add()`, `updateStatus()`, `delete()`<br>`enquiries$` | Manages property inquiries and tracks status progression (`New` → `In Progress` → `Closed`). |
| **`MarketInsightService`** | `getAllTrends()`, `getTrendsByCity()`, `getCities()` | Loads historical price/sq ft trend records from `market-trends.json`. |
| **`authGuard`** | Functional `CanActivateFn` | Protects private routes; redirects unauthenticated visitors to `/login?returnUrl=...`. |

---

## 7. Data Models

Defined in [`src/app/core/models/models.ts`](src/app/core/models/models.ts):

| Interface | Core Fields | Description |
|---|---|---|
| **`Property`** | `id`, `title`, `description`, `price`, `type`, `city`, `address`, `bedrooms`, `bathrooms`, `area`, `pricePerSqFt`, `amenities`, `images`, `featured`, `createdAt`, `agentId` | Complete representation of a real estate listing. Supported types: `Apartment`, `Villa`, `Commercial`, `Plot`, `Penthouse`. |
| **`Investment`** | `id`, `propertyId`, `propertyTitle`, `city`, `purchasePrice`, `currentValue`, `monthlyRent`, `purchaseDate` | Individual portfolio asset entry used for portfolio analytics. |
| **`Agent`** | `id`, `name`, `email`, `phone`, `city`, `image`, `rating`, `activeListings` | Real estate agent profile with performance and contact details. |
| **`Client`** | `id`, `name`, `email`, `phone`, `city`, `budget`, `preferredType` | Prospective client profile with budget and property preferences. |
| **`Enquiry`** | `id`, `propertyId`, `propertyTitle`, `clientName`, `clientEmail`, `clientPhone`, `message`, `status`, `date` | Property inquiry record. Status options: `New`, `In Progress`, `Closed`. |
| **`MarketTrend`** | `city`, `month`, `avgPricePerSqFt` | Historical price data point for city-level trend charts. |
| **`SearchFilter`** | `keyword`, `city`, `type`, `minPrice`, `maxPrice`, `bedrooms`, `sortBy` | Filter parameters for search queries. Sort options: `price-asc`, `price-desc`, `newest`, `area`. |
| **`AuthUser`** | `username`, `name`, `role`, `email` | Authenticated user session. Roles: `admin`, `agent`, `investor`. |

---

## 8. Authentication & Access Control

Authentication is managed purely on the client side without external backend dependencies:

- **Session Storage:** Active session data is stored in `localStorage` under `re_auth_user`.
- **SSR Safety:** Services check `typeof window !== 'undefined'` before accessing browser storage APIs, preventing SSR execution crashes.
- **Route Guard:** `authGuard` intercepts unauthorized navigation attempts to protected routes (`/crm/*`, `/portfolio/*`, `/properties/new`, `/properties/:id/edit`) and redirects to `/login` with the destination preserved in the `returnUrl` query parameter.

---

## 9. Data Persistence & Seed Assets

The platform uses a two-tier data resolution strategy:

1. **Local Storage Check:** On startup, each service inspects its dedicated `localStorage` key.
2. **Seed Fallback:** If no data exists in storage, the service loads the initial dataset from `public/data/*.json` and seeds `localStorage`.

| Storage Key | Managed Entity | Seed Asset Path |
|---|---|---|
| `re_auth_user` | Current user session | Initialized on login |
| `re_properties` | Property listings | [`public/data/properties.json`](public/data/properties.json) |
| `re_investments` | Portfolio investments | [`public/data/investments.json`](public/data/investments.json) |
| `re_agents` | Agent directory | [`public/data/agents.json`](public/data/agents.json) |
| `re_clients` | Client directory | [`public/data/clients.json`](public/data/clients.json) |
| `re_enquiries` | Customer enquiries | [`public/data/enquiries.json`](public/data/enquiries.json) |
| `re_compare` | Selected comparison IDs | Initialized on user selection |
| — | Historical market trends | [`public/data/market-trends.json`](public/data/market-trends.json) |

---

## 10. Build, SSR & Testing

### Development & Build Commands

```bash
# Run local development server (port 4200)
npm start

# Compile production build (outputs to dist/real-estate-platform)
npm run build

# Build with watch mode for development
npm run watch
```

### Server-Side Rendering (SSR) Execution

```bash
# 1. Build the client and server bundles
npm run build

# 2. Run the Express SSR server
npm run serve:ssr:real-estate-platform
```

### Running Tests

```bash
# Execute unit tests with Vitest
npm test
```
