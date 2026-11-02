import { TestBed } from '@angular/core/testing';

import { MarketInsight } from './market-insight';

describe('MarketInsight', () => {
  let service: MarketInsight;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarketInsight);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
