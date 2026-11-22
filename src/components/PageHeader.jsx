import React from 'react';

/**
 * Reusable PageHeader Component
 * Provides clean title, subtitle, optional breadcrumb or badge, and action slot
 */
export default function PageHeader({
  title,
  description,
  badge = null,
  actions = null,
  className = ''
}) {
  return (
    <div className={`page-header ${className}`}>
      <div className="container">
        <div className="page-header-inner">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="page-title">{title}</h1>
              {badge && <div className="page-header-badge">{badge}</div>}
            </div>
            {description && <p className="page-description">{description}</p>}
          </div>
          {actions && <div className="page-header-actions">{actions}</div>}
        </div>
      </div>
    </div>
  );
}
