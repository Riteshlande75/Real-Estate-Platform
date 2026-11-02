import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, map } from 'rxjs';
import { MarketTrend } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class MarketInsightService {
  private readonly http = inject(HttpClient);

  // Cached observable of all historical trend data points
  private readonly trends$ = this.http
    .get<MarketTrend[]>('/data/market-trends.json')
    .pipe(shareReplay(1));

  /**
   * Returns all trend records across all cities.
   */
  getAllTrends(): Observable<MarketTrend[]> {
    return this.trends$;
  }

  /**
   * Returns historical monthly price data filtered for a specific city.
   */
  getTrendsByCity(city: string): Observable<MarketTrend[]> {
    return this.trends$.pipe(
      map((trends) =>
        trends.filter((t) => t.city.toLowerCase() === city.toLowerCase())
      )
    );
  }

  /**
   * Returns unique list of available market cities.
   */
  getCities(): Observable<string[]> {
    return this.trends$.pipe(
      map((trends) => Array.from(new Set(trends.map((t) => t.city))))
    );
  }
}

