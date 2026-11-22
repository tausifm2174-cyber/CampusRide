import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import Button from './Button';

/**
 * Reusable RatingModal Component
 * Allows passengers to rate driver (1-5 stars) for completed rides
 * Fully accessible with Escape key dismiss and responsive viewport fit
 */
export default function RatingModal({
  isOpen,
  booking,
  onSubmitRating,
  onClose
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');

  // Handle Escape key and lock body scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
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
  }, [isOpen, onClose]);

  if (!isOpen || !booking) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitRating(booking.id, booking.rideId, rating, comment);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="rating-modal-title">
      <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 id="rating-modal-title" className="modal-title">Rate Your Experience</h3>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close rating modal">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ padding: '0.75rem 0' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem', marginBottom: '1.25rem' }}>
              How was your journey with <strong>{booking.driver}</strong> on the <strong>{booking.route}</strong> route?
            </p>

            {/* Interactive Stars */}
            <div className="flex justify-center items-center gap-2" style={{ marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    className="star-rating-btn"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                  >
                    <Star
                      size={32}
                      fill={isFilled ? '#f59e0b' : 'none'}
                      color={isFilled ? '#f59e0b' : '#cbd5e1'}
                      strokeWidth={1.75}
                    />
                  </button>
                );
              })}
            </div>

            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#b45309', marginBottom: '1rem' }}>
              {rating === 5 && 'Outstanding • Smooth ride & punctual!'}
              {rating === 4 && 'Great • Friendly driver & safe travel'}
              {rating === 3 && 'Good • Reached campus as scheduled'}
              {rating === 2 && 'Fair • Minor delays experienced'}
              {rating === 1 && 'Poor • Significant route issues'}
            </div>

            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="rating-comment" className="form-label">
                Feedback Comment (Optional)
              </label>
              <textarea
                id="rating-comment"
                rows={2}
                className="form-textarea"
                placeholder="e.g. Very pleasant commute, great college playlist!"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
          </div>

          <div className="modal-footer" style={{ justifyContent: 'center', gap: '0.75rem' }}>
            <Button variant="secondary" onClick={onClose} type="button">
              Skip
            </Button>
            <Button variant="accent" type="submit">
              Submit Rating
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
