import { describe, expect, it } from 'vitest';
import { calculatePriceRatio, summarizeOffer } from './escrow';

describe('escrow utilities', () => {
  it('calculates the pair ratio for a token swap', () => {
    expect(calculatePriceRatio(1.6, 5400)).toBeCloseTo(0.0002962962962962963, 12);
  });

  it('summarizes the offer status and coverage', () => {
    const summary = summarizeOffer({
      id: 'ES-104',
      maker: '9a4f...8ad2',
      taker: 'C7e1...8f39',
      tokenA: 'SOL',
      tokenB: 'USDC',
      amountA: 1.6,
      amountB: 5400,
      status: 'Locked',
      risk: 'Low',
    });

    expect(summary.ratio).toBeCloseTo(0.0002962962962962963, 12);
    expect(summary.coverage).toBe('Healthy');
    expect(summary.statusTone).toBe('locked');
  });
});
