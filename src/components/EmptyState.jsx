import React from 'react';
import { Search } from 'lucide-react';
import Button from './Button';

/**
 * Reusable EmptyState Component
 */
export default function EmptyState({
  icon = <Search size={32} />,
  title = 'No results found',
  description = 'Try adjusting your search criteria or checking back later.',
  actionLabel = null,
  onAction = null,
  actionTo = null,
  className = ''
}) {
  return (
    <div className={`empty-state ${className}`}>
      <div className="empty-state-icon" aria-hidden="true">
        {icon}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onAction}
          to={actionTo}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
