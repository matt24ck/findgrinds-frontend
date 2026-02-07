'use client';

import { clsx } from 'clsx';
import { HTMLAttributes, forwardRef } from 'react';
import { User } from 'lucide-react';

interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt, size = 'md', fallback, ...props }, ref) => {
    const sizes = {
      sm: 'w-8 h-8 text-xs',
      md: 'w-12 h-12 text-sm',
      lg: 'w-16 h-16 text-base',
      xl: 'w-24 h-24 text-xl',
    };

    const iconSizes = {
      sm: 'w-4 h-4',
      md: 'w-6 h-6',
      lg: 'w-8 h-8',
      xl: 'w-12 h-12',
    };

    // Get initials from fallback or alt
    const getInitials = () => {
      const text = fallback || alt || '';
      const words = text.split(' ');
      if (words.length >= 2) {
        return `${words[0][0]}${words[1][0]}`.toUpperCase();
      }
      return text.slice(0, 2).toUpperCase();
    };

    return (
      <div
        ref={ref}
        className={clsx(
          'relative rounded-full overflow-hidden bg-[#F0F7F4] flex items-center justify-center',
          sizes[size],
          className
        )}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={alt || 'Avatar'}
            className="w-full h-full object-cover"
          />
        ) : fallback || alt ? (
          <span className="font-semibold text-[#2D9B6E]">
            {getInitials()}
          </span>
        ) : (
          <User className={clsx('text-[#2D9B6E]', iconSizes[size])} />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

// Avatar group for showing multiple avatars
interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: 'sm' | 'md' | 'lg';
}

export const AvatarGroup = forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, max = 4, size = 'md', children, ...props }, ref) => {
    const childArray = Array.isArray(children) ? children : [children];
    const visible = childArray.slice(0, max);
    const excess = childArray.length - max;

    return (
      <div
        ref={ref}
        className={clsx('flex -space-x-2', className)}
        {...props}
      >
        {visible}
        {excess > 0 && (
          <div className={clsx(
            'relative rounded-full bg-[#ECF0F1] flex items-center justify-center ring-2 ring-white',
            size === 'sm' ? 'w-8 h-8 text-xs' :
            size === 'md' ? 'w-12 h-12 text-sm' :
            'w-16 h-16 text-base'
          )}>
            <span className="font-semibold text-[#5D6D7E]">+{excess}</span>
          </div>
        )}
      </div>
    );
  }
);

AvatarGroup.displayName = 'AvatarGroup';
