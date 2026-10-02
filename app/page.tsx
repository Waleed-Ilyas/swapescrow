'use client';

import { useMemo, useState } from 'react';
import { offers as initialOffers, summarizeOffer } from '@/lib/escrow';

const statusFilters = ['All', 'Open', 'Locked', 'Settled', 'Cancelled'] as const;

type StatusFilter = (typeof statusFilters)[number];

const stats = [
  { label: 'Open orders', value: '14', tone: 'blue' },
  { label: 'Escrow locked', value: '3.4 SOL', tone: 'green' },
  { label: 'Avg fill time', value: '12m', tone: 'purple' },
  { label: 'Refund risk', value: '2%', tone: 'amber' },
];

export default function Page() {
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>('All');
  const [offers, setOffers] = useState(initialOffers);
  const [selectedId, setSelectedId] = useState(offers[0]?.id ?? '');
  const [isProcessing, setIsProcessing] = useState(false);

  const visibleOffers =
    selectedStatus === 'All' ? offers : offers.filter((offer) => offer.status === selectedStatus);

  const selectedOffer =
    visibleOffers.find((offer) => offer.id === selectedId) ?? visibleOffers[0] ?? offers[0];

  const selectedSummary = selectedOffer ? summarizeOffer(selectedOffer) : null;

  const riskSummary = useMemo(() => {
    const counts = { Low: 0, Medium: 0, High: 0 };
    for (const offer of offers) counts[offer.risk] += 1;
    return counts;
  }, [offers]);

  const handleAction = async (action: 'Cancel' | 'Settle') => {
    setIsProcessing(true);
    // Simulate smart contract interaction delay
    await new Promise(r => setTimeout(r, 1500));
    setOffers(offers.map(o => {
      if (o.id === selectedId) {
        return { ...o, status: action === 'Cancel' ? 'Cancelled' : 'Settled' };
      }
      return o;
    }));
    setIsProcessing(false);
  };

  return (
    <div className="shell">
      <header className="topbar">
        <div className="brand">
          <span className="brand-dot" />
          <span>SwapEscrow</span>
        </div>
        <div className="header-actions">
          <button className="pill">Devnet only</button>
          <button className="primary">Create offer</button>
        </div>
      </header>

      <section className="stats">
        {stats.map((stat) => (
          <div key={stat.label} className="card">
            <div style={{ color: '#9db7c8', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{stat.label}</div>
            <span className="value">{stat.value}</span>
          </div>
        ))}
      </section>

      <div className="filter-row" aria-label="Escrow status filters">
        {statusFilters.map((status) => (
          <button
            key={status}
            type="button"
            className={'filter-pill ' + (selectedStatus === status ? 'active' : '')}
            onClick={() => setSelectedStatus(status)}
          >
            {status}
          </button>
        ))}
      </div>

      <div className="grid">
        <section className="card">
          <h2 style={{ marginTop: 0 }}>Market orders</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Deal</th>
                <th>Amount</th>
                <th>Risk</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {visibleOffers.map((offer) => {
                const summary = summarizeOffer(offer);
                const isSelected = selectedOffer?.id === offer.id;

                return (
                  <tr
                    key={offer.id}
                    className={isSelected ? 'row-selected' : ''}
                    onClick={() => setSelectedId(offer.id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td>
                      <div>{offer.id}</div>
                      <div className="meta">{offer.maker} -> {offer.taker}</div>
                    </td>
                    <td>
                      <div>{offer.amountA} {offer.tokenA}</div>
                      <div className="meta">for {offer.amountB} {offer.tokenB}</div>
                    </td>
                    <td>{summary.coverage}</td>
                    <td><span className={'badge ' + summary.statusTone}>{offer.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <aside className="panel-stack">
          {selectedOffer && selectedSummary ? (
            <div className="card">
              <h3 style={{ marginTop: 0 }}>{selectedOffer.id}</h3>
              <div className="mini">
                <strong>{selectedOffer.tokenA} / {selectedOffer.tokenB}</strong>
                <div className="meta">{selectedOffer.amountA} {selectedOffer.tokenA} -> {selectedOffer.amountB} {selectedOffer.tokenB}</div>
                <div className="meta">Ratio {selectedSummary.ratio.toFixed(4)} - {selectedOffer.risk} risk</div>
              </div>
              <div className="detail-block">
                <div><strong>Maker</strong><div className="meta">{selectedOffer.maker}</div></div>
                <div><strong>Taker</strong><div className="meta">{selectedOffer.taker}</div></div>
                <div><strong>Status</strong><div className="meta">{selectedOffer.status}</div></div>
              </div>
              {selectedOffer.status === 'Open' || selectedOffer.status === 'Locked' ? (
                <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                  <button className="primary" style={{ flex: 1, padding: 8 }} disabled={isProcessing} onClick={() => handleAction('Settle')}>
                    {isProcessing ? 'Processing...' : 'Settle Swap'}
                  </button>
                  <button className="pill" style={{ flex: 1, padding: 8 }} disabled={isProcessing} onClick={() => handleAction('Cancel')}>
                     Cancel
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: 16, fontSize: 12, color: '#9ca3af', padding: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, textAlign: 'center' }}>
                  This offer is {selectedOffer.status.toLowerCase()}
                </div>
              )}
            </div>
          ) : null}

          <div className="card">
            <h3 style={{ marginTop: 0 }}>Settlement guardrails</h3>
            <div className="warning">
              Escrow locks funds in a vault-style PDA before settlement. The maker can cancel before completion; the taker can finalize only after both asset conditions are met.
            </div>
          </div>
          
          <div className="card">
             <h3 style={{ margin: '0 0 12px 0', fontSize: 16 }}>About this project</h3>
             <p className="note" style={{ color: '#9db7c8', lineHeight: 1.5 }}>SwapEscrow is a Devnet-only Solana Anchor smart contract interface. It simulates atomic token swaps, PDA vault lockups, and maker/taker settlement flows in a risk-aware environment. Built for educational and portfolio purposes.</p>
             <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
                <a href="https://github.com/Waleed-Ilyas/swapescrow" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontSize: 13, textDecoration: 'none' }}>View on GitHub</a>
                <a href="/work/swapescrow" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', fontSize: 13, textDecoration: 'none' }}>Read Case Study</a>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
