import React, { useId } from 'react';

/**
 * Reusable SelectInput Component
 */
export default function SelectInput({
  id,
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  required = false,
  error = '',
  name,
  disabled = false,
  className = '',
  ...props
}) {
  const generatedId = useId();
  const selectId = id || name || generatedId;

  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="form-label">
          <span>{label}</span>
          {required && <span style={{ color: 'var(--rose-500)', marginLeft: '4px' }}>*</span>}
        </label>
      )}
      <select
        id={selectId}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className={`form-select ${error ? 'error' : ''}`}
        aria-invalid={error ? 'true' : 'false'}
        aria-describedby={error ? `${selectId}-error` : undefined}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((opt) => {
          const optValue = typeof opt === 'object' ? opt.value : opt;
          const optLabel = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={optValue} value={optValue}>
              {optLabel}
            </option>
          );
        })}
      </select>
      {error && (
        <span id={`${selectId}-error`} className="form-error-text" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
