import React from 'react';
import { CheckCircle2, Clock, XCircle, Check, Zap, AlertCircle } from 'lucide-react';

/**
 * Reusable StatusBadge Component
 * Meets accessibility standards with both text, semantic colors, and visual icons.
 */
export default function StatusBadge({ status = 'active', customLabel = null, className = '' }) {
  const normalized = status.toLowerCase();

  let badgeType = 'neutral';
  let Icon = null;

  switch (normalized) {
    case 'active':
    case 'available':
      badgeType = 'active';
      Icon = CheckCircle2;
      break;
    case 'confirmed':
      badgeType = 'confirmed';
      Icon = Check;
      break;
    case 'pending':
      badgeType = 'pending';
      Icon = Clock;
      break;
    case 'full':
      badgeType = 'full';
      Icon = AlertCircle;
      break;
    case 'cancelled':
      badgeType = 'cancelled';
      Icon = XCircle;
      break;
    case 'completed':
      badgeType = 'completed';
      Icon = CheckCircle2;
      break;
    case 'electric':
      badgeType = 'electric';
      Icon = Zap;
      break;
    default:
      badgeType = 'neutral';
      Icon = CheckCircle2;
      break;
  }

  const label = customLabel || status;

  return (
    <span className={`status-badge badge-${badgeType} ${className}`} role="status">
      {Icon && <Icon size={12} strokeWidth={2.5} aria-hidden="true" />}
      <span>{label}</span>
    </span>
  );
}
