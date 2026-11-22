import React, { useEffect } from 'react';
import { X, HelpCircle } from 'lucide-react';
import Button from './Button';

/**
 * Reusable ConfirmDialog Component for CampusRide
 * Handles Join Ride, Cancel Booking, and Cancel Ride interactions
 */
export default function ConfirmDialog({
  isOpen,
  title,
  message,
  details = null,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  confirmVariant = 'accent',
  onConfirm,
  onCancel,
  icon = null
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onCancel} role="dialog" aria-modal="true" aria-labelledby="dialog-title">
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="flex items-center gap-2">
            {icon || <HelpCircle size={22} color="var(--accent-600)" />}
            <h3 id="dialog-title" className="modal-title">{title}</h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onCancel}
            aria-label="Close dialog"
          >
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {message && (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: details ? '1rem' : 0 }}>
              {message}
            </p>
          )}

          {details && (
            <div
              style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                margin: '1rem 0'
              }}
            >
              {details}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <Button variant="secondary" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant={confirmVariant} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
