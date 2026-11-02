import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { MarketInsightService } from '../../core/services/market-insight.service';
import { MarketTrend } from '../../core/models/models';

@Component({
  selector: 'app-market-trends',
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './market-trends.html',
  styleUrl: './market-trends.css',
})
export class MarketTrends implements OnInit {
  private readonly marketInsightService = inject(MarketInsightService);

  // Available cities from market service
  readonly cities$ = this.marketInsightService.getCities();
  selectedCity = 'Mumbai';

  // Current market stats
  currentRate = 0;
  rateChange = 0;
  rateChangePercent = 0;

  // Chart configuration
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'Avg Price / Sq Ft (INR)',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        borderColor: '#2563eb',
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointHoverBackgroundColor: '#ffffff',
        pointHoverBorderColor: '#2563eb',
        fill: 'origin',
        tension: 0.35,
      },
    ],
    labels: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: (context) => ` Rate: ₹${context.parsed.y} / sq ft`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (value) => '₹' + value,
        },
        grid: {
          color: '#f1f5f9',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  ngOnInit(): void {
    this.loadTrendsForCity(this.selectedCity);
  }

  /**
   * Fetches monthly historical trend data for the selected city and feeds Chart.js
   */
  loadTrendsForCity(city: string): void {
    this.selectedCity = city;
    this.marketInsightService.getTrendsByCity(city).subscribe((trends: MarketTrend[]) => {
      if (trends && trends.length > 0) {
        const labels = trends.map((t) => t.month);
        const dataPoints = trends.map((t) => t.avgPricePerSqFt);

        this.lineChartData = {
          labels,
          datasets: [
            {
              data: dataPoints,
              label: `${city} Rate (₹/sq ft)`,
              backgroundColor: 'rgba(37, 99, 235, 0.12)',
              borderColor: '#2563eb',
              pointBackgroundColor: '#2563eb',
              pointBorderColor: '#ffffff',
              fill: 'origin',
              tension: 0.35,
            },
          ],
        };

        const first = dataPoints[0] || 0;
        const latest = dataPoints[dataPoints.length - 1] || 0;
        this.currentRate = latest;
        this.rateChange = latest - first;
        this.rateChangePercent = first > 0 ? Number((((latest - first) / first) * 100).toFixed(1)) : 0;
      }
    });
  }

  onCityChange(city: string): void {
    this.loadTrendsForCity(city);
  }
}
