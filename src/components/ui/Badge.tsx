'use client';

import { clsx } from 'clsx';
import { HTMLAttributes, forwardRef } from 'react';
import { Star, CheckCircle } from 'lucide-react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'primary' | 'featured' | 'professional' | 'enterprise' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
    const variants = {
      default: 'bg-[#ECF0F1] text-[#5D6D7E]',
      primary: 'bg-[#F0F7F4] text-[#2D9B6E]',
      featured: 'bg-[#D4A574] text-white',
      professional: 'bg-[#2D9B6E] text-white',
      enterprise: 'bg-[#D4A574] text-white',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      info: 'bg-blue-100 text-blue-800',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs',
      md: 'px-3 py-1 text-xs',
    };

    return (
      <span
        ref={ref}
        className={clsx(
          'inline-flex items-center gap-1 font-semibold rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {variant === 'featured' && <Star className="w-3 h-3 fill-current" />}
        {(variant === 'professional' || variant === 'enterprise') && <CheckCircle className="w-3 h-3 fill-current" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

// Level badges for JC/LC
interface LevelBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  level: 'JC' | 'LC';
}

export const LevelBadge = forwardRef<HTMLSpanElement, LevelBadgeProps>(
  ({ level, className, ...props }, ref) => (
    <Badge
      ref={ref}
      variant={level === 'LC' ? 'primary' : 'default'}
      className={className}
      {...props}
    >
      {level === 'LC' ? 'Leaving Cert' : 'Junior Cert'}
    </Badge>
  )
);

LevelBadge.displayName = 'LevelBadge';

// Verified badge
export const VerifiedBadge = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <Badge ref={ref} variant="success" className={className} {...props}>
      Garda Vetted
    </Badge>
  )
);

VerifiedBadge.displayName = 'VerifiedBadge';
