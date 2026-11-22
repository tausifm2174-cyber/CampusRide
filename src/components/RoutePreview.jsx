import React from 'react';
import { MapPin, Navigation, ArrowDown, Clock } from 'lucide-react';

/**
 * Reusable RoutePreview Component
 * Elegant visual waypoint timeline without requiring external map APIs
 */
export default function RoutePreview({
  from,
  to,
  pickupPoint = null,
  dropoffPoint = null,
  distance = '15–20 km',
  estimatedDuration = '35–45 mins',
  compact = false,
  className = ''
}) {
  if (compact) {
    return (
      <div className={`route-preview-compact ${className}`}>
        <div className="flex items-center gap-2">
          <div className="route-dot origin-dot" title="Pickup" />
          <span className="route-point-name">{from}</span>
          <span className="route-arrow-icon">→</span>
          <div className="route-dot dest-dot" title="Destination" />
          <span className="route-point-name">{to}</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`route-preview-card ${className}`}>
      <div className="route-timeline">
        {/* Origin / Pickup */}
        <div className="route-timeline-step">
          <div className="route-marker origin-marker">
            <MapPin size={16} />
          </div>
          <div className="route-step-details">
            <span className="route-step-tag">Pickup Origin</span>
            <div className="route-step-title">{from}</div>
            {pickupPoint && pickupPoint !== from && (
              <div className="route-step-landmark">{pickupPoint}</div>
            )}
          </div>
        </div>

        {/* Transit Segment */}
        <div className="route-timeline-connector">
          <div className="route-connector-line" />
          <div className="route-transit-badge">
            <Navigation size={12} className="route-transit-icon" />
            <span>{distance}</span>
            <span>•</span>
            <Clock size={12} />
            <span>{estimatedDuration}</span>
          </div>
        </div>

        {/* Destination / Dropoff */}
        <div className="route-timeline-step">
          <div className="route-marker dest-marker">
            <MapPin size={16} />
          </div>
          <div className="route-step-details">
            <span className="route-step-tag">Drop-off Destination</span>
            <div className="route-step-title">{to}</div>
            {dropoffPoint && dropoffPoint !== to && (
              <div className="route-step-landmark">{dropoffPoint}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
