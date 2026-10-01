# SwapEscrow

SwapEscrow is a devnet-only escrow interface for a peer-to-peer token swap flow. It demonstrates a maker/taker matching experience, a vault-style settlement summary, and a status UI for deposits, swaps, and refunds.

## Honest status

This repo is a polished portfolio prototype. It is not a validated Anchor program deployment yet. The current implementation models escrow logic in a deterministic mock service so the product flow is realistic and build-verified without claiming live on-chain settlement.

## Features

- maker and taker order cards
- escrow state timeline
- swap proportions and risk panel
- cancellation/refund flow states
- devnet-only messaging and wallet hints

## Tech stack

- Next.js 15
- React 19
- TypeScript
- Vitest
- Solana devnet guidance

## Run locally

```bash
cd projects/swapescrow
pnpm install
cp .env.example .env.local
pnpm dev
```

## Tests

```bash
pnpm test
pnpm build
```

## What I'd improve next

- Replace the mock vault logic with a real Anchor PDA escrow program
- Add wallet signing and devnet confirmations with Phantom or Backpack
- Persist offers and settlement history in Postgres or a lightweight DB
- Add maker/taker match logic and refund automation after final verification

## Note

Any real on-chain flow should run on devnet only and never imply mainnet funds or production settlement.
