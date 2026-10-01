export type EscrowStatus = 'Open' | 'Locked' | 'Settled' | 'Cancelled';

export type EscrowOffer = {
  id: string;
  maker: string;
  taker: string;
  tokenA: string;
  tokenB: string;
  amountA: number;
  amountB: number;
  status: EscrowStatus;
  risk: 'Low' | 'Medium' | 'High';
};

export const offers: EscrowOffer[] = [
  {
    id: 'ES-104',
    maker: '9a4f...8ad2',
    taker: 'C7e1...8f39',
    tokenA: 'SOL',
    tokenB: 'USDC',
    amountA: 1.6,
    amountB: 5400,
    status: 'Locked',
    risk: 'Low',
  },
  {
    id: 'ES-109',
    maker: 'A91d...76bd',
    taker: 'D2af...1ab1',
    tokenA: 'USDC',
    tokenB: 'BONK',
    amountA: 1200,
    amountB: 860000,
    status: 'Open',
    risk: 'Medium',
  },
  {
    id: 'ES-111',
    maker: '5af2...880c',
    taker: '3b60...d742',
    tokenA: 'BONK',
    tokenB: 'SOL',
    amountA: 500000,
    amountB: 1.2,
    status: 'Settled',
    risk: 'Low',
  },
];

export function calculatePriceRatio(amountA: number, amountB: number) {
  if (amountB === 0) return 0;
  return amountA / amountB;
}

export function summarizeOffer(offer: EscrowOffer) {
  return {
    ratio: calculatePriceRatio(offer.amountA, offer.amountB),
    statusTone: offer.status.toLowerCase(),
    coverage: offer.risk === 'Low' ? 'Healthy' : offer.risk === 'Medium' ? 'Watch' : 'High risk',
  };
}
