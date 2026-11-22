import React from 'react';

/**
 * Reusable LoadingSkeleton Component
 * Provides clean loading states during transition simulation
 */
export default function LoadingSkeleton({ count = 3, type = 'card' }) {
  const items = Array.from({ length: count });

  if (type === 'table') {
    return (
      <div className="skeleton-table">
        {items.map((_, i) => (
          <div key={i} className="skeleton-row" style={{ height: '48px', marginBottom: '8px' }} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
      {items.map((_, i) => (
        <div key={i} className="card skeleton-card" style={{ height: '220px', padding: '1.5rem' }}>
          <div className="skeleton-line" style={{ width: '40%', height: '20px', marginBottom: '1rem' }} />
          <div className="skeleton-line" style={{ width: '70%', height: '28px', marginBottom: '1.5rem' }} />
          <div className="skeleton-line" style={{ width: '90%', height: '16px', marginBottom: '0.5rem' }} />
          <div className="skeleton-line" style={{ width: '60%', height: '16px', marginBottom: '1.5rem' }} />
          <div className="flex justify-between items-center" style={{ marginTop: 'auto' }}>
            <div className="skeleton-line" style={{ width: '30%', height: '24px' }} />
            <div className="skeleton-line" style={{ width: '25%', height: '36px', borderRadius: '8px' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
