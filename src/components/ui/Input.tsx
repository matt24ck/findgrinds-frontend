'use client';

import { clsx } from 'clsx';
import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-[#2C3E50] mb-1.5"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={clsx(
            'w-full px-4 py-3 rounded-lg border text-[#2C3E50] placeholder-[#95A5A6]',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-[#E74C3C] focus:border-[#E74C3C] focus:ring-[#E74C3C]/20'
              : 'border-[#D5DBDB] focus:border-[#2D9B6E] focus:ring-[#2D9B6E]/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[#E74C3C]">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1.5 text-sm text-[#95A5A6]">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// Select component
interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-sm font-medium text-[#2C3E50] mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full px-4 py-3 rounded-lg border text-[#2C3E50] bg-white',
            'transition-colors duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-[#E74C3C] focus:border-[#E74C3C] focus:ring-[#E74C3C]/20'
              : 'border-[#D5DBDB] focus:border-[#2D9B6E] focus:ring-[#2D9B6E]/20',
            className
          )}
          {...props}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1.5 text-sm text-[#E74C3C]">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Textarea component
interface TextareaProps extends InputHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  rows?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, rows = 4, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-sm font-medium text-[#2C3E50] mb-1.5"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={clsx(
            'w-full px-4 py-3 rounded-lg border text-[#2C3E50] placeholder-[#95A5A6]',
            'transition-colors duration-200 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-[#E74C3C] focus:border-[#E74C3C] focus:ring-[#E74C3C]/20'
              : 'border-[#D5DBDB] focus:border-[#2D9B6E] focus:ring-[#2D9B6E]/20',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-[#E74C3C]">{error}</p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
