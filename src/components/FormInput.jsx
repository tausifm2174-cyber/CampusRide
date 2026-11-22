import React, { useId } from 'react';

/**
 * Reusable FormInput Component
 * Supports accessible labels, error messages, and various input types
 */
export default function FormInput({
  id,
  label,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  helpText = '',
  name,
  disabled = false,
  className = '',
  min,
  max,
  step,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || name || generatedId;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="form-label">
          <span>{label}</span>
          {required && <span style={{ color: 'var(--rose-500)', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`form-input ${error ? 'error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
        {...props}
      />
      {error && (
        <span id={`${inputId}-error`} className="form-error-text" role="alert">
          {error}
        </span>
      )}
      {helpText && !error && (
        <span id={`${inputId}-help`} className="form-error-text" style={{ color: 'var(--text-muted)' }}>
          {helpText}
        </span>
      )}
    </div>
  );
}
