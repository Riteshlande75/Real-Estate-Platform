import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarketTrends } from './market-trends';

describe('MarketTrends', () => {
  let component: MarketTrends;
  let fixture: ComponentFixture<MarketTrends>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketTrends],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketTrends);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
