import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SwapEscrow',
  description: 'Devnet-only peer-to-peer token swap escrow dashboard.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
