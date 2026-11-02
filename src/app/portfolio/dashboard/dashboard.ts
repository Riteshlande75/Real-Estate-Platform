import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';
import { map } from 'rxjs/operators';

import { PropertyService } from '../../core/services/property.service';
import { PortfolioService } from '../../core/services/portfolio.service';
import { EnquiryService } from '../../core/services/enquiry.service';
import { MarketInsightService } from '../../core/services/market-insight.service';
import { Investment, MarketTrend } from '../../core/models/models';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private readonly propertyService = inject(PropertyService);
  private readonly portfolioService = inject(PortfolioService);
  private readonly enquiryService = inject(EnquiryService);
  private readonly marketInsightService = inject(MarketInsightService);

  // High-level KPI streams
  readonly totalPropertiesCount$ = this.propertyService.getAll().pipe(map((list) => list.length));
  readonly totalInvested$ = this.portfolioService.totalInvested$;
  readonly currentValue$ = this.portfolioService.currentValue$;
  readonly gainLoss$ = this.portfolioService.gainLoss$;
  readonly gainLossPercent$ = this.portfolioService.gainLossPercent$;
  readonly averageRoi$ = this.portfolioService.averageRoi$;
  readonly openEnquiriesCount$ = this.enquiryService.getAll().pipe(
    map((list) => list.filter((e) => e.status !== 'Closed').length)
  );

  // Bar Chart: Asset Value by Regional City
  public barChartType: ChartType = 'bar';
  public barChartData: ChartConfiguration['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Portfolio Value (₹ Cr)',
        backgroundColor: [
          'rgba(37, 99, 235, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(139, 92, 246, 0.8)',
          'rgba(236, 72, 153, 0.8)',
        ],
        borderRadius: 6,
      },
    ],
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx) => ` Value: ₹${ctx.parsed.y} Cr`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (val) => '₹' + val + ' Cr',
        },
        grid: { color: '#f1f5f9' },
      },
      x: { grid: { display: false } },
    },
  };

  // Line Chart: Multi-City Market Rates Trend
  public lineChartType: ChartType = 'line';
  public lineChartData: ChartConfiguration['data'] = {
    labels: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    datasets: [],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.parsed.y}/sq ft`,
        },
      },
    },
    scales: {
      y: {
        ticks: {
          callback: (val) => '₹' + val,
        },
        grid: { color: '#f1f5f9' },
      },
      x: { grid: { display: false } },
    },
  };

  ngOnInit(): void {
    this.initBarChart();
    this.initLineChart();
  }

  /**
   * Groups investment portfolio by city and calculates valuation in Crores
   */
  private initBarChart(): void {
    this.portfolioService.getAll().subscribe((investments: Investment[]) => {
      const cityMap: Record<string, number> = {};
      investments.forEach((inv) => {
        cityMap[inv.city] = (cityMap[inv.city] || 0) + (Number(inv.currentValue) || 0);
      });

      const labels = Object.keys(cityMap);
      const valuesInCr = labels.map((city) =>
        Number((cityMap[city] / 10000000).toFixed(2))
      );

      this.barChartData = {
        labels,
        datasets: [
          {
            data: valuesInCr,
            label: 'Asset Value (₹ Cr)',
            backgroundColor: [
              'rgba(37, 99, 235, 0.85)',
              'rgba(16, 185, 129, 0.85)',
              'rgba(245, 158, 11, 0.85)',
              'rgba(139, 92, 246, 0.85)',
            ],
            borderRadius: 6,
          },
        ],
      };
    });
  }

  /**
   * Initializes market appreciation comparison line chart
   */
  private initLineChart(): void {
    this.marketInsightService.getAllTrends().subscribe((trends: MarketTrend[]) => {
      if (!trends || trends.length === 0) return;

      const cities = ['Mumbai', 'Bengaluru', 'Hyderabad', 'Pune'];
      const months = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
      const colors = ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'];

      const datasets = cities.map((city, idx) => {
        const cityData = months.map((month) => {
          const match = trends.find((t) => t.city === city && t.month === month);
          return match ? match.avgPricePerSqFt : 0;
        });

        return {
          data: cityData,
          label: city,
          borderColor: colors[idx % colors.length],
          backgroundColor: 'transparent',
          tension: 0.35,
          pointRadius: 3,
        };
      });

      this.lineChartData = {
        labels: months,
        datasets,
      };
    });
  }

  /**
   * Formats Indian currency (INR)
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  }
}
