/**
 * Core Data Models for Real Estate Investment & Property Portfolio Platform
 */

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number; // In INR (₹)
  type: 'Apartment' | 'Villa' | 'Commercial' | 'Plot' | 'Penthouse';
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number; // In sq ft
  pricePerSqFt: number; // Calculated or base (price / area)
  amenities: string[];
  images: string[];
  featured?: boolean;
  createdAt: string; // ISO date string
  agentId?: string;
}

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  image?: string;
  rating?: number;
  activeListings?: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  budget?: number;
  preferredType?: string;
}

export interface Enquiry {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  message: string;
  status: 'New' | 'In Progress' | 'Closed';
  date: string; // ISO date string
}

export interface Investment {
  id: string;
  propertyId: string;
  propertyTitle: string;
  city: string;
  purchasePrice: number;
  currentValue: number;
  monthlyRent: number;
  purchaseDate: string; // YYYY-MM-DD
}

export interface MarketTrend {
  city: string;
  month: string; // e.g. "Jan", "Feb" or "2026-01"
  avgPricePerSqFt: number;
}

export interface SearchFilter {
  keyword?: string;
  city?: string;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'area';
}

