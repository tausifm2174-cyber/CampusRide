import React from 'react';

/**
 * Reusable StatisticCard Component for metrics display
 */
export default function StatisticCard({
  value,
  label,
  icon,
  note = 'Prototype metric',
  className = ''
}) {
  return (
    <div className={`stat-card card-hover ${className}`}>
      {icon && <div className="stat-icon-wrapper">{icon}</div>}
      <div>
        <div className="stat-value">{value}</div>
        <div className="stat-label">{label}</div>
        {note && <div className="stat-note">{note}</div>}
      </div>
    </div>
  );
}
