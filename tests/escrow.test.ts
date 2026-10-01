import { describe, expect, it } from 'vitest';
import { calculatePriceRatio, offers, summarizeOffer } from '@/lib/escrow';

describe('SwapEscrow pricing', () => {
  it('computes a ratio for the offer values', () => {
    expect(calculatePriceRatio(1.6, 5400)).toBeCloseTo(0.0002962963, 8);
  });

  it('summarizes risk and status for each offer', () => {
    const summary = summarizeOffer(offers[1]);
    expect(summary.coverage).toBe('Watch');
    expect(summary.statusTone).toBe('open');
  });

  it('keeps the offer list seeded', () => {
    expect(offers.length).toBeGreaterThan(0);
  });
});
